import { useUser } from '../../contexts/userContext';
import Spinner from '../global/spinner';
import LoginForm from './loginForm';

export default function Login() {
    const { loggedIn, loading } = useUser();

    return <div className="login-container">{loading || loggedIn ? <Spinner>{'Anmelden...'}</Spinner> : <LoginForm />}</div>;
}
