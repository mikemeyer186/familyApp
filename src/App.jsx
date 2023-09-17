import './styles/global.scss';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/dist/js/bootstrap.min.js';
import { useEffect, useState } from 'react';
import { auth } from './config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import ListPage from './components/list/listPage';
import Navbar from './components/main/navbar';
import Login from './components/main/login';
import Error from './components/global/error';
import Success from './components/global/success';
import UserProfile from './components/main/profile';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [slideOut, setSlideOut] = useState('');
    const [openPage, setOpenPage] = useState('ListPage');
    const [activeUser, setActiveUser] = useState({});

    async function signInUser(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log(user);
            setActiveUser(user);
            setSuccess('Du bist erfolgreich eingeloggt!');
            setIsAuthenticated(true);
        } catch (error) {
            setError('Deine Login-Daten waren nicht korrekt!');
            setIsAuthenticated(false);
        }
    }

    async function signOutUser() {
        try {
            await signOut(auth);
            setSuccess('Du hast dich erfolgreich ausgeloggt!');
        } catch (error) {
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
                        <Navbar signOutUser={signOutUser} setOpenPage={setOpenPage} />
                    </div>
                    {openPage === 'ListPage' && (
                        <div className="listPage-container">
                            <ListPage />
                        </div>
                    )}
                    {openPage === 'UserProfile' && (
                        <div className="userProfile-container">
                            <UserProfile setOpenPage={setOpenPage} activeUser={activeUser} />
                        </div>
                    )}
                </>
            )}
        </>
    );
}
