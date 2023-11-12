import './styles/global.scss';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser } from './contexts/userContext';
import { JournalProvider } from './contexts/journalContext';
import { useAlert } from './contexts/alertContext';
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
    const { error, success, slideOut } = useAlert();
    const { authCheck, activePage, setActivePage, setLastPage } = useUser();
    const [searchParams] = useSearchParams('');

    useEffect(() => {
        authCheck();
    }, []);

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
    }, [activePage, searchParams, setLastPage, setActivePage]);

    return (
        <>
            {success && <Success success={success} slideOut={slideOut} />}
            {error && <Error error={error} slideOut={slideOut} />}

            <div className="page-container">
                <JournalProvider>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="imprint" element={<Imprint />} />
                        <Route path="dataprotection" element={<DataProtection />} />

                        <Route path="app" element={<AppLayout />}>
                            <Route index element={<DashboardPage />} />
                            <Route path="dashboard" element={<DashboardPage />} />
                            <Route path="lists" element={<ListPage />} />
                            <Route path="journal" element={<JournalPage />} />
                            <Route path="calendar" element={<CalendarPage />} />
                            <Route path="userprofile" element={<UserProfile />} />
                        </Route>
                    </Routes>
                </JournalProvider>
            </div>
        </>
    );
}
