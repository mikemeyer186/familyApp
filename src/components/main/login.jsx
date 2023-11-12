import { useEffect, useRef } from 'react';
import { useUser } from '../../contexts/userContext';
import Spinner from '../global/spinner';
import LoginForm from './loginForm';

export default function Login() {
    const { isAuthenticated } = useUser();
    let showLoginForm = useRef(false);

    useEffect(() => {
        if (!isAuthenticated) {
            showLoginForm.current = true;
        }
    }, [isAuthenticated]);

    return <div className="login-container">{showLoginForm.current ? <LoginForm /> : <Spinner>{'Anmelden...'}</Spinner>}</div>;
}
