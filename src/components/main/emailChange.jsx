import { useNavigate } from 'react-router';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useState } from 'react';
import { useUser } from '../../contexts/userContext';

export default function EmailChange() {
    const { activeUser, isGuest, newEmail, setNewEmail, updateUserEmail } = useUser();
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState('');
    const [lastPage] = useLocalStorage('lastPage');
    const navigate = useNavigate();

    /**
     * handles user email update
     * @param {event} e - event from form submit
     */
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await updateUserEmail(password);
            navigate(`/app/${lastPage}`);
            setNewEmail('');
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * sets the state and validates the new email addess
     * @param {string} email - new entered email adress
     */
    function handleChangeEmail(email) {
        setNewEmail(email);
        validateEmail(email);
    }

    /**
     * validates the email adress on correct format
     * @param {string} email - new entered email adress
     */
    function validateEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!pattern.test(email)) {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
    }

    /**
     * handels the abort of email change
     */
    function handleAbort() {
        navigate(`/app/${lastPage}`);
        setNewEmail('');
    }

    return (
        <div className="profile-wrapper">
            <div className="profile-content">
                <div className="profil-header">
                    <h4 className="profil-title mb-2">E-Mail Adresse ändern</h4>
                    <span>
                        Du erhältst einen Bestätigungslink an deine neue E-Mail Adresse. Sobald du sie bestätigt hast, kannst du dich mit der neuen
                        E-Mail Adresse anmelden{isGuest && <span className="not-allowed"> (als Gast nicht möglich)</span>}.
                    </span>
                </div>
                <div className="profile-body mt-5">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="oldEmail" className="col-form-label">
                                Aktuelle E-Mail Adresse
                            </label>
                            <input type="text" className="form-control" id="oldEmail" value={activeUser.email} disabled />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newEmail" className="col-form-label">
                                Neue E-Mail Adresse
                            </label>
                            <input
                                type="email"
                                className={`form-control ${emailError && !newEmail == '' && 'input-error'}`}
                                id="newEmail"
                                placeholder="user@example.com"
                                value={newEmail}
                                onChange={(e) => handleChangeEmail(e.target.value)}
                                disabled={isGuest}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newEmailPassword" className="col-form-label">
                                Passwort
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="newEmailPassword"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isGuest}
                                required
                            />
                        </div>
                        <div className="profile-footer mt-5">
                            <button type="button" className="btn btn-secondary" onClick={handleAbort}>
                                Abbrechen
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={emailError || password.length === 0 || newEmail.length === 0}>
                                E-Mail ändern
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
