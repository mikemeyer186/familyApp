import './styles/global.scss';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/dist/js/bootstrap.min.js';
import { useEffect, useState } from 'react';
import { auth } from './config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, updateEmail, updateProfile } from 'firebase/auth';
import ListPage from './components/list/listPage';
import Navbar from './components/main/navbar';
import Login from './components/main/login';
import Error from './components/global/error';
import Success from './components/global/success';
import UserProfile from './components/main/profile';
import DashboardPage from './components/dashboard/dashboardPage';
import JournalPage from './components/journal/journalPage';
import CalendarPage from './components/calendar/calendarPage';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [slideOut, setSlideOut] = useState('');
    const [openPage, setOpenPage] = useState('Dashboard');
    const [activeUser, setActiveUser] = useState({});

    async function signInUser(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log(user);
            setActiveUser(user);
            setSuccess('Du bist erfolgreich eingeloggt!');
            setIsAuthenticated(true);
        } catch (err) {
            setError('Deine Login-Daten waren nicht korrekt!');
            setIsAuthenticated(false);
        }
    }

    async function signOutUser() {
        try {
            await signOut(auth);
            setSuccess('Du hast dich erfolgreich ausgeloggt!');
        } catch (err) {
            setError('Irgendetwas ist schiefgelaufen. Versuch es noch einmal.');
        }
    }

    function authCheck() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                setActiveUser(user);
            } else {
                setIsAuthenticated(false);
            }
        });
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

    useEffect(() => {
        authCheck();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setSlideOut('slideOut-alert');
        }, 3000);

        setTimeout(() => {
            setError('');
            setSuccess('');
            setSlideOut('');
        }, 3200);
    }, [error, success]);

    return (
        <>
            {success && <Success success={success} slideOut={slideOut} />}
            {error && <Error error={error} slideOut={slideOut} />}
            {!isAuthenticated ? (
                <Login signInUser={signInUser} />
            ) : (
                <>
                    <div className="navbar-container">
                        <Navbar signOutUser={signOutUser} setOpenPage={setOpenPage} activeUser={activeUser} />
                    </div>

                    <div className="page-container">
                        {openPage === 'Dashboard' && <DashboardPage />}
                        {openPage === 'ListPage' && <ListPage />}
                        {openPage === 'Journal' && <JournalPage />}
                        {openPage === 'Calendar' && <CalendarPage />}
                        {openPage === 'UserProfile' && (
                            <UserProfile
                                setOpenPage={setOpenPage}
                                activeUser={activeUser}
                                updateUserProfile={updateUserProfile}
                                updateUserEmail={updateUserEmail}
                            />
                        )}
                    </div>
                </>
            )}
        </>
    );
}
