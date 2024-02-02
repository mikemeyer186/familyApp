import { useNavigate } from 'react-router';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useState } from 'react';
import { useUser } from '../../contexts/userContext';

export default function EmailChange() {
    const { activeUser, updateUserEmail } = useUser();
    const [newEmail, setNewEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [lastPage] = useLocalStorage('lastPage');
    const [isChanged, setIsChanged] = useState(false);
    const navigate = useNavigate();

    /**
     * handles user data update
     * @param {event} e - event from form submit
     */
    function handleSubmit(e) {
        e.preventDefault();
        console.log(newEmail);
        //action
        // navigate(`/app/${lastPage}`);
    }

    function handleChangeEmail(email) {
        setNewEmail(email);
        validateEmail(email);
    }

    function validateEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!pattern.test(email)) {
            setIsChanged(false);
            setEmailError(true);
        } else {
            setIsChanged(true);
            setEmailError(false);
        }
    }

    return (
        <div className="profile-wrapper">
            <div className="profile-content">
                <div className="profil-header">
                    <h4 className="profil-title mb-2">E-Mail Adresse ändern</h4>
                    <span>Hier kannst du deine E-Mail Adresse ändern, mit der du dich bei der App anmeldest</span>
                </div>
                <div className="profile-body mt-5">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
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
                                placeholder="example@mail.com"
                                value={newEmail}
                                onChange={(e) => handleChangeEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="profile-footer mt-5">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate(`/app/${lastPage}`)}>
                                Abbrechen
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={!isChanged}>
                                Speichern
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
