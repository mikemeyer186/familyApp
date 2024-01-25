import { useNavigate } from 'react-router';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import listCategories from '../../data/listCategories';

export default function Settings() {
    const [lastPage] = useLocalStorage('lastPage');
    const navigate = useNavigate();

    /**
     * handles user data update
     * @param {event} e - event from form submit
     */
    function handleSubmit(e) {
        e.preventDefault();
        //action
        //save one single object to firestore (list, journal, calendar...)
        navigate(`/app/${lastPage}`);
    }

    return (
        <div className="profile-wrapper">
            <div className="profile-content">
                <div className="profil-header">
                    <h4 className="profil-title mb-2">Einstellungen</h4>
                    <span>Hier kannst die Einstellungen für die gesamte App ändern</span>
                </div>
                <div className="profile-body mt-5">
                    <form>
                        <div className="mb-3">
                            <h6 className="mb-3">Kategorien für Listen</h6>
                            {listCategories.map((category, index) => {
                                return (
                                    <input key={index} type="text" id={`category${index}`} className="form-control mb-2" defaultValue={category} />
                                );
                            })}
                        </div>
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
