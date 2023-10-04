import Spinner from '../global/spinner';
import LoginForm from './loginForm';

export default function Login({ signInUser, isAuthenticated }) {
    return <div className="login-container">{!isAuthenticated ? <LoginForm signInUser={signInUser} /> : <Spinner>{'Anmelden...'}</Spinner>}</div>;
}
