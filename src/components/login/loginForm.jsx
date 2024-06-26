import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../../contexts/userContext';
import { testVersionTracking } from '../../services/firestore';

export default function LoginForm() {
    const { signInUser } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isUserLoggingIn, setIsUserGuestLoggingIn] = useState(false);
    const [isGuestLoggingIn, setIsGuestLoggingIn] = useState(false);
    const guestEmail = import.meta.env.VITE_GUEST_EMAIL;
    const guestPassword = import.meta.env.VITE_GUEST_PASSWORD;

    /**
     * handles login of user
     * @param {event} e - event from form submit
     */
    async function handleSubmit(e) {
        e.preventDefault();
        setIsUserGuestLoggingIn(true);
        setIsLoggingIn(true);
        await signInUser(email, password);
        setIsUserGuestLoggingIn(false);
        setIsLoggingIn(false);
        setEmail('');
        setPassword('');
    }

    /**
     * handles the guest login with pre-defined email and passwort
     * tracks the date of test version login
     */
    async function handleGuestLogIn() {
        setIsGuestLoggingIn(true);
        setIsLoggingIn(true);
        await signInUser(guestEmail, guestPassword);
        setIsGuestLoggingIn(false);
        setIsLoggingIn(false);
        setEmail('');
        setPassword('');
        await trackTestVersion();
    }

    /**
     * tracks the usage of test version with date and time
     */
    async function trackTestVersion() {
        const id = new Date().toISOString();
        const userAgent = window.navigator.userAgent;
        const browserVendor = window.navigator.vendor ? window.navigator.vendor : 'unknown';
        const browserPlatform = window.navigator.platform ? window.navigator.platform : 'unknown';
        const data = { login: new Date(), device: userAgent, vendor: browserVendor, platform: browserPlatform };

        await testVersionTracking(id, data);
    }

    return (
        <div className="login-wrapper fade-effect">
            <div className="login-header">
                <img src="/assets/img/logo_blue.png" alt="Logo" />
                <span>familyApp</span>
            </div>
            <form className="login-form" onSubmit={handleSubmit}>
                <h5 className="mb-4 text-center">Bitte melde dich an:</h5>
                <div className="form-group">
                    <label htmlFor="email">E-Mail</label>
                    <input
                        id="email"
                        type="email"
                        className="form-control"
                        placeholder="user@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoggingIn}
                        autoComplete="true"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Passwort</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Passwort"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoggingIn}
                        required
                    />
                </div>
                <div className="form-group login-button-box d-flex justify-content-center gap-2">
                    <button type="submit" className="btn btn-primary mt-2 width-108" disabled={isLoggingIn}>
                        {isUserLoggingIn ? (
                            <span className="spinner-border spinner-border-small" aria-hidden="true"></span>
                        ) : (
                            <span role="status">Anmelden</span>
                        )}
                    </button>
                    <button type="button" className="btn btn-secondary mt-2 width-108" disabled={isLoggingIn} onClick={handleGuestLogIn}>
                        {isGuestLoggingIn ? (
                            <span className="spinner-border spinner-border-small" aria-hidden="true"></span>
                        ) : (
                            <span role="status">Testen</span>
                        )}
                    </button>
                </div>
                <div className="signup-text">
                    <span>Kein Account? </span>
                    <NavLink to="signup?page=Registrieren" className="links pointer">
                        Hier registrieren
                    </NavLink>
                </div>
            </form>
            <div className="login-links">
                <NavLink to="imprint?page=Impressum" className="links pointer">
                    Impressum
                </NavLink>
                <span> | </span>
                <NavLink to="dataprotection?page=Datenschutz" className="links pointer">
                    Datenschutz
                </NavLink>
            </div>
        </div>
    );
}
