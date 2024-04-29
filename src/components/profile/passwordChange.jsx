import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useUser } from '../../contexts/userContext';
import { useSessionStorage } from '../../hooks/useSessionStorage';

export default function PasswordChange() {
    const { isGuest, updateUserPassword } = useUser();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordCheck, setPasswordCheck] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [lastPage] = useSessionStorage('lastPage');
    const navigate = useNavigate();

    /**
     * handles user password update
     * @param {event} e - event from form submit
     */
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await updateUserPassword(oldPassword, newPassword);
            navigate(`/app/${lastPage}`);
            setNewPassword('');
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * handles new password change
     * validates and compares the new password
     * @param {string} password - new password from from input
     */
    function handleNewPasswordChange(password) {
        setNewPassword(password);
        const validation = validatePassword(password);
        comparePasswords(password, passwordCheck, validation);
    }

    /**
     * handles check password change
     * validates and compares the check password
     * @param {string} password - check password from form input
     */
    function handleCheckPasswordChange(password) {
        setPasswordCheck(password);
        comparePasswords(newPassword, password, validPassword);
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
     * handles the aborting of password change
     */
    function handleAbort() {
        navigate(`/app/${lastPage}`);
        setOldPassword('');
        setNewPassword('');
        setPasswordCheck('');
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
        <div className="profile-wrapper fade-effect">
            <div className="profile-content">
                <div className="profil-header">
                    <h4 className="profil-title mb-2">Passwort ändern</h4>
                    <span>
                        Hier kannst du dein Account-Passwort ändern. Vergib ein sicheres Passwort mit mindestens 8 Zeichen, mindestens einer Zahl und
                        einem Sonderzeichen{isGuest && <span className="not-allowed"> (in der Testversion nicht möglich)</span>}.
                    </span>
                </div>
                <div className="profile-body mt-5">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="oldPassword" className="col-form-label">
                                Aktuelles Passwort
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="oldPassword"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                disabled={isGuest}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="col-form-label password-check-label">
                                Neues Passwort
                                <span className={validPassword ? 'safe' : 'unsafe'}>
                                    {!validPassword && !newPassword == '' ? 'unsicher' : validPassword && !newPassword == '' && 'sicher'}
                                </span>
                            </label>
                            <input
                                type="password"
                                className={`form-control ${validPassword ? 'input-checked' : !validPassword && !newPassword == '' && 'input-error'}`}
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => handleNewPasswordChange(e.target.value)}
                                disabled={isGuest}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newPasswordCheck" className="col-form-label">
                                Neues Passwort wiederholen
                            </label>
                            <input
                                type="password"
                                className={`form-control ${
                                    passwordError && !passwordCheck == '' ? 'input-error' : !passwordError && !passwordCheck == '' && 'input-checked'
                                }`}
                                id="newPasswordCheck"
                                value={passwordCheck}
                                onChange={(e) => handleCheckPasswordChange(e.target.value)}
                                disabled={isGuest}
                                required
                            />
                        </div>
                        <div className="profile-footer mt-5">
                            <button type="button" className="btn btn-secondary" onClick={handleAbort}>
                                Abbrechen
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={passwordError || oldPassword.length === 0 || newPassword.length === 0}
                            >
                                Ändern
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
