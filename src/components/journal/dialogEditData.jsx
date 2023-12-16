import { useEffect, useState } from 'react';
import { useUser } from '../../contexts/userContext';
import { useJournal } from '../../contexts/journalContext';
import { useAlert } from '../../contexts/alertContext';
import years from '../../data/years';
import months from '../../data/months';
import spendCategories from '../../data/spendCategories';
import incomeCategories from '../../data/incomeCategories';
import CurrencyInput from 'react-currency-input-field';

export default function DialogEditData({ data, setExpandedRows }) {
    const { activeJournal, journals, activePayment, editPayment, addEditedPayment, setActivePayment, setNewActivePayment, deletePayment } =
        useJournal();
    const { activeUser } = useUser();
    const { setSuccess } = useAlert();
    const [selectedYear, setSelectedYear] = useState(data.year);
    const [selectedMonth, setSelectedMonth] = useState(data.month);
    const [amount, setAmount] = useState(convertAmountOnLoad(data.amount));
    const [selectedFlow, setSelectedFlow] = useState(data.flow);
    const [selectedCategory, setSelectedCategory] = useState(data.category);
    const [selectedAggregate, setSelectedAggregate] = useState(data.aggregate);
    const [info, setInfo] = useState(data.info);
    const [newJournalId, setNewJournalId] = useState('');
    const defaultYears = years;
    const defaultMonths = months;
    const convertedMonth = months[selectedMonth - 1];
    const defaultFlows = ['Einnahme', 'Ausgabe'];
    const defaultCategories = selectedFlow === 'Einnahme' ? incomeCategories : spendCategories;

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
            id: data.id,
        };
    }

    /**
     * handles the submitting of the edited payment
     * @param {event} e - default event
     */
    function handleEditData(e) {
        e.preventDefault();
        checkNewMonthOrYear();
    }

    /**
     * checks if the payment is moved to a new month or year
     * if yes, the payment is added to the new month and deleted from the old month
     * if no, the payment is edited in the current month
     */
    function checkNewMonthOrYear() {
        const editedPayment = changedPayment();

        if (selectedYear !== data.year || selectedMonth !== data.month) {
            addEditedPayment(editedPayment, newJournalId);
            deletePayment(data);
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
        deletePayment(data);
        setExpandedRows(null);
        setSuccess('Der Beleg wurde erfolgreich gelöscht!');
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
        let convertedAmount = amount.replace('-', '');
        return convertedAmount;
    }

    /**
     * handles the selection of the year
     * @param {string} year - selected year in the form
     */
    function handleYearSelection(year) {
        setSelectedYear(year);
    }

    /**
     * handles the selection of the month and sets the new journal id
     * @param {string} monthName - selected month in the form
     */
    function handleMonthSelection(monthName) {
        let month = months.indexOf(monthName) + 1;
        if (month < 10) {
            month = `0${month}`;
        }
        const year = selectedYear;
        setNewJournalId(`${year}-${month}`);
        setSelectedMonth(month);
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
     */
    useEffect(() => {
        let month = months.indexOf(convertedMonth) + 1;
        if (month < 10) {
            month = `0${month}`;
        }
        const year = selectedYear;
        setNewJournalId(`${year}-${month}`);
    }, [selectedYear, convertedMonth]);

    /**
     * sets the active payment on initial laoding of the modal
     */
    useEffect(() => {
        const filteredJournals = journals.filter((journal) => journal.id === activeJournal.id);
        if (filteredJournals.length > 0) {
            const filteredPayment = filteredJournals[0].payment;
            setActivePayment(filteredPayment);
        } else {
            setActivePayment([]);
        }
    }, [activeJournal, journals, setActivePayment]);

    /**
     * sets the new active payment on changing the month or year (to transfer the payment to the new month)
     */
    useEffect(() => {
        const filteredJournals = journals.filter((journal) => journal.id === newJournalId);
        if (filteredJournals.length > 0) {
            const filteredPayment = filteredJournals[0].payment;
            setNewActivePayment(filteredPayment);
        } else {
            setNewActivePayment([]);
        }
    }, [selectedYear, selectedMonth, journals, newJournalId, setNewActivePayment]);

    return (
        <div className="modal fade" id="editJournalData" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Beleg ändern</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleEditData}>
                            <div className="form-input-group">
                                <div className="form-row">
                                    <div className="widthFull">
                                        <label htmlFor="editDate" className="col-form-label">
                                            Monat
                                        </label>
                                        <div className="input-group mb-3">
                                            <button
                                                className="btn dropdown-toggle btn-outline-secondary thinBorder width80"
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
                                                className="btn dropdown-toggle btn-outline-secondary thinBorder width130"
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
                                    <div className="widthFull">
                                        <label htmlFor="editFlow" className="col-form-label">
                                            Art
                                        </label>
                                        <div className="input-group mb-3 flex-column">
                                            <button
                                                className="btn dropdown-toggle btn-outline-secondary thinBorder width130"
                                                style={selectedFlow === 'Einnahme' ? { color: '#9dde9d' } : { color: '#ff9f9f' }}
                                                id="editFlow"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {selectedFlow}
                                            </button>
                                            <ul className="dropdown-menu">
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
                                    <div className="widthFull">
                                        <label htmlFor="editCategorie" className="col-form-label">
                                            Kategorie
                                        </label>
                                        <div className="input-group mb-3 flex-column">
                                            <button
                                                className="btn dropdown-toggle btn-outline-secondary thinBorder width210"
                                                id="editCategorie"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                {selectedCategory}
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
                                    <div className="widthFull">
                                        <div className="mb-3">
                                            <label htmlFor="editAmount" className="col-form-label">
                                                Betrag
                                            </label>
                                            <CurrencyInput
                                                id="editAmount"
                                                className="form-control width130"
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
                                    <div className="widthFull">
                                        <label htmlFor="editInfo" className="col-form-label">
                                            Kommentar
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="editInfo"
                                            placeholder="Zusätzliche Info zum Beleg"
                                            value={info}
                                            onChange={(e) => setInfo(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="countBadge">
                                <span>Belege:</span>
                                <div className="badge text-bg-light">{activePayment.length}</div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDeletePayment}>
                                    Löschen
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    data-bs-dismiss="modal"
                                    disabled={selectedCategory === 'Auswählen...'}
                                >
                                    Ändern
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
