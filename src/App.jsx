import './styles/global.scss';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useCallback, useEffect } from 'react';
import { JournalProvider } from './contexts/journalContext';
import { ListProvider } from './contexts/listContext';
import { CalendarProvider } from './contexts/calendarContext';
import { useAlert } from './contexts/alertContext';
import { useUser } from './contexts/userContext';
import { DialogProvider } from './contexts/dialogContext';
import Login from './components/login/login';
import Error from './components/global/error';
import Success from './components/global/success';
import LazySpinner from './components/global/lazySpinner';

const AppLayout = lazy(() => import('./components/main/appLayout'));
const ProtectedRoute = lazy(() => import('./components/main/protectedRoute'));
const UserProfile = lazy(() => import('./components/profile/profile'));
const Family = lazy(() => import('./components/profile/family'));
const Settings = lazy(() => import('./components/profile/settings'));
const Problem = lazy(() => import('./components/profile/problem'));
const EmailChange = lazy(() => import('./components/profile/emailChange'));
const PasswordChange = lazy(() => import('./components/profile/passwordChange'));
const DashboardPage = lazy(() => import('./components/dashboard/dashboardPage'));
const JournalPage = lazy(() => import('./components/journal/journalPage'));
const CalendarPage = lazy(() => import('./components/calendar/calendarPage'));
const AssistantPage = lazy(() => import('./components/assistant/assistantPage'));
const ListPage = lazy(() => import('./components/list/listPage'));
const Imprint = lazy(() => import('./components/login/imprint'));
const DataProtection = lazy(() => import('./components/login/dataprotection'));
const Signup = lazy(() => import('./components/login/signup'));

export default function App() {
    const { error, success, slideOut } = useAlert();
    const { deferredPrompt } = useUser();

    /**
     * saves the deferred pwa install prompt event
     */
    const setPWAPrompt = useCallback(
        function setPWAPrompt(e) {
            e.preventDefault();
            deferredPrompt.current = e;
        },
        [deferredPrompt]
    );

    /**
     * removes the deferred pwa install prompt event
     */
    const removePWAPrompt = useCallback(
        function removePWAPrompt() {
            deferredPrompt.current = null;
        },
        [deferredPrompt]
    );

    /**
     * listens to pwa install prompt event to save the deferred prompt
     */
    useEffect(() => {
        window.addEventListener('beforeinstallprompt', setPWAPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', setPWAPrompt);
        };
    }, [deferredPrompt, setPWAPrompt]);

    /**
     * listens to pwa installation completed event to remove the deferred prompt
     */
    useEffect(() => {
        window.addEventListener('appinstalled', removePWAPrompt);

        return () => {
            window.removeEventListener('appinstalled', removePWAPrompt);
        };
    }, [deferredPrompt, removePWAPrompt]);

    return (
        <>
            {success && <Success success={success} slideOut={slideOut} />}
            {error && <Error error={error} slideOut={slideOut} />}

            <div className="page-container">
                <Suspense fallback={<LazySpinner />}>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
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
                            <Route path="family" element={<Family />} />
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
