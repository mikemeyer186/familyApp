import './styles/global.scss';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/dist/js/bootstrap.min.js';
import { useEffect, useRef, useState } from 'react';
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
    const [openPage, setOpenPage] = useState('');
    const [activeUser, setActiveUser] = useState({});
    const activePage = useRef('');

    async function signInUser(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setActiveUser(user);
            setSuccess('Du bist erfolgreich eingeloggt!');
            setIsAuthenticated(true);
            setOpenPage('Dashboard');
        } catch (err) {
            setError('Deine Login-Daten waren nicht korrekt!');
            setIsAuthenticated(false);
        }
    }

    async function signOutUser() {
        try {
            await signOut(auth);
            setSuccess('Du hast dich erfolgreich ausgeloggt!');
            setOpenPage('');
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

        return () => {
            clearTimeout();
        };
    }, [error, success]);

    useEffect(() => {
        let title = '';
        if (openPage === 'Dashboard') {
            title = 'Dashboard';
            activePage.current = 'Dashboard';
        } else if (openPage === 'ListPage') {
            title = 'Listen';
            activePage.current = 'ListPage';
        } else if (openPage === 'Journal') {
            title = 'Journal';
            activePage.current = 'Journal';
        } else if (openPage === 'Calendar') {
            title = 'Kalender';
            activePage.current = 'Calendar';
        } else if (openPage === 'UserProfile') {
            title = 'Benutzerprofil';
        } else if (openPage === '') {
            title = 'Login';
        }
        document.title = `familyApp | ${title}`;
    }, [openPage]);

    return (
        <>
            {success && <Success success={success} slideOut={slideOut} />}
            {error && <Error error={error} slideOut={slideOut} />}
            {!isAuthenticated ? (
                <Login signInUser={signInUser} />
            ) : (
                <>
                    <div className="navbar-container">
                        <Navbar signOutUser={signOutUser} setOpenPage={setOpenPage} activeUser={activeUser} openPage={openPage} />
                    </div>

                    <div className="page-container">
                        {openPage === 'Dashboard' && <DashboardPage />}
                        {openPage === 'ListPage' && <ListPage activeUser={activeUser} />}
                        {openPage === 'Journal' && <JournalPage />}
                        {openPage === 'Calendar' && <CalendarPage />}
                        {openPage === 'UserProfile' && (
                            <UserProfile
                                setOpenPage={setOpenPage}
                                activeUser={activeUser}
                                updateUserProfile={updateUserProfile}
                                updateUserEmail={updateUserEmail}
                                activePage={activePage}
                            />
                        )}
                    </div>
                </>
            )}
        </>
    );
}
