import './styles/global.scss';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/dist/js/bootstrap.min.js';
import { useEffect, useState } from 'react';
import { auth } from './config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import ListPage from './components/list/listPage';
import Navbar from './components/main/navbar';
import Login from './components/main/login';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    async function signInUser(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log(user);
            setIsAuthenticated(true);
        } catch (error) {
            console.log(error);
            setIsAuthenticated(false);
        }
    }

    async function signOutUser() {
        try {
            await signOut(auth);
        } catch (error) {
            console.log(error);
        }
    }

    function authCheck() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        });
    }

    useEffect(() => {
        authCheck();
    }, []);

    return (
        <>
            {!isAuthenticated ? (
                <Login signInUser={signInUser} />
            ) : (
                <>
                    <div className="navbar-container">
                        <Navbar signOutUser={signOutUser} />
                    </div>
                    <div className="listPage-container">
                        <ListPage />
                    </div>
                </>
            )}
        </>
    );
}
