import { useState } from 'react';

export default function NewItemForm({ addItem }) {
    const [newItem, setNewItem] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Kategorie');
    const defaultCategories = ['Lebensmittel', 'Haushalt', 'Hygiene', 'Schule', 'Hund', 'Sonstiges'];

    function handleSubmit(event) {
        event.preventDefault();

        if (newItem === '') {
            return;
        } else {
            addItem(newItem, selectedCategory);
            setNewItem('');
        }
    }

    function handelCategorySelection(category) {
        setSelectedCategory(category);
    }

    return (
        <form onSubmit={handleSubmit}>
            <label className="px-1 mb-2" htmlFor="newListItemInput">
                Der Einkaufsliste hinzufügen:
            </label>

            <div className="input-group mb-3">
                <button
                    className="btn dropdown-toggle btn-outline-secondary thinBorder width130"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    {selectedCategory}
                </button>

                <ul className="dropdown-menu">
                    {defaultCategories.map((category) => {
                        return (
                            <li key={category} onClick={() => handelCategorySelection(category)}>
                                <a className="dropdown-item" href="#">
                                    {category}
                                </a>
                            </li>
                        );
                    })}
                </ul>

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
