import { useState } from 'react';
import { useUser } from '../../contexts/userContext';
import { useJournal } from '../../contexts/journalContext';
import { useDialog } from '../../contexts/dialogContext';
import CurrencyInput from 'react-currency-input-field';
import months from '../../data/months';

export default function DialogNewData() {
    const { activeUser, appSettings, activeYears } = useUser();
    const { activePayment, selectedJournalId, selectedYear, selectedMonth, setSelectedYear, setSelectedMonth, addNewPayment } = useJournal();
    const { dialogs, closeDialog } = useDialog();
    const [amount, setAmount] = useState('');
    const [selectedFlow, setSelectedFlow] = useState('Ausgabe');
    const [selectedCategory, setSelectedCategory] = useState('Auswählen...');
    const [selectedAggregate, setSelectedAggregate] = useState('');
    const [info, setInfo] = useState('');
    const defaultFlows = ['Einnahme', 'Ausgabe'];
    const defaultCategories = filterCategories();
    const defaultMonths = months;
    const defaultYears = activeYears;
    const convertedMonth = months[selectedMonth - 1];

    /**
     * filters the journal categories from appsettings
     * @returns - filtered categories by slected flow (income or output)
     */
    function filterCategories() {
        if (selectedFlow === 'Einnahme') {
            const categories = appSettings.journal.slice().filter((category) => category.name === 'Einnahmen');
            return categories;
        } else if (selectedFlow === 'Ausgabe') {
            const categories = appSettings.journal.slice().filter((category) => category.name !== 'Einnahmen');
            return categories;
        }
    }

    /**
     * adds a new payment to the journal
     * @param {event} e - event from form submit
     */
    function handleAddNewData(e) {
        e.preventDefault();
        addNewPayment(
            {
                year: selectedYear,
                month: selectedMonth,
                date: new Date().toISOString(),
                flow: selectedFlow,
                category: selectedCategory,
                aggregate: selectedAggregate,
                amount: convertAmount(amount),
                info: info ? info : '',
                user: activeUser.displayName,
                id: crypto.randomUUID(),
            },
            selectedJournalId
        );
        setAmount('');
        setInfo('');
        handleCloseDialog();
    }

    function handleCloseDialog() {
        closeDialog('journalNewRef');
    }

    /**
     * converts the amount to a float value and replaces the comma with a dot
     * if the flow is an expense, the amount will be multiplied by -1
     * @param {number} amount
     * @returns
     */
    function convertAmount(amount) {
        let convertedAmount = parseFloat(amount.replace(',', '.'));

        if (selectedFlow === 'Ausgabe') {
            convertedAmount = convertedAmount * -1;
        }

        return convertedAmount;
    }

    /**
     * sets the amount and info to empty strings on abort
     */
    function handleAbort() {
        setAmount('');
        setInfo('');
        handleCloseDialog();
    }

    /**
     * sets the selected year in journal context
     * @param {number} year - selected year from dropdown
     */
    function handleYearSelection(year) {
        setSelectedYear(year);
    }

    /**
     * converts the month name to a number and sets the selected month in journal context
     * @param {string} monthName - selected month from dropdown
     */
    function handleMonthSelection(monthName) {
        let month = months.indexOf(monthName) + 1;
        if (month < 10) {
            month = `0${month}`;
        }
        setSelectedMonth(month);
    }

    /**
     * sets the selected flow in journal context and resets the selected category
     * @param {string} flow - selected flow from dropdown
     */
    function handleFlowSelection(flow) {
        setSelectedFlow(flow);
        setSelectedCategory('Auswählen...');
    }

    /**
     * sets the selected category and aggregate in journal context
     * @param {string} categorie - selected categorie from dropdown
     * @param {string} aggregate - selected aggregate from dropdown
     */
    function handleCategorieSelection(categorie, aggregate) {
        setSelectedCategory(categorie);
        setSelectedAggregate(aggregate);
    }

    return (
        <div className="modal fade" id="journalNewRef" tabIndex="-1" aria-hidden="true" ref={dialogs.journalNewRef}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Neuen Beleg eingeben</h1>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDialog}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleAddNewData}>
                            <div className="form-input-group">
                                <div className="form-row">
                                    <div className="widthFull">
                                        <label htmlFor="date" className="col-form-label">
                                            Monat
                                        </label>
                                        <div className="input-group mb-3">
                                            <button
                                                className="btn dropdown-toggle btn-outline-secondary thinBorder width80"
                                                id="date"
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
                                        <label htmlFor="flow" className="col-form-label">
                                            Art
                                        </label>
                                        <div className="input-group mb-3 flex-column">
                                            <button
                                                className="btn dropdown-toggle btn-outline-secondary thinBorder width130"
                                                style={selectedFlow === 'Einnahme' ? { color: '#9dde9d' } : { color: '#ff9f9f' }}
                                                id="flow"
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
                                        <label htmlFor="categorie" className="col-form-label">
                                            Kategorie
                                        </label>
                                        <div className="input-group mb-3 flex-column">
                                            <button
                                                className="btn dropdown-toggle btn-outline-secondary thinBorder width210"
                                                id="categorie"
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
                                            <label htmlFor="amount" className="col-form-label">
                                                Betrag
                                            </label>
                                            <CurrencyInput
                                                id="amount"
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
                                        <label htmlFor="info" className="col-form-label">
                                            Kommentar
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="info"
                                            placeholder="Zusätzliche Info zum Beleg"
                                            value={info}
                                            onChange={(e) => setInfo(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="countBadge">
                                <span>Belege:</span>
                                <div className="badge text-bg-light">{activePayment ? activePayment.length : 0}</div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleAbort}>
                                    Abbrechen
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={selectedCategory === 'Auswählen...'}>
                                    Buchen
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
