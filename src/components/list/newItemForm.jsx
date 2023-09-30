import { useEffect, useState } from 'react';

export default function NewItemForm({ addItem }) {
    const [newItem, setNewItem] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Kategorie');
    const [isMobile, setIsMobile] = useState(false);
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

    function handleCategorySelection(category) {
        setSelectedCategory(category);
    }

    useEffect(() => {
        if (window.innerWidth > 480) {
            setIsMobile(false);
        }

        if (window.innerWidth <= 480) {
            setIsMobile(true);
        }
    }, []);

    useEffect(() => {
        const sizeListener = window.addEventListener('resize', () => {
            if (window.innerWidth > 480) {
                setIsMobile(false);
            }

            if (window.innerWidth <= 480) {
                setIsMobile(true);
            }
        });

        return () => {
            window.removeEventListener('resize', sizeListener);
        };
    }, []);

    return (
        <form onSubmit={handleSubmit}>
            <div className="input-group mb-3 newInput">
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
                            <li key={category} onClick={() => handleCategorySelection(category)}>
                                <span className="dropdown-item pointer">{category}</span>
                            </li>
                        );
                    })}
                </ul>

                <input
                    type="text"
                    className="form-control textInput"
                    placeholder="Füge etwas hinzu..."
                    id="newListItemInput"
                    value={newItem || ''}
                    onChange={(event) => setNewItem(event.target.value)}
                />

                <button className="btn btn-primary" type="submit" id="addListItemButton">
                    {isMobile ? <strong>+</strong> : 'Hinzufügen'}
                </button>
            </div>
        </form>
    );
}
