import { useNavigate } from 'react-router';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { useUser } from '../../contexts/userContext';
import { useDialog } from '../../contexts/dialogContext';
import {
    deleteInvitationCodeInFirestore,
    loadFamilyNamesFromFirestore,
    loadUserDataFromFirestore,
    updateFamilyManagementInFirestore,
} from '../../services/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useAlert } from '../../contexts/alertContext';

export default function Family() {
    const { familyID, userSettings, familyManagement, isGuest, connectFamily } = useUser();
    const { openDialog } = useDialog();
    const { setError, setSuccess } = useAlert();
    const [activeFamily, setActiveFamily] = useState(familyManagement);
    const [familyName, setFamilyName] = useState(familyManagement.name);
    const [selectableFamilies, setSelectableFamilies] = useState([]);
    const [memberData, setMemberData] = useState([]);
    const [lastPage] = useSessionStorage('lastPage');
    const navigate = useNavigate();

    /**
     * handles the connection of selected family id
     * @param {event} e - submit event
     */
    async function handleConnectFamily(e) {
        e.preventDefault();
        await connectFamily(activeFamily.id);
        navigate('/');
    }

    /**
     * handles submit of family management changes (family name change)
     * @param {event} e - submit event
     */
    function handleMangementSubmit(e) {
        e.preventDefault();
        try {
            updateFamilyManagementInFirestore(familyID, familyName);
            navigate(`/app/${lastPage}`);
            setSuccess('Die Daten der Familie wurden erfolgreich geändert!');
        } catch (e) {
            setError('Irgendetwas ist schiefgelaufen. Versuch es noch einmal.');
        }
    }

    /**
     * deletes the invitation in firestore
     * @param {object} invitation - invitation object from firestore
     */
    function handleDeleteInvitation(invitation) {
        try {
            deleteInvitationCodeInFirestore(invitation.code, invitation, familyID);
            setSuccess('Die Einladung wurde erfolgreich gelöscht!');
        } catch (e) {
            setError('Irgendetwas ist schiefgelaufen. Versuch es noch einmal.');
        }
    }

    /**
     * loads the family names for dropdown menu
     */
    const loadFamilyNames = useCallback(
        function loadFamilyNames() {
            let familyNames = [];

            userSettings.available.map(async (family) => {
                const familyName = await loadFamilyNamesFromFirestore(family);
                familyNames = [...familyNames, familyName];
                setSelectableFamilies(familyNames);
            });
        },
        [userSettings]
    );

    /**
     * loads the user data of family members
     */
    const loadMemberData = useCallback(
        function loadMemberData() {
            let memberData = [];

            familyManagement.member.map(async (member) => {
                const data = await loadUserDataFromFirestore(member);
                memberData = [...memberData, data.profile];
                setMemberData(memberData);
            });
        },
        [familyManagement]
    );

    useEffect(() => {
        loadFamilyNames();
        loadMemberData();
    }, [loadFamilyNames, loadMemberData]);

    return (
        <div className="profile-wrapper fade-effect">
            <div className="profile-content family-management">
                <div className="profil-header">
                    <h4 className="profil-title mb-2">Familie verwalten</h4>
                    <span>
                        Hier kannst du deine aktive Familie wählen, deine Familie verwalten oder neue Familienmitglieder einladen. Du kannst maximal
                        zwischen deiner eigenen Familie und eine Familie, zu der du eingeladen wurdest, wählen{' '}
                        {isGuest && <span className="not-allowed"> (in der Testversion nicht möglich)</span>}.
                    </span>
                </div>
                <div className="profile-body mt-5">
                    <form onSubmit={handleMangementSubmit}>
                        <div className="mb-3">
                            <h6 className="mb-3">Aktive Familie</h6>
                            <button
                                className="btn dropdown-toggle btn-outline-primary width-full"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {activeFamily.name}
                            </button>
                            <ul className="dropdown-menu">
                                {selectableFamilies.map((family) => {
                                    return (
                                        <li key={family.id} onClick={() => setActiveFamily(family)}>
                                            <div className="dropdown-item pointer">
                                                <span>{family.name} </span>
                                                <span>({family.id.slice(0, 8)})</span>
                                            </div>
                                        </li>
                                    );
                                })}
                                {userSettings.available.length === 1 && !userSettings.invited && !isGuest && (
                                    <li onClick={() => openDialog('connectionRef')}>
                                        <span className="dropdown-item pointer">Mit Familie verbinden</span>
                                    </li>
                                )}
                                {userSettings.available.length === 1 && userSettings.invited && !isGuest && (
                                    <li onClick={() => openDialog('createRef')}>
                                        <span className="dropdown-item pointer">Eigene Familie erstellen</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="member-action mt-3">
                            <button type="button" className="btn btn-primary" onClick={handleConnectFamily} disabled={activeFamily.id === familyID}>
                                {activeFamily.id === familyID ? 'Aktive Familie' : 'Familie wechseln'}
                            </button>
                        </div>

                        <div className="settings-divider"></div>

                        <div className="mb-3">
                            <h6 className="mb-3">Familienname</h6>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Dein Familienname"
                                id="userName"
                                value={familyName}
                                onChange={(e) => setFamilyName(e.target.value)}
                                disabled={isGuest}
                                required
                            />
                        </div>

                        <div className="settings-divider"></div>

                        <div className="mb-3">
                            <h6 className="mb-3">{`Mitglieder (${familyManagement.member.length})`}</h6>
                            <div className="member-box">
                                {memberData.map((member) => {
                                    return (
                                        <div className="member" key={member.id}>
                                            <img
                                                className="member-image"
                                                src={member.photo === '' || !member.photo ? '/assets/img/profile-picture.png' : member.photo}
                                                alt="User image"
                                            />
                                            <span className="member-name">{member.name}</span>
                                        </div>
                                    );
                                })}
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
                                <div className="member-action mt-3">
                                    <button type="button" className="btn btn-primary" onClick={() => openDialog('invitationRef')} disabled={isGuest}>
                                        Familienmitglied einladen
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="settings-divider"></div>

                        <div className="profile-footer mt-5">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate(`/app/${lastPage}`)}>
                                Abbrechen
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={familyName === familyManagement.name}>
                                Speichern
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
