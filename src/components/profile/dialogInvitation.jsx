import { useState } from 'react';
import { useDialog } from '../../contexts/dialogContext';
import { useUser } from '../../contexts/userContext';
import { addInvitationCodeInFirestore } from '../../services/firestore';
import { useAlert } from '../../contexts/alertContext';

export default function DialogInvitation() {
    const { dialogs, closeDialog } = useDialog();
    const { activeUser, familyID } = useUser();
    const { setError, setSuccess } = useAlert();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const invitationCode = crypto.randomUUID();
    const invitationLink = encodeURIComponent(`https://familyapp.mike-meyer.dev/signup?page=Registrieren&invitation=${invitationCode}`);

    /**
     * creates the invitation object and stores it in firestore
     * opens the mail client window
     * @param {event} e
     */
    async function handleInviteUser(e) {
        e.preventDefault();
        const invitation = {
            name: name,
            email: email,
            code: invitationCode,
            familyID: familyID,
            date: new Date(),
        };

        try {
            addInvitationCodeInFirestore(invitationCode, invitation, familyID);
            window.open(
                `mailto:${email}?subject=Einladung%20zur%20familyApp&body=Hallo%20${name},%0D%0A%0D%0Abitte%20werde%20Mitglied%20bei%20unserer%20Familie%20in%20der%20familyApp%20und%20registriere%20dich%20über%20folgenden%20Link:%0D%0A%0D%0A%0D%0A${invitationLink}%0D%0A%0D%0A%0D%0AWenn%20du%20bereits%20registriert%20bist,%20gib%20den%20folgenden%20Code%20unter%20"Familie%20verwalten"%20ein.%0D%0A%0D%0A${invitationCode}%0D%0A%0D%0A%0D%0A%0D%0AViele%20Grüße%0D%0A%0D%0A${activeUser.displayName}`
            );
            handleCloseDialog();
            setSuccess('Der Einladungslink wurde erfolgreich erstellt!');
        } catch (e) {
            setError('Irgendetwas ist schiefgelaufen. Versuch es noch einmal.');
        }
    }

    /**
     * closes invitation dialog
     */
    function handleCloseDialog() {
        closeDialog('invitationRef');
        setName('');
        setEmail('');
    }

    return (
        <div className="modal fade" id="invitationRef" tabIndex="-1" aria-hidden="true" ref={dialogs.invitationRef}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Familienmitglied einladen</h1>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDialog}></button>
                    </div>
                    <form onSubmit={handleInviteUser}>
                        <div className="modal-body">
                            <p>
                                Lade ein weiteres Familienmitglied zur familyApp ein. Bitte beachte, dass das eingeladene Mitglied Zugriff auf die
                                Daten deiner Familie erhält. Prüfe daher die E-Mail Adresse genau, bevor du die Einladung versendest. Der
                                Einladungslink ist nur für 24 Stunden gültig.
                            </p>
                            <div className="mb-3">
                                <label htmlFor="memberName" className="col-form-label">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="memberName"
                                    placeholder="z. B. Vorname"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="memberEmail" className="col-form-label">
                                    E-Mail
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="memberEmail"
                                    placeholder="user@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseDialog}>
                                Abbrechen
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={name === '' || email === ''}>
                                Einladen
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
