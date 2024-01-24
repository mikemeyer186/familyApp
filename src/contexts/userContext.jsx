import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { updateEmail, updateProfile, signOut } from 'firebase/auth';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNavigate } from 'react-router';
import { useAlert } from './alertContext';
import { useSearchParams } from 'react-router-dom';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { loadUserDataFromFirestore } from '../services/firestore';

const UserContext = createContext();

function UserPovider({ children }) {
    const { setError, setSuccess } = useAlert();
    const [activeUser, setActiveUser] = useState(null);
    const [familyID, setFamilyID] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [lastPage, setLastPage] = useLocalStorage('lastPage');
    const [loggedIn, setLoggedIn] = useLocalStorage('loggedIn');
    const [isAppLoaded, setIsAppLoaded] = useSessionStorage('isAppLoaded');
    const [activePage, setActivePage] = useState(lastPage);
    const [searchParams] = useSearchParams('');
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
            setIsAppLoaded(true);
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
            setActiveUser(null);
            setFamilyID('');
            setLoggedIn(false);
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
     * updates user email in firebase auth (not implemented yet)
     * @param {string} email - email of user
     */
    async function updateUserEmail(email) {
        try {
            console.log(email);
            await updateEmail(auth.currentUser, email);
            setSuccess('Deine E-Mail Adresse wurde erfolgreich aktualisiert!');
        } catch (err) {
            setError('Irgendetwas ist schiefgelaufen. Versuch es noch einmal.');
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

                if (isAppLoaded) {
                    navigate(`app/${activePage}`);
                } else {
                    navigate('app/dashboard?page=Dashboard');
                }
            } else {
                setIsAuthenticated(false);
            }
        });
    }

    /**
     * loads user data from firestore
     * and sets the related family id for database connection
     * @param {string} uid - user id
     */
    async function loadUserData(uid) {
        const userData = await loadUserDataFromFirestore(uid);
        setFamilyID(userData.familyID);
    }

    /**
     * sets active page and document title
     * and sets "isAppLoaded" to true (session active)
     */
    useEffect(() => {
        let params = searchParams.get('page');
        if (params === 'Dashboard') {
            setActivePage('dashboard?page=Dashboard');
        } else if (params === 'Listen') {
            setActivePage('lists?page=Listen');
        } else if (params === 'Journal') {
            setActivePage('journal?page=Journal');
        } else if (params === 'Kalender') {
            setActivePage('calendar?page=Kalender');
        } else if (params === null) {
            params = 'Login';
        }
        document.title = `familyApp | ${params}`;
        setLastPage(activePage);
        setIsAppLoaded(true);
    }, [activePage, searchParams, setActivePage, setLastPage, setIsAppLoaded]);

    return (
        <UserContext.Provider
            value={{
                activeUser: activeUser,
                isAuthenticated: isAuthenticated,
                loggedIn: loggedIn,
                familyID: familyID,
                setActiveUser,
                setFamilyID,
                signInUser,
                signOutUser,
                updateUserProfile,
                updateUserEmail,
                authCheck,
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
