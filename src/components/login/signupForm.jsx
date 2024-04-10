import { useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../../contexts/userContext';

export default function SignupForm() {
    const { signUpUser } = useUser();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [searchParams] = useSearchParams('');
    let params = searchParams.get('invitation');
    const [invitation, setInvitation] = useState(params ? 'Ja' : 'Auswählen...');
    const [invitationCode, setInvitationCode] = useState(params ? params : '');
    const navigate = useNavigate();

    /**
     * handles signup of user
     * @param {event} e - event from form submit
     */
    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoggingIn(true);
        await signUpUser(username, email, password, invitationCode);
        setIsLoggingIn(false);
        setUsername('');
        setEmail('');
        setPassword('');
        setPasswordCheck('');
        setPasswordError(false);
        setValidPassword(false);
        setInvitation('Auswählen...');
    }

    /**
     * navigates back to login page
     */
    function handleAbortSignup() {
        navigate('/');
    }

    /**
     * handles new password change
     * validates and compares the new password
     * @param {string} password - new password from from input
     */
    function handleNewPasswordChange(password) {
        setPassword(password);
        const validation = validatePassword(password);
        comparePasswords(password, passwordCheck, validation);
    }

    /**
     * handles check password change
     * validates and compares the check password
     * @param {string} password - check password from form input
     */
    function handleCheckPasswordChange(checkPassword) {
        setPasswordCheck(checkPassword);
        comparePasswords(password, checkPassword, validPassword);
    }

    /**
     * validates the enterd password
     * min of 8 characters, min of 1 number and min of 1 special character
     * @param {string} password - new password
     */
    function validatePassword(password) {
        const isLongEnough = password.length >= 8;
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*)(+=._-]/.test(password);

        if (isLongEnough && hasNumber && hasSpecialChar) {
            setValidPassword(true);
            return true;
        } else {
            setValidPassword(false);
            return;
        }
    }

    /**
     * compares both password entered in form input
     * @param {string} newPW - new password from form input
     * @param {string} checkPW - check password from from string
     * @param {boolean} validPW - result of validation
     */
    function comparePasswords(newPW, checkPW, validPW) {
        if (newPW === checkPW && validPW) {
            setPasswordError(false);
        } else {
            if (!newPW == '' || !checkPW == '') {
                setPasswordError(true);
            }
        }
    }

    return (
        <div className="login-wrapper fade-effect">
            <div className="login-header">
                <img src="/assets/img/logo_blue.png" alt="Logo" />
                <span>familyApp</span>
            </div>
            <form className="login-form slide-effect" onSubmit={handleSubmit}>
                <h5 className="mb-4 text-center">Erstelle einen neuen Account:</h5>
                <div className="form-group">
                    <label htmlFor="signupName">
                        <span>Benutzername</span>
                        <span className="signup-input-info">Dein Vorname oder dein Spitzname</span>
                    </label>
                    <input
                        id="signupName"
                        type="text"
                        className="form-control"
                        placeholder="Dein Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoggingIn}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="signupEmail">
                        <span>E-Mail</span>
                        <span className="signup-input-info">Deine aktuelle E-Mail Adresse</span>
                    </label>
                    <input
                        id="signupEmail"
                        type="email"
                        className="form-control"
                        placeholder="E-Mail Adresse"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoggingIn}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="signupPassword">
                        <div className="d-flex align-items-center">
                            <span>Passwort</span>
                            <span className={`ms-1 ${validPassword ? 'safe' : 'unsafe'}`}>
                                {!validPassword && !password == '' ? 'unsicher' : validPassword && !password == '' && 'sicher'}
                            </span>
                        </div>
                        <span className="signup-input-info">
                            Verwende ein sicheres Passwort mit mindestens 8 Zeichen, mindestens einer Zahl und einem Sonderzeichen
                        </span>
                    </label>
                    <input
                        id="signupPassword"
                        type="password"
                        placeholder="Passwort"
                        className={`form-control ${validPassword ? 'input-checked' : !validPassword && !passwordCheck == '' && 'input-error'}`}
                        value={password}
                        onChange={(e) => handleNewPasswordChange(e.target.value)}
                        disabled={isLoggingIn}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="signupPasswordCheck">
                        <span>Passwort wiederholen</span>
                        <span className="signup-input-info">Beide Passworter müssen übereinstimmen</span>
                    </label>
                    <input
                        id="signupPasswordCheck"
                        type="password"
                        placeholder="Passwort"
                        className={`form-control ${
                            passwordError && !passwordCheck == '' ? 'input-error' : !passwordError && !passwordCheck == '' && 'input-checked'
                        }`}
                        value={passwordCheck}
                        onChange={(e) => handleCheckPasswordChange(e.target.value)}
                        disabled={isLoggingIn}
                        required
                    />
                </div>

                <div className="width-full">
                    <label htmlFor="invitation" className="col-form-label">
                        Möchtest du einer bestehenden Familie beitreten?
                    </label>
                    <div className="input-group mb-3 flex-column">
                        <button
                            className="btn dropdown-toggle btn-outline-primary"
                            id="invitation"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <span>{invitation}</span>
                        </button>
                        <ul className="dropdown-menu">
                            <span className="dropdown-item subcategory" onClick={() => setInvitation('Ja')}>
                                Ja, ich wurde eingeladen
                            </span>
                            <span className="dropdown-item subcategory" onClick={() => setInvitation('Nein')}>
                                Nein, ich möchte eine neue Familie erstellen
                            </span>
                        </ul>
                    </div>
                </div>

                {invitation === 'Ja' && (
                    <div className="form-group">
                        <label htmlFor="familyInvitationCode">
                            <span>Einladungscode</span>
                            <span className="signup-input-info">
                                Einladungscode aus deiner Einladungs-Mail, die du von einem Familienmitglied erhalten hast
                            </span>
                        </label>
                        <input
                            id="familyInvitationCode"
                            type="text"
                            className="form-control"
                            placeholder="Code"
                            value={invitationCode}
                            onChange={(e) => setInvitationCode(e.target.value)}
                            disabled={isLoggingIn}
                            required
                        />
                    </div>
                )}

                <div className="form-group login-button-box d-flex justify-content-center gap-2">
                    <button
                        type="submit"
                        className="btn btn-primary mt-2 width-108"
                        disabled={isLoggingIn || username === '' || email === '' || invitation === 'Auswählen...' || passwordError}
                    >
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
                <NavLink to="/imprint?page=Impressum" className="links pointer">
                    Impressum
                </NavLink>
                <span> | </span>
                <NavLink to="/dataprotection?page=Datenschutz" className="links pointer">
                    Datenschutz
                </NavLink>
            </div>
        </div>
    );
}
