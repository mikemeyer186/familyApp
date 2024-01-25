import { useNavigate } from 'react-router';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function EmailChange() {
    const [lastPage] = useLocalStorage('lastPage');
    const navigate = useNavigate();

    /**
     * handles user data update
     * @param {event} e - event from form submit
     */
    function handleSubmit(e) {
        e.preventDefault();
        //action
        navigate(`/app/${lastPage}`);
    }

    return (
        <div className="profile-wrapper">
            <div className="profile-content">
                <div className="profil-header">
                    <h4 className="profil-title mb-2">E-Mail Adresse ändern</h4>
                    <span>Hier kannst du deine E-Mail Adresse ändern, mit der du dich bei der App anmeldest</span>
                </div>
                <div className="profile-body mt-5">
                    <form>
                        <div className="profile-footer mt-5">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate(`/app/${lastPage}`)}>
                                Abbrechen
                            </button>
                            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                                Speichern
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
