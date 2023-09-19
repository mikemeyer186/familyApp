import { useState } from 'react';

export default function Login({ signInUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    async function handleSubmit(e) {
        setIsLoggingIn(true);
        e.preventDefault();
        await signInUser(email, password);
        setIsLoggingIn(false);
    }

    return (
        <>
            <div className="login-container">
                <div className="login-header">
                    <img src="/assets/img/logo.png" alt="Logo" />
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
                            type="text"
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
                            Anmelden
                        </button>
                    </div>
                </form>
                <div className="login-links">
                    <span className="links pointer">Impressum</span>
                    <span> | </span>
                    <span className="links pointer">Datenschutz</span>
                </div>
            </div>
        </>
    );
}
