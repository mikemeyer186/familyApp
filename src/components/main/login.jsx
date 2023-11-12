import { useUser } from '../../contexts/userContext';
import Spinner from '../global/spinner';
import LoginForm from './loginForm';

export default function Login() {
    const { isAuthenticated } = useUser();

    return <div className="login-container">{!isAuthenticated ? <LoginForm /> : <Spinner>{'Anmelden...'}</Spinner>}</div>;
}
