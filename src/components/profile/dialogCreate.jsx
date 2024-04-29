import { useDialog } from '../../contexts/dialogContext';
import { useUser } from '../../contexts/userContext';

export default function DialogCreate() {
    const { dialogs, closeDialog } = useDialog();
    const { createOwnFamily } = useUser();

    async function handleCreateFamily(e) {
        e.preventDefault();
        await createOwnFamily();
        handleCloseDialog();
    }

    /**
     * closes invitation dialog
     */
    function handleCloseDialog() {
        closeDialog('createRef');
    }

    return (
        <div className="modal fade" id="createRef" tabIndex="-1" aria-hidden="true" ref={dialogs.createRef}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Eigene Familie erstellen</h1>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDialog}></button>
                    </div>
                    <div>
                        <div className="modal-body">
                            <p>
                                Du kannst eine eigene Familie erstellen, um sie als deinen eigenen Bereich zu nutzen oder um weitere
                                Familienmitgleider zu deiner Familie einzuladen.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseDialog}>
                                Abbrechen
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleCreateFamily}>
                                Erstellen
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
