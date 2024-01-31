import { useNavigate } from 'react-router';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useCallback, useEffect, useState } from 'react';
import { useUser } from '../../contexts/userContext';
import { saveSettingsInFirestore } from '../../services/firestore';
import defaultCountries from '../../data/defaultCountries';

export default function Settings() {
    const { familyID, appSettings } = useUser();
    const [newAppSettings, setNewAppSettings] = useState([]);
    const [listCategories, setListCategories] = useState(JSON.parse(JSON.stringify(appSettings.list)));
    const [journalCategories, setJournalCategories] = useState(JSON.parse(JSON.stringify(appSettings.journal)));
    const [calendarSettings, setCalendarSettings] = useState(JSON.parse(JSON.stringify(appSettings.calendar)));
    const [selectedCountry, setSelectedCountry] = useState('');
    const [lastPage] = useLocalStorage('lastPage');
    const navigate = useNavigate();

    /**
     * handles user data update
     * @param {event} e - event from form submit
     */
    function handleSubmit(e) {
        e.preventDefault();
        saveSettingsInFirestore(familyID, newAppSettings);
        navigate(`/app/${lastPage}`);
    }

    /**
     * updates the newAppSettings object with all updates
     * @param {string} key - key of object (e.g. list or journal)
     * @param {string} updatedValues - new value of category object
     */
    function updateNewAppSettings(key, updatedValues) {
        if (newAppSettings.length === 0) {
            setNewAppSettings({ ...appSettings, [key]: updatedValues });
        } else {
            setNewAppSettings((prevSettings) => ({ ...prevSettings, [key]: updatedValues }));
        }
    }

    /**
     * handles the change of list category name or color
     * @param {string} value - value from input field
     * @param {number} index - index of input
     * @param {string} field - category key (category or color)
     */
    function handleListCategoryChange(value, index, field) {
        let updatedCategories = listCategories.map((category) => ({ ...category }));
        updatedCategories[index][field] = value ?? '';
        setListCategories(updatedCategories);
        updateNewAppSettings('list', updatedCategories);
    }

    /**
     * deletes the category from list categories
     * @param {number} index - index of category
     */
    function handleDeleteListCategory(index) {
        let updatedCategories = listCategories.map((category) => ({ ...category }));
        updatedCategories.splice(index, 1);
        setListCategories(updatedCategories);
        updateNewAppSettings('list', updatedCategories);
    }

    /**
     * adds a new category to list categories
     * with empty text input and default color (can be changed by user)
     */
    function handleAddListCategory() {
        let updatedCategories = listCategories.map((category) => ({ ...category }));
        const newCategory = { category: '', color: getRandomColor() };
        updatedCategories.push(newCategory);
        setListCategories(updatedCategories);
        updateNewAppSettings('list', updatedCategories);
    }

    /**
     * handles the change of journal category name
     * @param {string} value - value from input field
     * @param {number} nameIndex - index of input (name)
     * @param {number} valueIndex - index of input (value)
     */
    function handleJournalCategoryChange(value, nameIndex, valueIndex) {
        let updatedCategories = journalCategories.map((category) => ({ ...category }));
        updatedCategories[nameIndex].values[valueIndex] = value ?? '';
        setJournalCategories(updatedCategories);
        updateNewAppSettings('journal', updatedCategories);
    }

    /**
     * handles the deleting of journal categories
     * @param {number} nameIndex - index of input (name)
     * @param {number} valueIndex - index of input (value)
     */
    function handleDeleteJournalCategory(nameIndex, valueIndex) {
        let updatedCategories = journalCategories.map((category) => ({ ...category }));
        updatedCategories[nameIndex].values.splice(valueIndex, 1);
        setJournalCategories(updatedCategories);
        updateNewAppSettings('journal', updatedCategories);
    }

    /**
     * handles the adding of journal categories
     * @param {number} nameIndex - index of input (name)
     */
    function handleAddJournalCategory(nameIndex) {
        let updatedCategories = journalCategories.map((category) => ({ ...category }));
        const newCategory = '';
        updatedCategories[nameIndex].values.push(newCategory);
        setJournalCategories(updatedCategories);
        updateNewAppSettings('journal', updatedCategories);
    }

    /**
     * gets a random color code
     * @returns - hexadecimal color code as string
     */
    function getRandomColor() {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return `#${randomColor.padStart(6, '0')}`;
    }

    /**
     * handles the change of country for calendar API
     * @param {string} name - kong name of country
     * @param {string} short - ISO code of country
     */
    function handleCountryChange(name, short) {
        let updatedCalendarSettings = calendarSettings;
        updatedCalendarSettings.country = short;
        setCalendarSettings(updatedCalendarSettings);
        setSelectedCountry(name);
        updateNewAppSettings('calendar', updatedCalendarSettings);
    }

    /**
     * returns the full name of the selected country from ISO-Code
     * @returns - long name of country
     */
    const findCountryName = useCallback(
        function findCountryName() {
            let countryObject = defaultCountries.find((country) => country.short === calendarSettings.country);
            setSelectedCountry(countryObject.name);
        },
        [calendarSettings]
    );

    /**
     * chnages the color of holidays
     * @param {string} color - color code
     * @param {*} colorKey - color field in settings (school or public)
     */
    function handleHolidayColorChange(color, colorKey) {
        let updatedCalendarSettings = calendarSettings;
        updatedCalendarSettings[colorKey] = color;
        setCalendarSettings(updatedCalendarSettings);
        updateNewAppSettings('calendar', updatedCalendarSettings);
    }

    /**
     * handles the abort of settings and resets the state to old value
     */
    function handleAbortSettings() {
        setListCategories(JSON.parse(JSON.stringify(appSettings.list)));
        setJournalCategories(JSON.parse(JSON.stringify(appSettings.journal)));
        setCalendarSettings(JSON.parse(JSON.stringify(appSettings.calendar)));
        navigate(`/app/${lastPage}`);
    }

    /**
     * if appSettings changes (observable) then states will be updated
     */
    useEffect(() => {
        if (appSettings) {
            setListCategories(JSON.parse(JSON.stringify(appSettings.list)));
            setJournalCategories(JSON.parse(JSON.stringify(appSettings.journal)));
            setCalendarSettings(JSON.parse(JSON.stringify(appSettings.calendar)));
        }
    }, [appSettings]);

    /**
     * if calendarSettings changes (from appSettings) then the selectedCountry in drop down field will be updated
     */
    useEffect(() => {
        findCountryName();
    }, [calendarSettings, findCountryName]);

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
                            <h6 className="mb-3">Kalendereinstellungen</h6>

                            <label className="mb-2 settings-label" htmlFor="countrySelection">
                                Bundesland für Ferien & Feiertage
                            </label>
                            <button
                                className="btn dropdown-toggle btn-outline-secondary thinBorder widthFull"
                                id="countrySelection"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {selectedCountry}
                            </button>
                            <ul className="dropdown-menu">
                                {defaultCountries.map((country, index) => {
                                    return (
                                        <li key={index} onClick={() => handleCountryChange(country.name, country.short)}>
                                            <span className="dropdown-item pointer">{country.name}</span>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="settings-color-box mt-4">
                                <span className="mb-1 settings-label" htmlFor="schoolHolidayColor">
                                    Schulferien
                                </span>
                                <input
                                    type="color"
                                    id="schoolHolidayColor"
                                    className="form-control settings-list-color me-4"
                                    value={calendarSettings.schoolHolidayColor}
                                    onChange={(e) => handleHolidayColorChange(e.target.value, 'schoolHolidayColor')}
                                    required
                                ></input>

                                <span className="mb-1 settings-label" htmlFor="publicHolidayColor">
                                    Feiertage
                                </span>
                                <input
                                    type="color"
                                    id="publicHolidayColor"
                                    className="form-control settings-list-color"
                                    value={calendarSettings.publicHolidayColor}
                                    onChange={(e) => handleHolidayColorChange(e.target.value, 'publicHolidayColor')}
                                    required
                                ></input>
                            </div>
                        </div>

                        <div className="settings-divider"></div>

                        <div className="mb-3">
                            <h6 className="mb-3">Kategorien für Listeneinträge</h6>
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
                                    <div className="new-category-text">Neue Kategorie hinzufügen</div>
                                    <img
                                        src="/assets/icons/plus-circle.svg"
                                        alt="Hinzufügen"
                                        className="iconClickable add-icon"
                                        onClick={handleAddListCategory}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="settings-divider"></div>

                        <div className="mb-3">
                            <h6 className="mb-3">Kategorien für das Journal</h6>
                            {journalCategories.map((category, nameIndex) => {
                                return (
                                    <div className="settings-box mb-4" key={nameIndex}>
                                        <p className="settings-box-title mb-2">{category.name}</p>
                                        {category.values.map((value, valueIndex) => {
                                            return (
                                                <div key={valueIndex} className="settings-list mb-2">
                                                    <input
                                                        type="text"
                                                        id={`value${nameIndex}${valueIndex}`}
                                                        className="form-control"
                                                        value={journalCategories[nameIndex].values[valueIndex]}
                                                        onChange={(e) => handleJournalCategoryChange(e.target.value, nameIndex, valueIndex)}
                                                        required
                                                    />
                                                    {valueIndex > 0 ? (
                                                        <img
                                                            src="/assets/icons/dash-circle.svg"
                                                            alt="Löschen"
                                                            className="iconClickable delete-icon"
                                                            onClick={() => handleDeleteJournalCategory(nameIndex, valueIndex)}
                                                        />
                                                    ) : (
                                                        <div className="delete-icon-invisible"></div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {journalCategories[nameIndex].values.length < 12 && (
                                            <div className="add-list-category mt-3">
                                                <div className="new-category-text">Neue Kategorie hinzufügen</div>
                                                <img
                                                    src="/assets/icons/plus-circle.svg"
                                                    alt="Hinzufügen"
                                                    className="iconClickable add-icon"
                                                    onClick={() => handleAddJournalCategory(nameIndex)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="settings-divider"></div>

                        <div className="profile-footer mt-5">
                            <button type="button" className="btn btn-secondary" onClick={handleAbortSettings}>
                                Abbrechen
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={newAppSettings.length === 0}>
                                Speichern
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
