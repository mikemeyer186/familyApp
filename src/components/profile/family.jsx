import { useNavigate } from 'react-router';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { useUser } from '../../contexts/userContext';
import { useState } from 'react';
import { useDialog } from '../../contexts/dialogContext';
import { deleteInvitationCodeInFirestore, updateFamilyManagementInFirestore } from '../../services/firestore';

export default function Family() {
    const { familyID, familyManagement } = useUser();
    const { openDialog } = useDialog();
    const [familyName, setFamiliyName] = useState(familyManagement.name || '');
    const [lastPage] = useSessionStorage('lastPage');
    const navigate = useNavigate();

    /**
     * handles submit of family management changes (family name change)
     * @param {event} e - submit event
     */
    function handleMangementSubmit(e) {
        e.preventDefault();
        updateFamilyManagementInFirestore(familyID, familyName);
        navigate(`/app/${lastPage}`);
    }

    /**
     * deletes the invitation in firestore
     * @param {object} invitation - invitation object from firestore
     */
    function handleDeleteInvitation(invitation) {
        deleteInvitationCodeInFirestore(invitation.code, invitation, familyID);
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
                                placeholder="Dein Familienname"
                                id="userName"
                                value={familyName}
                                onChange={(e) => setFamiliyName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="settings-divider"></div>

                        <div className="mb-3">
                            <h6 className="mb-3">{`Mitglieder (${familyManagement.member.length})`}</h6>
                            <div className="member-box">
                                {familyManagement.member.map((member) => {
                                    return (
                                        <div className="member" key={member.id}>
                                            <img
                                                className="member-image"
                                                src={member.photo === '' ? '/assets/img/profile-picture.png' : member.photo}
                                                alt="User image"
                                            />
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

                        <div className="mb-3">
                            <h6 className="mb-3">{`Einladungen (${familyManagement.invited.length})`}</h6>
                            <div className="invited-box">
                                {familyManagement.invited.map((invitedUser) => {
                                    return (
                                        <div key={invitedUser.code}>
                                            <div className="btn btn-outline-primary" data-bs-toggle="dropdown" aria-expanded="false">
                                                <span className="member-name">{invitedUser.email}</span>
                                                <ul className="dropdown-menu dropdown-menu-invitation">
                                                    <li>
                                                        <button
                                                            className="dropdown-item"
                                                            type="button"
                                                            onClick={() => handleDeleteInvitation(invitedUser)}
                                                        >
                                                            Einladung zurückziehen
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    );
                                })}
                                {familyManagement.invited.length === 0 && <span className="text-center">Keine offenen Einladungen</span>}
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
