import { createContext, useContext, useMemo, useRef, useState } from 'react';
import { auth } from '../config/firebase';
import {
    updateProfile,
    signOut,
    reauthenticateWithCredential,
    EmailAuthProvider,
    verifyBeforeUpdateEmail,
    updatePassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from 'firebase/auth';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router';
import { useAlert } from './alertContext';
import { useSearchParams } from 'react-router-dom';
import { useSessionStorage } from '../hooks/useSessionStorage';
import {
    loadUserDataFromFirestore,
    loadSettingsFromFirestore,
    loadMotivationFromFirestore,
    addNewUserInFirestore,
    loadInvitation,
    addInvitedUserInFirestore,
    deleteInvitationCodeInFirestore,
    updateUserDataInFirestore,
    addConnectedUserInFirestore,
    changeFamilyConnectionInFirestore,
} from '../services/firestore';
import defaultUserSettings from '../data/defaultUserSettings';

const UserContext = createContext();

function UserPovider({ children }) {
    const { setError, setSuccess } = useAlert();
    const [activeUser, setActiveUser] = useState(null);
    const [isGuest, setIsGuest] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [message, setMessage] = useState('');
    const [familyID, setFamilyID] = useState('');
    const [availableFamilies, setAvailableFamilies] = useState([]);
    const [familyManagement, setFamilyManagement] = useState({});
    const [appSettings, setAppSettings] = useState({});
    const [activeYears, setActiveYears] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [lastPage, setLastPage] = useSessionStorage('lastPage');
    const [loggedIn, setLoggedIn] = useSessionStorage('loggedIn');
    const [activePage, setActivePage] = useState(lastPage);
    const [motivationSentence, setMotivationSentence] = useState('');
    const [isMotivationLoaded, setIsMotivationLoaded] = useState(false);
    const [greeting, setGreeting] = useState('Hallo');
    const [searchParams] = useSearchParams('');
    const [yearDay] = useState(dayOfYear());
    const deferredPrompt = useRef(null);
    const navigate = useNavigate();

    /**
     * signs the new user up (new family or existing with invitation code)
     * creates firestore user account
     * creates initial user settings
     * @param {string} username - username from signup form
     * @param {string} email - email from signup form
     * @param {string} password - password from signup form
     * @param {string} invitationCode - invitation code from signup form
     * @param {string} invited - yes or no from signup form
     */
    async function signUpUser(username, email, password, invitationCode, invited) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newFamilyID = await getFamilyID(invitationCode, invited);
            const user = userCredential.user;
            await setNewUserData(user, username, newFamilyID, invited, invitationCode);
            await updateProfile(auth.currentUser, {
                displayName: username,
            });
            await authCheck();
            await sendEmailVerification(auth.currentUser);
            setSuccess('Du bist erfolgreich eingeloggt!');
        } catch (err) {
            setError('Irgendetwas ist schiefgelaufen. Versuch es noch einmal.');
        }
    }

    /**
     * sets all user documents in firestore (settings, events)
     * deletes invitation
     * @param {string} user - user from auth
     * @param {string} username - username from signup form
     * @param {string} newFamilyID - new familyID or from invitation
     * @param {string} invited - yes or no from signup form
     * @param {string} invitationCode - invitation code from signup form
     */
    async function setNewUserData(user, username, newFamilyID, invited, invitationCode) {
        const userID = user.uid;
        const events = [];
        const defaultSettings = defaultUserSettings;
        const defaultFamilyName = 'Meine Familie';
        const defaultManagement = { invited: [], name: defaultFamilyName, member: [userID], id: newFamilyID };
        const defaultUserProfile = { id: userID, name: username, photo: '' };
        let newUser = user;
        newUser.displayName = username;
        setActiveUser(newUser);

        if (invited === 'Ja') {
            const invitation = await loadInvitation(invitationCode);
            await addInvitedUserInFirestore(userID, newFamilyID, defaultUserProfile);
            deleteInvitationCodeInFirestore(invitationCode, invitation, newFamilyID);
        } else {
            await addNewUserInFirestore(userID, newFamilyID, defaultSettings, events, defaultManagement, defaultUserProfile);
        }
    }

    /**
     * checks invitation code from signup form
     * creates a new familyID or gets it from invitation
     * @param {string} invitationCode - invitation code from signup form
     * @param {string} invited - yes or no from signup form
     * @returns - familyID
     */
    async function getFamilyID(invitationCode, invited) {
        if (invited === 'Ja') {
            const familyIDFromInvitation = await loadInvitation(invitationCode);
            return familyIDFromInvitation.familyID;
        } else {
            return crypto.randomUUID();
        }
    }

    /**
     * adds a new family to user after invitation
     * @param {string} invitationCode - invitation code from email
     */
    async function addNewFamilyConnection(invitationCode) {
        const invitation = await loadInvitation(invitationCode);
        const newFamilyID = invitation.familyID;
        await addConnectedUserInFirestore(auth.currentUser.uid, newFamilyID);
        deleteInvitationCodeInFirestore(invitationCode, invitation, newFamilyID);
    }

    /**
     * connects with the selected family from drop down
     * @param {string} familyID - new family to be connected
     */
    async function connectFamily(familyID) {
        await changeFamilyConnectionInFirestore(auth.currentUser.uid, familyID);
        setFamilyID(familyID);
    }

    /**
     * signs in user with email and password
     * @param {string} email - email of user
     * @param {string} password - password of user
     */
    async function signInUser(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setActiveUser(user);
            setLoggedIn(true);
            navigate('app/dashboard?page=Dashboard');
            setSuccess('Du bist erfolgreich eingeloggt!');
        } catch (err) {
            setError('Deine Login-Daten waren nicht korrekt!');
        }
    }

    /**
     * signs out user
     */
    async function signOutUser() {
        try {
            await signOut(auth);
            setLoggedIn(false);
            setActiveUser(null);
            setFamilyID('');
            setSuccess('Du hast dich erfolgreich ausgeloggt!');
            setActivePage('');
            navigate('/');
        } catch (err) {
            setError('Irgendetwas ist schiefgelaufen. Versuch es noch einmal.');
        }
    }

    /**
     * updates user data in user collection
     * @param {string} displayName - display name of user
     * @param {string} photoURL - photo url of user in firebase storage
     */
    function updateUserData(displayName, photoURL) {
        const newUserData = {
            id: auth.currentUser.uid,
            name: displayName,
            photo: photoURL,
        };
        updateUserDataInFirestore(auth.currentUser.uid, newUserData);
    }

    /**
     * updates user profile in firebase auth
     * @param {string} displayName - display name of user
     * @param {string} photoURL - photo url of user in firebase storage
     */
    async function updateUserProfile(displayName, photoURL) {
        try {
            await updateProfile(auth.currentUser, {
                displayName: displayName,
                photoURL: photoURL,
            });
            updateUserData(displayName, photoURL);
            setSuccess('Dein Profil wurde erfolgreich aktualisiert!');
        } catch (err) {
            setError('Irgendetwas ist schiefgelaufen. Versuch es noch einmal.');
        }
    }

    /**
     * updates to new user email after verify link is clicked (new email adress)
     * signs the ouser out after 5 seconds
     * @param {string} password - actual password from email change form
     */
    async function updateUserEmail(password) {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
        try {
            await reauthenticateWithCredential(auth.currentUser, credential);
            await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
            setSuccess('Bestigungslink wurde versendet. Du wirst in 5 Sekunden automatisch abgemeldet!');
            setTimeout(() => {
                signOutUser();
            }, 5000);
        } catch (err) {
            setError('Passwort nicht korrekt!');
            throw err;
        }
    }

    /**
     * updates to new user password
     * signs the ouser out after 5 seconds
     * @param {string} password - actual password from password change form
     */
    async function updateUserPassword(oldPassword, newPassword) {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, oldPassword);
        try {
            await reauthenticateWithCredential(auth.currentUser, credential);
            await updatePassword(auth.currentUser, newPassword);
            setSuccess('Dein Passwort wurde geändert. Du wirst in 5 Sekunden automatisch abgemeldet!');
            setTimeout(() => {
                signOutUser();
            }, 5000);
        } catch (err) {
            setError('Passwort nicht korrekt!');
            throw err;
        }
    }

    /**
     * checks if user is authenticated
     * and navigates to last active page or dashboard if session was inactive
     */
    async function authCheck() {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setTimeout(async () => {
                    await loadUserData(user.uid);
                    setActiveUser(user);
                    setIsAuthenticated(true);
                    checkGuest(user.uid);
                    setLoggedIn(true);

                    if (loggedIn) {
                        navigate(`app/${activePage}`);
                    } else {
                        navigate('app/dashboard?page=Dashboard');
                    }
                }, 2000);
            } else {
                setLoading(false);
                setLoggedIn(false);
                setIsAuthenticated(false);

                if (location.pathname !== '/signup') {
                    navigate('/');
                }
            }
        });
    }

    /**
     * checks if id of active user is the guest id (guest id is constant)
     * @param {string} uid - id from auth user
     */
    function checkGuest(uid) {
        if (uid === import.meta.env.VITE_GUEST_ID) {
            setIsGuest(true);
        } else {
            setIsGuest(false);
        }
    }

    /**
     * loads user data from firestore
     * and sets the related family id for database connection
     * and generates a list of active years
     * @param {string} uid - user id
     */
    async function loadUserData(uid) {
        const userData = await loadUserDataFromFirestore(uid);
        const settings = await loadSettingsFromFirestore(userData.familyID);
        setFamilyID(userData.familyID);
        setAvailableFamilies(userData.available);
        setAppSettings(settings);
        generateYearList();
    }

    /**
     * loads the motivation sentence from firestore
     */
    async function loadMotivation() {
        const motivation = await loadMotivationFromFirestore();
        setMotivationSentence(motivation.sentences[yearDay]);
        setIsMotivationLoaded(true);
    }

    /**
     * genrates a list of active years from -2 to +2 of current year
     * is used for journal data and calendar api
     */
    function generateYearList() {
        const yearList = [];
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 2;

        for (let i = 0; i < 5; i++) {
            yearList.push((startYear + i).toString());
        }
        setActiveYears(yearList);
    }

    /**
     * calculates the number of current day of the year
     * @returns number of the current day of the year
     */
    function dayOfYear() {
        const date = new Date();
        const day = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        return day;
    }

    /**
     * checks daytime and sets greeting in navbar
     */
    function checkDaytime() {
        let daytime = new Date();
        let hours = daytime.getHours();
        if (hours >= 6 && hours < 11) {
            setGreeting('Guten Morgen');
        } else if (hours >= 11 && hours < 17) {
            setGreeting('Guten Tag');
        } else if (hours >= 17 && hours <= 23) {
            setGreeting('Guten Abend');
        }
    }

    /**
     * sets active page and document title
     */
    useMemo(() => {
        let params = searchParams.get('page');
        if (params === 'Dashboard') {
            setActivePage('dashboard?page=Dashboard');
        } else if (params === 'Listen') {
            setActivePage('lists?page=Listen');
        } else if (params === 'Finanzen') {
            setActivePage('journal?page=Finanzen');
        } else if (params === 'Kalender') {
            setActivePage('calendar?page=Kalender');
        } else if (params === 'Assistent') {
            setActivePage('assistant?page=Assistent');
        } else if (params === null) {
            params = 'Login';
        }
        document.title = `familyApp | ${params}`;
        setLastPage(activePage);
    }, [activePage, searchParams, setActivePage, setLastPage]);

    return (
        <UserContext.Provider
            value={{
                activeUser: activeUser,
                isGuest: isGuest,
                isAuthenticated: isAuthenticated,
                loggedIn: loggedIn,
                loading: loading,
                familyID: familyID,
                availableFamilies: availableFamilies,
                familyManagement: familyManagement,
                appSettings: appSettings,
                activeYears: activeYears,
                motivationSentence: motivationSentence,
                isMotivationLoaded: isMotivationLoaded,
                newEmail: newEmail,
                message: message,
                greeting: greeting,
                deferredPrompt: deferredPrompt,
                signUpUser,
                signInUser,
                signOutUser,
                addNewFamilyConnection,
                connectFamily,
                updateUserProfile,
                authCheck,
                setFamilyManagement,
                setAvailableFamilies,
                setAppSettings,
                loadMotivation,
                updateUserEmail,
                updateUserPassword,
                setNewEmail,
                setMessage,
                checkDaytime,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

function useUser() {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }

    return context;
}

export { UserPovider, useUser };
