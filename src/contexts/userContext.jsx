import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { updateEmail, updateProfile, signOut } from 'firebase/auth';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNavigate } from 'react-router';
import { useAlert } from './alertContext';
import { useSearchParams } from 'react-router-dom';

const UserContext = createContext();

function UserPovider({ children }) {
    const { setError, setSuccess } = useAlert();
    const [activeUser, setActiveUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [lastPage, setLastPage] = useLocalStorage('lastPage');
    const [loggedIn, setLoggedIn] = useLocalStorage('loggedIn');
    const [activePage, setActivePage] = useState(lastPage);
    const [searchParams] = useSearchParams('');
    const navigate = useNavigate();

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

    async function signOutUser() {
        try {
            await signOut(auth);
            setActiveUser(null);
            setLoggedIn(false);
            setSuccess('Du hast dich erfolgreich ausgeloggt!');
            setActivePage('');
            navigate('/');
        } catch (err) {
            setError('Irgendetwas ist schiefgelaufen. Versuch es noch einmal.');
        }
    }

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

    async function updateUserEmail(email) {
        try {
            console.log(email);
            await updateEmail(auth.currentUser, email);
            setSuccess('Deine E-Mail Adresse wurde erfolgreich aktualisiert!');
        } catch (err) {
            setError('Irgendetwas ist schiefgelaufen. Versuch es noch einmal.');
        }
    }

    function authCheck() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                setActiveUser(user);
                navigate(`app/${activePage}`);
            } else {
                setIsAuthenticated(false);
            }
        });
    }

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
    }, [activePage, searchParams, setActivePage, setLastPage]);

    return (
        <UserContext.Provider
            value={{
                activeUser: activeUser,
                isAuthenticated: isAuthenticated,
                loggedIn: loggedIn,
                setActiveUser,
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

export { UserPovider, useUser };
