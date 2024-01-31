import { useEffect, useState } from 'react';
import { useList } from '../../contexts/listContext';
import { useDialog } from '../../contexts/dialogContext';

export default function DialogEditList() {
    const { selectedList, renameList } = useList();
    const { dialogs, closeDialog } = useDialog();
    const [newTitle, setNewTitle] = useState('');

    /**
     * handles renaming of list
     * @param {event} e - event from form submit
     */
    function handleRenameList(e) {
        e.preventDefault();
        renameList(selectedList.id, newTitle);
        handleCloseDialog();
    }

    /**
     * closes the edit dialog
     */
    function handleCloseDialog() {
        closeDialog('listEditRef');
        setNewTitle(selectedList.title);
    }

    /**
     * sets the title of selected list if user clicks on the dropdown menu
     */
    useEffect(() => {
        if (selectedList.title) {
            setNewTitle(selectedList.title);
        }
    }, [selectedList]);

    return (
        <div className="modal fade" id="listEditRef" tabIndex="-1" aria-hidden="true" ref={dialogs.listEditRef}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Liste umbenennen</h1>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDialog}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleRenameList}>
                            <div className="mb-3">
                                <label htmlFor="new-list-name" className="col-form-label">
                                    Wie möchtest du die Liste nennen?
                                </label>
                                <input
                                    className="form-control"
                                    id="new-list-name"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseDialog}>
                                    Abbrechen
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Umbenennen
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
