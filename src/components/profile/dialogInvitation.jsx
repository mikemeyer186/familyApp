import { useState } from 'react';
import { useDialog } from '../../contexts/dialogContext';
import { useUser } from '../../contexts/userContext';

export default function DialogInvitation() {
    const { dialogs, closeDialog } = useDialog();
    const { activeUser } = useUser();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const invitationCode = crypto.randomUUID();
    const invitationLink = encodeURIComponent(`https://familyapp.mike-meyer.dev/signup?page=Registrieren&invitation=${invitationCode}`);

    function handleInviteUser(e) {
        e.preventDefault();
        console.log('invited');
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
                                Einladungslink ist nur für 24 Studen gültig.
                            </p>
                            <div className="mb-3">
                                <label htmlFor="memberName" className="col-form-label">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="memberName"
                                    placeholder="Name"
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
                            <a
                                href={`mailto:${email}?subject=Einladung%20zur%20familyApp&body=Hallo%20${name},%0D%0A%0D%0Abitte%20werde%20Mitglied%20bei%20unserer%20Familie%20bei%20der%20familyApp%20und%20registriere%20dich%20über%20folgenden%20Link:%0D%0A%0D%0A%0D%0A${invitationLink}%0D%0A%0D%0A%0D%0AAlternativ%20gib%20den%20folgenden%20Code%20bei%20der%20Registrierung%20ein.%0D%0A%0D%0A${invitationCode}%0D%0A%0D%0A%0D%0A%0D%0ADie%20Einladung%20ist%20nur%20für%2024%20Stunden%20gültig.%0D%0A%0D%0A%0D%0AViele%20Grüße%0D%0A%0D%0A${activeUser.displayName}`}
                            >
                                <button type="submit" className="btn btn-primary" disabled={name === '' || email === ''}>
                                    Einladen
                                </button>
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
