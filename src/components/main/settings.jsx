import { useNavigate } from 'react-router';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useState } from 'react';
import { useUser } from '../../contexts/userContext';
import { saveSettingsInFirestore } from '../../services/firestore';

export default function Settings() {
    const { familyID, appSettings } = useUser();
    const [lastPage] = useLocalStorage('lastPage');
    const [newAppSettings, setNewAppSetting] = useState([]);
    const [editedAppSettings, setEditedAppSetting] = useState([]);
    const navigate = useNavigate();
    console.log(appSettings);

    /**
     * handles user data update
     * @param {event} e - event from form submit
     */
    function handleSubmit(e) {
        e.preventDefault();
        saveSettingsInFirestore(familyID, appSettings);
        // navigate(`/app/${lastPage}`);
    }

    return (
        <div className="profile-wrapper">
            <div className="profile-content">
                <div className="profil-header">
                    <h4 className="profil-title mb-2">Einstellungen</h4>
                    <span>Hier kannst die globalen Einstellungen ändern</span>
                </div>
                <div className="profile-body mt-5">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <h6 className="mb-3">Kategorien für Listen</h6>
                            {appSettings.list.map((category, index) => {
                                return (
                                    <div key={index} className="settings-list mb-2">
                                        <input type="text" id={`category${index}`} className="form-control" defaultValue={category.category} />
                                        <input type="color" className="form-control settings-list-color" defaultValue={category.color}></input>
                                        {index > 0 ? (
                                            <img src="/assets/icons/dash-circle.svg" alt="Delete" className="iconClickable delete-icon" />
                                        ) : (
                                            <div className="delete-icon-invisible"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="profile-footer mt-5">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate(`/app/${lastPage}`)}>
                                Abbrechen
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Speichern
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
