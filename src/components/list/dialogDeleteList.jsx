import { useList } from '../../contexts/listContext';
import { useDialog } from '../../contexts/dialogContext';

export default function DialogDeleteList() {
    const { selectedList, modalType, clearList, deleteList } = useList();
    const { dialogs, closeDialog } = useDialog();

    /**
     * closes the delete dialog
     */
    function handleCloseDialog() {
        closeDialog('listDeleteRef');
    }

    /**
     * deletes the list
     */
    function handleDeleteList() {
        deleteList(selectedList.id);
        handleCloseDialog();
    }

    /**
     * clears the list (all items)
     */
    function handleClearList() {
        clearList(selectedList.id);
        handleCloseDialog();
    }

    return (
        <div className="modal fade" id="listDeleteRef" tabIndex="-1" aria-hidden="true" ref={dialogs.listDeleteRef}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">{modalType === 'delete' ? 'Liste löschen' : 'Liste leeren'}</h1>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDialog}></button>
                    </div>
                    <div className="modal-body">
                        {modalType === 'delete' ? 'Möchtest du die Liste wirklich löschen?' : 'Möchtest du die Liste komplett leeren?'}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCloseDialog}>
                            Abbrechen
                        </button>

                        {modalType === 'delete' ? (
                            <button type="button" className="btn btn-danger" onClick={handleDeleteList}>
                                Liste löschen
                            </button>
                        ) : (
                            <button type="button" className="btn btn-danger" onClick={handleClearList}>
                                Liste leeren
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
