import { useState } from 'react';
import { useList } from '../../contexts/listContext';
import { useDialog } from '../../contexts/dialogContext';

export default function DialogNewList() {
    const { addNewList } = useList();
    const { dialogs, closeDialog } = useDialog();
    const [title, setTitle] = useState('');

    /**
     * handles adding of new list
     * @param {event} e - event from form submit
     */
    function handleAddNewList(e) {
        e.preventDefault();
        addNewList(title);
        setTitle('');
        handleCloseDialog();
    }

    /**
     * closes new list dialog
     */
    function handleCloseDialog() {
        closeDialog('listNewRef');
    }

    return (
        <div className="modal fade" id="listNewRef" tabIndex="-1" aria-hidden="true" ref={dialogs.listNewRef}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Neue Liste</h1>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDialog}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleAddNewList}>
                            <div className="mb-3">
                                <label htmlFor="list-name" className="col-form-label">
                                    Wie möchtest du die neue Liste nennen?
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="list-name"
                                    placeholder="Titel der Liste"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseDialog}>
                                    Abbrechen
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Erstellen
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
