import { useEffect, useState } from 'react';
import { useUser } from '../../contexts/userContext';

export default function NewItemForm({ addItem }) {
    const { appSettings } = useUser();
    const [newItem, setNewItem] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Kategorie');
    const [isMobile, setIsMobile] = useState(false);
    const defaultCategories = appSettings.list.slice().sort((a, b) => a.category.localeCompare(b.category));

    /**
     * handles adding of new item
     * @param {event} event - event from form submit
     * @returns
     */
    function handleSubmit(event) {
        event.preventDefault();

        if (newItem === '') {
            return;
        } else {
            addItem(newItem, selectedCategory);
            setNewItem('');
        }
    }

    /**
     * handles selection of category
     * @param {string} category - category to select
     */
    function handleCategorySelection(category) {
        setSelectedCategory(category);
    }

    /**
     * checks if window size is mobile on page load
     */
    useEffect(() => {
        if (window.innerWidth > 480) {
            setIsMobile(false);
        }

        if (window.innerWidth <= 480) {
            setIsMobile(true);
        }
    }, []);

    /**
     * checks if window size is mobile on window resize
     */
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
            <div className="input-group mb-3 new-input">
                <button
                    className="btn dropdown-toggle btn-outline-secondary category-button"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <span>{selectedCategory}</span>
                </button>

                <ul className="dropdown-menu">
                    {defaultCategories.map((category, index) => {
                        return (
                            <li key={index} onClick={() => handleCategorySelection(category.category)}>
                                <span className="dropdown-item pointer">{category.category}</span>
                            </li>
                        );
                    })}
                </ul>

                <input
                    type="text"
                    className="form-control text-input"
                    placeholder="Hinzufügen..."
                    id="newListItemInput"
                    value={newItem || ''}
                    onChange={(event) => setNewItem(event.target.value)}
                />

                <button className="btn btn-primary" type="submit" id="addListItemButton" disabled={newItem === ''}>
                    {isMobile ? <strong>+</strong> : 'Hinzufügen'}
                </button>
            </div>
        </form>
    );
}
