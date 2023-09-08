import { useState } from 'react';

export default function DialogEditList({ listTitle, renameList }) {
    const [newTitle, setNewTitle] = useState(listTitle);

    function handleRenameList(e) {
        e.preventDefault();
        renameList(newTitle);
    }

    return (
        <div className="modal fade" id="editListModal" tabIndex="-1" aria-labelledby="editListModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="editListModalLabel">
                            Liste umbenennen
                        </h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleRenameList}>
                            <div className="mb-3">
                                <label htmlFor="new-list-name" className="col-form-label">
                                    Wie möchtest du die Liste nennen?
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="new-list-name"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Abbrechen
                                </button>
                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
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
