import './styles/global.scss';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from './config/firebase';
import { updateEmail, updateProfile, signOut } from 'firebase/auth';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useUser } from './contexts/userContext';
import { JournalProvider } from './contexts/journalContext';
import Login from './components/main/login';
import Error from './components/global/error';
import Success from './components/global/success';
import UserProfile from './components/main/profile';
import DashboardPage from './components/dashboard/dashboardPage';
import JournalPage from './components/journal/journalPage';
import CalendarPage from './components/calendar/calendarPage';
import ListPage from './components/list/listPage';
import AppLayout from './components/main/appLayout';
import Imprint from './components/main/imprint';
import DataProtection from './components/main/dataprotection';

export default function App() {
    const { setActiveUser } = useUser();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [slideOut, setSlideOut] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [lastPage, setLastPage] = useLocalStorage('lastPage');
    const [activePage, setActivePage] = useState(lastPage);
    const [searchParams] = useSearchParams('');
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

    useEffect(() => {
        authCheck();
    }, []);

    useEffect(() => {
        const alertTime = setTimeout(() => {
            setSlideOut('slideOut-alert');
        }, 3000);

        const slideTime = setTimeout(() => {
            setError('');
            setSuccess('');
            setSlideOut('');
        }, 3200);

        return () => {
            clearTimeout(alertTime);
            clearTimeout(slideTime);
        };
    }, [error, success]);

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
    }, [activePage, searchParams, setLastPage]);

    return (
        <>
            {success && <Success success={success} slideOut={slideOut} />}
            {error && <Error error={error} slideOut={slideOut} />}

            <div className="page-container">
                <JournalProvider>
                    <Routes>
                        <Route path="/" element={<Login signInUser={signInUser} isAuthenticated={isAuthenticated} />} />
                        <Route path="imprint" element={<Imprint />} />
                        <Route path="dataprotection" element={<DataProtection />} />

                        <Route path="app" element={<AppLayout signOutUser={signOutUser} />}>
                            <Route index element={<DashboardPage />} />
                            <Route path="dashboard" element={<DashboardPage />} />
                            <Route path="lists" element={<ListPage />} />
                            <Route path="journal" element={<JournalPage />} />
                            <Route path="calendar" element={<CalendarPage />} />
                            <Route
                                path="userprofile"
                                element={<UserProfile updateUserProfile={updateUserProfile} updateUserEmail={updateUserEmail} />}
                            />
                        </Route>
                    </Routes>
                </JournalProvider>
            </div>
        </>
    );
}
