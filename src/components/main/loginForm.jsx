import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function LoginForm({ signInUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    async function handleSubmit(e) {
        setIsLoggingIn(true);
        e.preventDefault();
        await signInUser(email, password);
        setIsLoggingIn(false);
        setEmail('');
        setPassword('');
    }

    return (
        <>
            <div className="login-header">
                <img src="/assets/img/logo_blue.png" alt="Logo" />
                <span>familyApp</span>
            </div>
            <form className="login-form" onSubmit={handleSubmit}>
                <h5 className="mb-4">Bitte melde dich an:</h5>
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
                <div className="form-group">
                    <button type="submit" className="btn btn-primary mt-2" disabled={isLoggingIn}>
                        {isLoggingIn ? (
                            <span className="spinner-border spinner-border-small" aria-hidden="true"></span>
                        ) : (
                            <span role="status">Anmelden</span>
                        )}
                    </button>
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
        </>
    );
}
