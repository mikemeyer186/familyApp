import { useState } from 'react';

export default function NewItemForm({ onSubmit }) {
    const [newItem, setNewItem] = useState('');

    function submitItem(event) {
        event.preventDefault();

        if (newItem === '') {
            return;
        }

        onSubmit(newItem);

        setNewItem('');
    }

    return (
        <form onSubmit={submitItem}>
            <label className="px-1 mb-2" htmlFor="newListItemInput">
                Der Einkaufsliste hinzufügen:
            </label>
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Schreib etwas..."
                    id="newListItemInput"
                    value={newItem || ''}
                    onChange={(event) => setNewItem(event.target.value)}
                />
                <button className="btn btn-primary" type="submit" id="addListItemButton">
                    Hinzufügen
                </button>
            </div>
        </form>
    );
}
