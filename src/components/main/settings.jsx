import { useNavigate } from 'react-router';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useState } from 'react';
import { useUser } from '../../contexts/userContext';
import { saveSettingsInFirestore } from '../../services/firestore';

export default function Settings() {
    const { familyID, appSettings } = useUser();
    const [newAppSettings, setNewAppSettings] = useState([]);
    const [listCategories, setListCategories] = useState(appSettings.list.map((category) => ({ ...category })));
    const [lastPage] = useLocalStorage('lastPage');
    const navigate = useNavigate();

    /**
     * handles user data update
     * @param {event} e - event from form submit
     */
    function handleSubmit(e) {
        e.preventDefault();
        console.log(newAppSettings);
        saveSettingsInFirestore(familyID, newAppSettings);
        navigate(`/app/${lastPage}`);
    }

    /**
     * handles the change of category name or color
     * @param {string} value - value from input field
     * @param {number} index - index of input
     * @param {string} field - category key (category or color)
     */
    function handleListCategoryChange(value, index, field) {
        let updatedCategories = listCategories.map((category) => ({ ...category }));
        updatedCategories[index][field] = value ?? '';
        setListCategories(updatedCategories);
        setNewAppSettings({ ...appSettings, list: updatedCategories });
    }

    /**
     * deltes the category from list categories
     * @param {number} index - index of category
     */
    function handleDeleteListCategory(index) {
        let updatedCategories = listCategories.map((category) => ({ ...category }));
        updatedCategories.splice(index, 1);
        setListCategories(updatedCategories);
        setNewAppSettings({ ...appSettings, list: updatedCategories });
    }

    /**
     * adds a new category to list categories
     * with empty text input and default color (can be changed by user)
     */
    function handleAddListCategory() {
        let updatedCategories = listCategories.map((category) => ({ ...category }));
        const newCategory = { category: '', color: '#3f55ab' };
        updatedCategories.push(newCategory);
        setListCategories(updatedCategories);
        setNewAppSettings({ ...appSettings, list: updatedCategories });
    }

    /**
     * handles the abort of settings and resets the state to old value
     */
    function handleAbortSettings() {
        setListCategories(appSettings.list);
        navigate(`/app/${lastPage}`);
    }

    return (
        <div className="profile-wrapper">
            <div className="profile-content">
                <div className="profil-header">
                    <h4 className="profil-title mb-2">Einstellungen</h4>
                    <span>Hier kannst die globalen Einstellungen ändern</span>
                </div>
                <div className="profile-body mt-5">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <h6 className="mb-3">Kategorien für Listen</h6>
                            {listCategories.map((category, index) => {
                                return (
                                    <div key={index} className="settings-list mb-2">
                                        <input
                                            type="text"
                                            id={`category${index}`}
                                            className="form-control"
                                            value={listCategories[index].category}
                                            onChange={(e) => handleListCategoryChange(e.target.value, index, 'category')}
                                            required
                                        />
                                        <input
                                            type="color"
                                            id={`color${index}`}
                                            className="form-control settings-list-color"
                                            value={listCategories[index].color}
                                            onChange={(e) => handleListCategoryChange(e.target.value, index, 'color')}
                                            required
                                        ></input>
                                        {index > 0 ? (
                                            <img
                                                src="/assets/icons/dash-circle.svg"
                                                alt="Löschen"
                                                className="iconClickable delete-icon"
                                                onClick={() => handleDeleteListCategory(index)}
                                            />
                                        ) : (
                                            <div className="delete-icon-invisible"></div>
                                        )}
                                    </div>
                                );
                            })}
                            {listCategories.length < 10 && (
                                <div className="add-list-category mt-3">
                                    <img
                                        src="/assets/icons/plus-circle.svg"
                                        alt="Hinzufügen"
                                        className="iconClickable add-icon"
                                        onClick={handleAddListCategory}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="profile-footer mt-5">
                            <button type="button" className="btn btn-secondary" onClick={handleAbortSettings}>
                                Abbrechen
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Speichern
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
