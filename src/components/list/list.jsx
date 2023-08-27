import { useState } from 'react';

export default function List() {
    const [newItem, setNewItem] = useState('');
    const [listItems, setListItems] = useState([]);

    function submitItem(event) {
        event.preventDefault();
        setListItems((currentListItems) => {
            return [
                ...currentListItems,
                {
                    id: crypto.randomUUID(),
                    title: newItem,
                    done: false,
                },
            ];
        });
        setNewItem('');
    }

    function toggleItem(itemId, done) {
        setListItems((currentListItems) => {
            return currentListItems.map((item) => {
                if (item.id === itemId) {
                    return { ...item, done };
                }

                return item;
            });
        });
    }

    function deleteItem(itemId) {
        setListItems((currentListItems) => {
            return currentListItems.filter((item) => item.id !== itemId);
        });
    }

    return (
        <>
            <form onSubmit={submitItem}>
                <div className="container py-4 px-3 mx-auto">
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
                </div>
            </form>
            <div className="container py-4 px-3 mx-auto">
                <h3 className="px-1 mb-2">Einkaufsliste</h3>
                <ul className="list-group">
                    {listItems.length === 0 && <span className="px-1">Es sind keine Einträge vorhanden.</span>}
                    {listItems.map((item) => {
                        return (
                            <li className="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
                                <label className="form-check-label stretched-link d-flex gap-2">
                                    <input className="form-check-input me-1" type="checkbox" defaultChecked={item.done} onChange={(e) => toggleItem(item.id, e.target.checked)} />
                                    {item.title}
                                </label>
                                <button type="button" className="btn btn-sm btn-outline-danger z-1" onClick={() => deleteItem(item.id)}>
                                    Entfernen
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}
