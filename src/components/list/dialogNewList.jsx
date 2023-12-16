import { useState } from 'react';
import { useList } from '../../contexts/listContext';

export default function DialogNewList() {
    const { addNewList } = useList();
    const [title, setTitle] = useState('');

    /**
     * handles adding of new list
     * @param {event} e - event from form submit
     */
    function handleAddNewList(e) {
        e.preventDefault();
        addNewList(title);
        setTitle('');
    }

    return (
        <div className="modal fade" id="newListModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Neue Liste</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    Abbrechen
                                </button>
                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
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
