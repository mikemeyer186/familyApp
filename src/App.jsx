import './styles/global.scss';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
    const [activeUser, setActiveUser] = useState({});
    const [openPage, setOpenPage] = useState(() => {
        return localStorage.getItem('activePage') || '';
    });
    const [activePage, setActivePage] = useState(() => {
        return localStorage.getItem('activePage') || '';
    });
    const navigate = useNavigate();

    async function signInUser(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setActiveUser(user);
            setSuccess('Du bist erfolgreich eingeloggt!');
            setOpenPage('dashboard');
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

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setActiveUser(user);
                navigate(`app/${activePage}`);
            }
        });
    }, [navigate, activePage]);

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
        if (openPage === 'dashboard') {
            title = 'Dashboard';
            setActivePage('dashboard');
        } else if (openPage === 'lists') {
            title = 'Listen';
            setActivePage('lists');
        } else if (openPage === 'journal') {
            title = 'Journal';
            setActivePage('journal');
        } else if (openPage === 'calendar') {
            title = 'Kalender';
            setActivePage('calendar');
        } else if (openPage === 'userprofile') {
            title = 'Benutzerprofil';
        } else if (openPage === '') {
            title = 'Login';
        }
        document.title = `familyApp | ${title}`;
        localStorage.setItem('activePage', activePage);
    }, [openPage, activePage]);

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
                            element={<UserProfile activeUser={activeUser} updateUserProfile={updateUserProfile} updateUserEmail={updateUserEmail} />}
                        />
                    </Route>
                </Routes>
            </div>
        </>
    );
}
