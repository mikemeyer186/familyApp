import { useAlert } from '../../contexts/alertContext';
import { useDialog } from '../../contexts/dialogContext';
import { useJournal } from '../../contexts/journalContext';

export default function DialogDeleteData() {
    const { deletePayment, expansionData, setExpandedRows } = useJournal();
    const { dialogs, closeDialog } = useDialog();
    const { setSuccess } = useAlert();

    /**
     * handles the deleting of the payment
     */
    function handleDeletePayment() {
        deletePayment(expansionData);
        setExpandedRows(null);
        setSuccess('Der Beleg wurde erfolgreich gelöscht!');
        handleCloseDialog();
    }

    /**
     * closes dialog
     */
    function handleCloseDialog() {
        closeDialog('journalDeleteRef');
    }

    return (
        <div className="modal fade" id="journalDeleteRef" tabIndex="-1" aria-hidden="true" ref={dialogs.journalDeleteRef}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Beleg löschen</h1>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDialog}></button>
                    </div>
                    <div className="modal-body">Möchtest du den Beleg wirklich löschen?</div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCloseDialog}>
                            Abbrechen
                        </button>
                        <button type="button" className="btn btn-danger" onClick={handleDeletePayment}>
                            Beleg löschen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
