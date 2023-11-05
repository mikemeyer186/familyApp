import { useEffect, useState } from 'react';
import { addPaymentInFirestore } from '../../services/firestore';
import years from '../../data/years';
import months from '../../data/months';
import spendCategories from '../../data/spendCategories';
import incomeCategories from '../../data/incomeCategories';
import CurrencyInput from 'react-currency-input-field';

export default function DialogNewData({ loadJournals, journals, activeUser }) {
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedFlow, setSelectedFlow] = useState('Ausgabe');
    const [selectedCategory, setSelectedCategory] = useState('Auswählen...');
    const [selectedAggregate, setSelectedAggregate] = useState('');
    const [info, setInfo] = useState('');
    const [selectedJournalId, setSelectedJournalId] = useState('');
    const [activePayment, setActivePayment] = useState([]);
    const defaultYears = years;
    const defaultMonths = months;
    const defaultFlows = ['Einnahme', 'Ausgabe'];
    const defaultCategories = selectedFlow === 'Einnahme' ? incomeCategories : spendCategories;

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
            },
            selectedJournalId
        );
        setAmount('');
        setInfo('');
    }

    async function addNewPayment(newPayment, journalId) {
        setActivePayment(async (currentPayment) => {
            const payment = [newPayment, ...currentPayment];
            await addPaymentInFirestore(payment, journalId);
            return payment;
        });
        await loadJournals();
    }

    function convertAmount(amount) {
        let convertedAmount = parseFloat(amount.replace(',', '.'));

        if (selectedFlow === 'Ausgabe') {
            convertedAmount = convertedAmount * -1;
        }

        return convertedAmount;
    }

    function handleAbort() {
        setAmount('');
        setInfo('');
    }

    function handleYearSelection(year) {
        setSelectedYear(year);
    }

    function handleMonthSelection(month) {
        setSelectedMonth(month);
    }

    function handleFlowSelection(flow) {
        setSelectedFlow(flow);
        setSelectedCategory('Auswählen...');
    }

    function handleCategorieSelection(categorie, aggregate) {
        setSelectedCategory(categorie);
        setSelectedAggregate(aggregate);
    }

    useEffect(() => {
        const year = new Date().getFullYear();
        const month = new Date().toLocaleString('de-DE', { month: 'long' });
        setSelectedYear(year);
        setSelectedMonth(month);
    }, []);

    useEffect(() => {
        let month = months.indexOf(selectedMonth) + 1;
        if (month < 10) {
            month = `0${month}`;
        }
        const year = selectedYear;
        setSelectedJournalId(`${year}-${month}`);
    }, [selectedYear, selectedMonth]);

    useEffect(() => {
        const filteredJournals = journals.filter((journal) => journal.id === selectedJournalId);
        if (filteredJournals.length > 0) {
            const filteredPayment = filteredJournals[0].payment;
            setActivePayment(filteredPayment);
        } else {
            setActivePayment([]);
        }
    }, [selectedYear, selectedMonth, journals, selectedJournalId]);

    return (
        <div className="modal fade" id="newJournalData" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Neuen Beleg eingeben</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                                                {selectedMonth}
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
                                <div className="badge text-bg-light">{activePayment.length}</div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleAbort}>
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
