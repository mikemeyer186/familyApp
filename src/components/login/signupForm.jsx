import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function SignupForm() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const navigate = useNavigate();

    /**
     * handles signup of user
     * @param {event} e - event from form submit
     */
    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoggingIn(true);
        setIsLoggingIn(false);
        setEmail('');
        setPassword('');
    }

    function handleAbortSignup() {
        navigate('/');
    }

    return (
        <div className="login-wrapper fade-effect">
            <div className="login-header">
                <img src="/assets/img/logo_blue.png" alt="Logo" />
                <span>familyApp</span>
            </div>
            <form className="login-form" onSubmit={handleSubmit}>
                <h5 className="mb-4 text-center">Erstelle einen neuen Account:</h5>
                <div className="form-group">
                    <label htmlFor="signupName">Benutzername</label>
                    <input
                        id="signupName"
                        type="text"
                        className="form-control"
                        placeholder="Dein Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoggingIn}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="signupEmail">E-Mail</label>
                    <input
                        id="signupEmail"
                        type="email"
                        className="form-control"
                        placeholder="Deine E-Mail Adresse"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoggingIn}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="signupPassword">Passwort</label>
                    <input
                        id="signupPassword"
                        type="password"
                        placeholder="Dein Passwort"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoggingIn}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="signupPasswordCheck">Passwort wiederholen</label>
                    <input
                        id="signupPasswordCheck"
                        type="password"
                        placeholder="Dein Passwort"
                        className="form-control"
                        value={passwordCheck}
                        onChange={(e) => setPasswordCheck(e.target.value)}
                        disabled={isLoggingIn}
                        required
                    />
                </div>
                <div className="form-group login-button-box d-flex justify-content-center gap-2">
                    <button type="submit" className="btn btn-primary mt-2 width-108" disabled={isLoggingIn}>
                        {isLoggingIn ? (
                            <span className="spinner-border spinner-border-small" aria-hidden="true"></span>
                        ) : (
                            <span role="status">Erstellen</span>
                        )}
                    </button>
                    <button type="button" className="btn btn-secondary mt-2 width-108" disabled={isLoggingIn} onClick={handleAbortSignup}>
                        {isLoggingIn ? <span className="spinner-border spinner-border-small" aria-hidden="true"></span> : <span>Zurück</span>}
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
        </div>
    );
}
