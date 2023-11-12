import { createContext, useContext, useState } from 'react';
import { auth } from '../config/firebase';
import { updateEmail, updateProfile, signOut } from 'firebase/auth';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNavigate } from 'react-router';
import { useAlert } from './alertContext';

const UserContext = createContext();

function UserPovider({ children }) {
    const { setError, setSuccess } = useAlert();
    const [activeUser, setActiveUser] = useState({});
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [lastPage, setLastPage] = useLocalStorage('lastPage');
    const [activePage, setActivePage] = useState(lastPage);
    const navigate = useNavigate();

    async function signInUser(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setActiveUser(user);
            setSuccess('Du bist erfolgreich eingeloggt!');
            navigate('app/dashboard?page=Dashboard');
        } catch (err) {
            setError('Deine Login-Daten waren nicht korrekt!');
        }
    }

    async function signOutUser() {
        try {
            await signOut(auth);
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
                setActiveUser(user);
                navigate(`app/${activePage}`);
            } else {
                setIsAuthenticated(false);
            }
        });
    }

    return (
        <UserContext.Provider
            value={{
                activeUser: activeUser,
                isAuthenticated: isAuthenticated,
                setActiveUser,
                setLastPage,
                setActivePage,
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
