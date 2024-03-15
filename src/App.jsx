import './styles/global.scss';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { JournalProvider } from './contexts/journalContext';
import { ListProvider } from './contexts/listContext';
import { CalendarProvider } from './contexts/calendarContext';
import { useAlert } from './contexts/alertContext';
import { useUser } from './contexts/userContext';
import { DialogProvider } from './contexts/dialogContext';
import Login from './components/main/login';
import Error from './components/global/error';
import Success from './components/global/success';
import LazySpinner from './components/global/lazySpinner';

const AppLayout = lazy(() => import('./components/main/appLayout'));
const ProtectedRoute = lazy(() => import('./components/main/protectedRoute'));
const UserProfile = lazy(() => import('./components/main/profile'));
const Settings = lazy(() => import('./components/main/settings'));
const Problem = lazy(() => import('./components/main/problem'));
const EmailChange = lazy(() => import('./components/main/emailChange'));
const PasswordChange = lazy(() => import('./components/main/passwordChange'));
const DashboardPage = lazy(() => import('./components/dashboard/dashboardPage'));
const JournalPage = lazy(() => import('./components/journal/journalPage'));
const CalendarPage = lazy(() => import('./components/calendar/calendarPage'));
const AssistantPage = lazy(() => import('./components/assistant/assistantPage'));
const ListPage = lazy(() => import('./components/list/listPage'));
const Imprint = lazy(() => import('./components/main/imprint'));
const DataProtection = lazy(() => import('./components/main/dataprotection'));

export default function App() {
    const { error, success, slideOut } = useAlert();
    const { authCheck } = useUser();

    /**
     * checks if authenticated user exists on initial loading
     */
    useEffect(() => {
        authCheck();
    }, []);

    return (
        <>
            {success && <Success success={success} slideOut={slideOut} />}
            {error && <Error error={error} slideOut={slideOut} />}

            <div className="page-container">
                <Suspense fallback={<LazySpinner />}>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="imprint" element={<Imprint />} />
                        <Route path="dataprotection" element={<DataProtection />} />

                        <Route
                            path="app"
                            element={
                                <ProtectedRoute>
                                    <DialogProvider>
                                        <ListProvider>
                                            <JournalProvider>
                                                <CalendarProvider>
                                                    <AppLayout />
                                                </CalendarProvider>
                                            </JournalProvider>
                                        </ListProvider>
                                    </DialogProvider>
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<DashboardPage />} />
                            <Route path="dashboard" element={<DashboardPage />} />
                            <Route path="lists" element={<ListPage />} />
                            <Route path="journal" element={<JournalPage />} />
                            <Route path="calendar" element={<CalendarPage />} />
                            <Route path="assistant" element={<AssistantPage />} />
                            <Route path="userprofile" element={<UserProfile />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="problem" element={<Problem />} />
                            <Route path="emailchange" element={<EmailChange />} />
                            <Route path="passwordchange" element={<PasswordChange />} />
                        </Route>
                    </Routes>
                </Suspense>
            </div>
        </>
    );
}
