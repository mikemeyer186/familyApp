import { useMemo, useState } from 'react';
import { useUser } from '../../contexts/userContext';
import { useJournal } from '../../contexts/journalContext';
import { useAlert } from '../../contexts/alertContext';
import { useDialog } from '../../contexts/dialogContext';
import months from '../../data/months';
import CurrencyInput from 'react-currency-input-field';

export default function DialogEditData() {
    const {
        activeJournal,
        journals,
        activePayment,
        editPayment,
        addEditedPayment,
        setNewActivePayment,
        deletePayment,
        expansionData,
        setExpandedRows,
    } = useJournal();
    const { activeUser, appSettings, activeYears } = useUser();
    const { setSuccess } = useAlert();
    const { dialogs, closeDialog, openDialog } = useDialog();
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedFlow, setSelectedFlow] = useState('Ausgabe');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedAggregate, setSelectedAggregate] = useState('');
    const [info, setInfo] = useState('');
    const [badgeNumber, setBadgeNumber] = useState(activePayment.length);
    const defaultYears = activeYears;
    const defaultMonths = months;
    const defaultFlows = ['Einnahme', 'Ausgabe'];
    const defaultCategories = filterCategories();
    const convertedMonth = months[selectedMonth - 1];
    const newJournalId = setNewJournalId(selectedMonth, selectedYear);

    /**
     * filters the journal categories from appsettings
     * @returns - filtered categories by slected flow (income or output)
     */
    function filterCategories() {
        if (selectedFlow === 'Einnahme') {
            const categories = appSettings.journal.filter((category) => category.name === 'Einnahmen');
            return categories;
        } else if (selectedFlow === 'Ausgabe') {
            const categories = appSettings.journal.filter((category) => category.name !== 'Einnahmen');
            return categories;
        }
    }

    /**
     * returns editedPayment as an object
     * @returns {object} - editedPayment
     */
    function changedPayment() {
        return {
            year: selectedYear,
            month: selectedMonth,
            date: new Date().toISOString(),
            flow: selectedFlow,
            category: selectedCategory,
            aggregate: selectedAggregate,
            amount: convertAmountOnSave(amount),
            info: info ? info : '',
            user: activeUser.displayName,
            id: expansionData.id,
        };
    }

    /**
     * closes the edit dialog
     */
    function handleCloseDialog() {
        closeDialog('journalEditRef');
    }

    /**
     * handles the submitting of the edited payment
     * @param {event} e - default event
     */
    function handleEditData(e) {
        e.preventDefault();
        checkNewMonthOrYear();
        handleCloseDialog();
    }

    /**
     * checks if the payment is moved to a new month or year
     * if yes, the payment is added to the new month and deleted from the old month
     * if no, the payment is edited in the current month
     */
    function checkNewMonthOrYear() {
        const editedPayment = changedPayment();

        if (selectedYear !== expansionData.year || selectedMonth !== expansionData.month) {
            addEditedPayment(editedPayment, newJournalId);
            deletePayment(expansionData);
            setSuccess('Der Beleg wurde erfolgreich verschoben!');
        } else {
            editPayment(editedPayment, activeJournal.id);
            setSuccess('Der Beleg wurde erfolgreich geändert!');
        }

        setExpandedRows(null);
    }

    /**
     * handles the deleting of the payment
     */
    function handleDeletePayment() {
        handleCloseDialog();
        openDialog('journalDeleteRef');
    }

    /**
     * converts the amount to a floating number on save
     * replaces the comma with a dot
     * spends are converted to negative numbers
     * @param {number} amount - amount of the payment
     * @returns
     */
    function convertAmountOnSave(amount) {
        let convertedAmount = parseFloat(amount.replace(',', '.'));
        if (selectedFlow === 'Ausgabe') {
            convertedAmount = convertedAmount * -1;
        }
        return convertedAmount;
    }

    /**
     * converts the amount to a string without a minus on load
     * @param {number} amount - amount of the payment
     * @returns
     */
    function convertAmountOnLoad(amount) {
        if (amount) {
            let convertedAmount = amount.replace('-', '');
            return convertedAmount;
        }
    }

    /**
     * handles the selection of the year
     * @param {string} year - selected year in the form
     */
    function handleYearSelection(year) {
        setSelectedYear(year);
        setNewPaymentMonth(selectedMonth, year);
    }

    /**
     * handles the selection of the month and sets the new journal id
     * @param {string} monthName - selected month in the form
     */
    function handleMonthSelection(monthName) {
        const monthNumber = months.indexOf(monthName) + 1;
        const monthString = monthNumber.toString().padStart(2, '0');

        setSelectedMonth(monthString);
        setNewPaymentMonth(monthString, selectedYear);
    }

    /**
     * handles the selection of the flow
     * @param {string} flow - cash flow of the payment in the form
     */
    function handleFlowSelection(flow) {
        setSelectedFlow(flow);
        setSelectedCategory('Auswählen...');
    }

    /**
     * handles the selection of the categorie
     * @param {string} categorie - selected categorie in the form
     * @param {string} aggregate - selected aggregate in the form
     */
    function handleCategorieSelection(categorie, aggregate) {
        setSelectedCategory(categorie);
        setSelectedAggregate(aggregate);
    }

    /**
     * sets the new journal id on month or year change
     * @returns - new journal id
     */
    function setNewJournalId(newMonth, newYear) {
        let month = months.indexOf(months[newMonth - 1]) + 1;

        if (month < 10) {
            month = `0${month}`;
        }

        return `${newYear}-${month}`;
    }

    /**
     * sets the new payment array for saving data in new month or year
     * sets the visible badge number
     * @param {string} newMonth - new selected month
     * @param {string} newYear - new selected year
     */
    function setNewPaymentMonth(newMonth, newYear) {
        const newJournalId = setNewJournalId(newMonth, newYear);
        const filteredJournals = journals.filter((journal) => journal.id === newJournalId);
        if (filteredJournals.length > 0) {
            const filteredPayment = filteredJournals[0].payment;
            setNewActivePayment(filteredPayment);
            setBadgeNumber(filteredPayment.length);
        } else {
            setNewActivePayment([]);
            setBadgeNumber(0);
        }
    }

    /**
     * sets modal data when expansion row in table is clicked
     */
    useMemo(
        function updateDialog() {
            setSelectedYear(expansionData.year);
            setSelectedMonth(expansionData.month);
            setAmount(convertAmountOnLoad(expansionData.amount));
            setSelectedFlow(expansionData.flow ? expansionData.flow : 'Ausgabe');
            setSelectedCategory(expansionData.category);
            setSelectedAggregate(expansionData.aggregate);
            setBadgeNumber(activePayment.length);
            if (expansionData.info) {
                setInfo(expansionData.info);
            } else {
                setInfo('');
            }
        },
        [expansionData, activePayment]
    );

    return (
        <div className="modal fade" id="journalEditRef" tabIndex="-1" aria-hidden="true" ref={dialogs.journalEditRef}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Beleg ändern</h1>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDialog}></button>
                    </div>
                    <form onSubmit={handleEditData}>
                        <div className="modal-body">
                            <div className="form-input-group">
                                <div className="form-row">
                                    <div className="width-full">
                                        <label htmlFor="editDate" className="col-form-label">
                                            Monat
                                        </label>
                                        <div className="input-group date-input-group mb-3">
                                            <button
                                                className="btn dropdown-toggle btn-outline-primary thin-border width-80"
                                                id="editDate"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {selectedYear}
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-journal">
                                                {defaultYears.map((year) => {
                                                    return (
                                                        <li key={year} onClick={() => handleYearSelection(year)}>
                                                            <span className="dropdown-item pointer">{year}</span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                            <button
                                                className="btn dropdown-toggle btn-outline-primary thin-border width-130 month-button"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {convertedMonth}
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-journal">
                                                {defaultMonths.map((month) => {
                                                    return (
                                                        <li key={month} onClick={() => handleMonthSelection(month)}>
                                                            <span className="dropdown-item pointer">{month}</span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="width-full">
                                        <label htmlFor="editFlow" className="col-form-label">
                                            Art
                                        </label>
                                        <div className="input-group mb-3 flex-column">
                                            <button
                                                className="btn dropdown-toggle btn-secondary thin-border width-130 flow-drop-down"
                                                style={selectedFlow === 'Einnahme' ? { color: '#9dde9d' } : { color: '#ff9f9f' }}
                                                id="editFlow"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {selectedFlow}
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-journal">
                                                {defaultFlows.map((flow) => {
                                                    return (
                                                        <li key={flow} onClick={() => handleFlowSelection(flow)}>
                                                            <span className="dropdown-item pointer">{flow}</span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="width-full">
                                        <label htmlFor="editCategorie" className="col-form-label">
                                            Kategorie
                                        </label>
                                        <div className="input-group mb-3 flex-column">
                                            <button
                                                className="btn dropdown-toggle btn-outline-primary thin-border width-210 category-drop-down"
                                                id="editCategorie"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                <span>{selectedCategory}</span>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-journal">
                                                {defaultCategories.map((categorie) => {
                                                    return (
                                                        <div key={categorie.name}>
                                                            <span className="dropdown-item subcategory">{categorie.name}</span>
                                                            {categorie.values.map((value) => {
                                                                return (
                                                                    <li key={value} onClick={() => handleCategorieSelection(value, categorie.name)}>
                                                                        <span className="dropdown-item pointer">{value}</span>
                                                                    </li>
                                                                );
                                                            })}
                                                        </div>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="width-full">
                                        <div className="mb-3">
                                            <label htmlFor="editAmount" className="col-form-label">
                                                Betrag
                                            </label>
                                            <CurrencyInput
                                                id="editAmount"
                                                className="form-control width-130 amount-drop-down"
                                                placeholder="0,00 €"
                                                decimalScale={2}
                                                intlConfig={{ locale: 'de-DE', currency: 'EUR' }}
                                                allowNegativeValue={false}
                                                value={amount}
                                                onValueChange={(value) => setAmount(value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row mb-3">
                                    <div className="width-full">
                                        <label htmlFor="editInfo" className="col-form-label">
                                            Kommentar
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="editInfo"
                                            placeholder="Zusätzliche Information"
                                            value={info}
                                            onChange={(e) => setInfo(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="count-badge">
                            <span>Anzahl Belege:</span>
                            <div className="badge text-bg-light ms-1">{badgeNumber}</div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" onClick={handleDeletePayment}>
                                Löschen
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={selectedCategory === 'Auswählen...' || amount === undefined || amount === '' || amount === '0,00'}
                            >
                                Ändern
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
