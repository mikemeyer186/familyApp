import { useEffect } from 'react';
import { useUser } from '../../contexts/userContext';
import Spinner from '../global/spinner';
import LoginForm from './loginForm';

export default function Login() {
    const { authCheck, loggedIn, loading } = useUser();

    /**
     * checks if authenticated user exists on initial loading
     */
    useEffect(() => {
        authCheck();
    }, []);

    return <div className="login-container">{loading || loggedIn ? <Spinner>{'Anmelden...'}</Spinner> : <LoginForm />}</div>;
}
