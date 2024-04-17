import { useNavigate } from 'react-router';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { useUser } from '../../contexts/userContext';
import { useState } from 'react';
import { useDialog } from '../../contexts/dialogContext';

export default function Family() {
    const { familyManagement } = useUser();
    const { openDialog } = useDialog();
    const [familyName, setFamiliyName] = useState(familyManagement.name || '');
    const [lastPage] = useSessionStorage('lastPage');
    const navigate = useNavigate();

    function handleMangementSubmit(e) {
        e.preventDefault();
        console.log(familyName);
        navigate(`/app/${lastPage}`);
    }

    return (
        <div className="profile-wrapper fade-effect">
            <div className="profile-content family-management">
                <div className="profil-header">
                    <h4 className="profil-title mb-2">Familie verwalten</h4>
                    <span>Hier kannst du deine Familie verwalten und neue Familienmitglieder einladen.</span>
                </div>
                <div className="profile-body mt-5">
                    <form onSubmit={handleMangementSubmit}>
                        <div className="mb-3">
                            <h6 className="mb-3">Familienname</h6>
                            <input
                                type="text"
                                className="form-control"
                                id="userName"
                                value={familyName}
                                onChange={(e) => setFamiliyName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="settings-divider"></div>

                        <div className="mb-3">
                            <h6 className="mb-3">Mitglieder</h6>
                            <div className="member-box">
                                {familyManagement.member.map((member) => {
                                    return (
                                        <div className="member" key={member.id}>
                                            <img className="member-image" src={member.photo} alt="User image" />
                                            <span className="member-name">{member.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="member-action mt-3">
                                <button type="button" className="btn btn-primary" onClick={() => openDialog('invitationRef')}>
                                    Familienmitglied einladen
                                </button>
                            </div>
                        </div>

                        <div className="settings-divider"></div>

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
