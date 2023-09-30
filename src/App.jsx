import './styles/global.scss';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { auth } from './config/firebase';
import { updateEmail, updateProfile, signOut } from 'firebase/auth';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import Login from './components/main/login';
import Error from './components/global/error';
import Success from './components/global/success';
import UserProfile from './components/main/profile';
import DashboardPage from './components/dashboard/dashboardPage';
import JournalPage from './components/journal/journalPage';
import CalendarPage from './components/calendar/calendarPage';
import ListPage from './components/list/listPage';
import AppLayout from './components/main/appLayout';

export default function App() {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [slideOut, setSlideOut] = useState('');
    const [openPage, setOpenPage] = useState('');
    const [activeUser, setActiveUser] = useState({});
    const activePage = useRef('');
    const navigate = useNavigate();

    async function signInUser(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setActiveUser(user);
            setSuccess('Du bist erfolgreich eingeloggt!');
            setOpenPage('Dashboard');
            navigate('app/dashboard');
        } catch (err) {
            setError('Deine Login-Daten waren nicht korrekt!');
        }
    }

    async function signOutUser() {
        try {
            await signOut(auth);
            setSuccess('Du hast dich erfolgreich ausgeloggt!');
            setOpenPage('');
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
                navigate('app/dashboard');
            }
        });
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

            <div className="page-container">
                <Routes>
                    <Route path="/" element={<Login signInUser={signInUser} />} />

                    <Route path="app" element={<AppLayout signOutUser={signOutUser} setOpenPage={setOpenPage} activeUser={activeUser} />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="lists" element={<ListPage activeUser={activeUser} />} />
                        <Route path="journal" element={<JournalPage />} />
                        <Route path="calendar" element={<CalendarPage />} />
                        <Route
                            path="userprofile"
                            element={
                                <UserProfile
                                    setOpenPage={setOpenPage}
                                    activeUser={activeUser}
                                    updateUserProfile={updateUserProfile}
                                    updateUserEmail={updateUserEmail}
                                    activePage={activePage}
                                />
                            }
                        />
                    </Route>
                </Routes>
            </div>
        </>
    );
}
