import { useState } from 'react';
import { useDialog } from '../../contexts/dialogContext';
import { checkInvitationCode } from '../../services/firestore';
import { useAlert } from '../../contexts/alertContext';
import { useUser } from '../../contexts/userContext';

export default function DialogConnect() {
    const { dialogs, closeDialog } = useDialog();
    const { addNewFamilyConnection } = useUser();
    const { setError, setSuccess } = useAlert();
    const [code, setCode] = useState('');

    /**
     * handles the connection of a new family after invitation
     * @param {event} e - submit event
     */
    async function handleFamilyConnection(e) {
        e.preventDefault();
        const validCode = await checkInvitationCode(code);

        if (validCode) {
            addNewFamilyConnection(code);
            setSuccess('Die neue wurde Familie hinzugefügt.');
        } else {
            setError('Der Einladungscode ist ungültig oder abgelaufen. Bitte ein Familienmitglied dich erneut einzuladen.');
        }
        handleCloseDialog();
    }

    /**
     * closes invitation dialog
     */
    function handleCloseDialog() {
        closeDialog('connectionRef');
        setCode('');
    }

    return (
        <div className="modal fade" id="connectionRef" tabIndex="-1" aria-hidden="true" ref={dialogs.connectionRef}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Mit Familie verbinden</h1>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDialog}></button>
                    </div>
                    <form onSubmit={handleFamilyConnection}>
                        <div className="modal-body">
                            <p>Gib bitte den Einladungscode ein, den du von einem Familienmitglied erhalten hast.</p>
                            <div className="mb-3">
                                <label htmlFor="code" className="col-form-label">
                                    Einladungscode
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="code"
                                    placeholder="abc-def-123-456..."
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseDialog}>
                                Abbrechen
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={code === ''}>
                                Verbinden
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
