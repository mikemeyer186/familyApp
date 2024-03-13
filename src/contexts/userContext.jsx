import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { updateProfile, signOut, reauthenticateWithCredential, EmailAuthProvider, verifyBeforeUpdateEmail, updatePassword } from 'firebase/auth';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router';
import { useAlert } from './alertContext';
import { useSearchParams } from 'react-router-dom';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { loadUserDataFromFirestore, loadSettingsFromFirestore, loadMotivationFromFirestore } from '../services/firestore';

const UserContext = createContext();

function UserPovider({ children }) {
    const { setError, setSuccess } = useAlert();
    const [activeUser, setActiveUser] = useState(null);
    const [isGuest, setIsGuest] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [message, setMessage] = useState('');
    const [familyID, setFamilyID] = useState('');
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
    const navigate = useNavigate();

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
            } else {
                setLoading(false);
                setLoggedIn(false);
                setIsAuthenticated(false);
                navigate('/');
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
    useEffect(() => {
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
                appSettings: appSettings,
                activeYears: activeYears,
                motivationSentence: motivationSentence,
                isMotivationLoaded: isMotivationLoaded,
                newEmail: newEmail,
                message: message,
                greeting: greeting,
                signInUser,
                signOutUser,
                updateUserProfile,
                authCheck,
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

export { UserPovider, useUser }; //eslint-disable-line
