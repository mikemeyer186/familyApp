import { useState } from 'react';
import { useDialog } from '../../contexts/dialogContext';
import { useUser } from '../../contexts/userContext';
import { useSessionStorage } from '../../hooks/useSessionStorage';

export default function DialogTestApp() {
    const { dialogs, closeDialog } = useDialog();
    const { signOutUser } = useUser();
    const [consentChecked, setConsentChecked] = useState(false);
    const [consent, setConsent] = useSessionStorage('consent');

    /**
     * sets consent to true and starts the app
     * @param {event} e - event from submit
     */
    function handleStartTest(e) {
        e.preventDefault();
        setConsent(true);
        handleCloseDialog();
    }

    /**
     * signs the test user out if user does not consent
     */
    function handleSignOut() {
        closeDialog('testAppRef');
        signOutUser();
    }

    /**
     * closes new list dialog
     */
    function handleCloseDialog() {
        closeDialog('testAppRef');
    }

    return (
        <div
            className="modal fade testApp-modal"
            id="testAppRef"
            tabIndex="-1"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            aria-hidden="true"
            ref={dialogs.testAppRef}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Willkommen zur familyApp!</h1>
                    </div>
                    <form onSubmit={handleStartTest}>
                        <div className="modal-body">
                            <h6>Was kann die App?</h6>
                            <p>
                                Die familyApp ist darauf ausgelegt, das Familienleben durch verschiedene Funktionen wie einen Kalender, ein
                                Haushaltsbuch, eine Listenfunktion und einen trainierten KI-Assistenten zu erleichtern. Mit der App behältst du
                                Finanzen sowie Termine immer im Blick und vergessene Einkaufszettel gehören der Vergangenheit an. Der freundliche
                                KI-Assistent unterstützt dich im Familienalltag mit leckeren Rezeptideen oder mit Vorschlägen für spannende
                                Aktivitäten. Alle Daten werden innerhalb der Familie geteilt, sodass jedes Familienmitglied die gleichen Informationen
                                hat. Da sich die App aktuell in einer intensiven Testphase mit eingeschränktem Nutzerkreis befindet, ist eine
                                Anmeldung neuer Nutzer noch nicht möglich. Aber keine Sorge: Du kannst alle Funktionen der App vollständig testen
                                (ausgenommen die Bearbeitung des Benutzerprofils).
                            </p>
                            <h6>Hinweise zur Testversion</h6>
                            <p>
                                In der Testversion kannst du die Funktionsweise der App auf verschiedenen Endgeräten ausprobieren – du wirst quasi
                                Teil einer &quot;Testfamilie&quot;. Bitte beachte, dass die von dir eingegebenen Testdaten (wie z. B. Termine, Chats
                                und Listen) für andere Testnutzer sichtbar sind, sofern du sie nicht wieder löscht. Um deine Privatsphäre zu schützen,
                                darfst du keine persönlichen Daten eingeben! Die Testdaten werden in &quot;Google Cloud&quot; und &quot;Firebase&quot;
                                gespeichert. Neben den Testdaten werden unter anderem auch dein Browsertyp und -version, dein verwendetes
                                Betriebssystem, die Referrer URL, der Hostname des zugreifenden Rechners, die Uhrzeit der Serveranfrage und deine
                                IP-Adresse an Google übermittelt.
                            </p>
                            <p>
                                <strong>Bitte nutze die Testversion nur, wenn du mit diesen Bedingungen einverstanden bist.</strong>
                            </p>
                            <div className="mb-3 centered-horizontal">
                                <input
                                    type="checkbox"
                                    className="checkbox me-2 pointer"
                                    id="consent"
                                    checked={consentChecked}
                                    onChange={(e) => setConsentChecked(e.target.checked)}
                                    required
                                />
                                <label htmlFor="consent" className="col-form-label pointer">
                                    Ich bin einverstanden
                                </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleSignOut}>
                                Abmelden
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={!consentChecked}>
                                Los geht´s!
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
