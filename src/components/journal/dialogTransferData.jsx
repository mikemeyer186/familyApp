import { useState } from 'react';
import { useDialog } from '../../contexts/dialogContext';
import { useJournal } from '../../contexts/journalContext';
import { useUser } from '../../contexts/userContext';
import months from '../../data/months';

export default function DialogTransferData() {
    const date = new Date();
    const { dialogs, closeDialog } = useDialog();
    const { journals, selectedJournalId, addMultiplePayments } = useJournal();
    const { activeUser, activeYears } = useUser();
    const [selectedYear, setSelectedYear] = useState(date.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(date.getMonth() + 1 < 10 && '0' + (date.getMonth() + 1));
    const selectedFixedCostsId = `${selectedYear}-${selectedMonth}`;
    const filteredFixedCosts = setJournalData(selectedFixedCostsId);
    const defaultYears = activeYears;
    const defaultMonths = months;
    const convertedMonth = months[selectedMonth - 1];

    /**
     * handles the transfer of fixed costs to actual selected month
     */
    function handleTransferData() {
        let transferCosts = [];

        filteredFixedCosts.map((fixedCosts) => {
            fixedCosts = {
                ...fixedCosts,
                date: new Date().toISOString(),
                id: crypto.randomUUID(),
                month: date.getMonth() + 1 < 10 && '0' + (date.getMonth() + 1),
                user: activeUser.displayName,
                year: date.getFullYear(),
            };
            transferCosts = [...transferCosts, fixedCosts];
        });
        addMultiplePayments(transferCosts);
        closeDialog('journalTransferRef');
    }

    /**
     * closes dialog
     */
    function handleCloseDialog() {
        closeDialog('journalTransferRef');
    }

    /**
     * filters the journals regarding the selected month and year
     * @returns - active journal of selected month and year
     */
    function setJournalData(selectedJournalId) {
        const filteredJournals = journals.filter((journal) => journal.id === selectedJournalId);

        if (filteredJournals.length > 0) {
            const filteredPayments = filteredJournals[0].payment;
            const fixedCosts = filteredPayments.filter((payment) => payment.aggregate === 'Fixkosten');
            const sortedFixedCosts = fixedCosts.sort((a, b) => a.category.localeCompare(b.category));
            return sortedFixedCosts;
        } else {
            return [];
        }
    }

    /**
     * handles change of the month
     * sets slected month to number of month with leading zero
     * @param {string} month - month from dropdown
     */
    function handleChangeMonth(month) {
        month = months.indexOf(month) + 1;
        if (month < 10) {
            month = `0${month}`;
        }
        setSelectedMonth(month);
    }

    return (
        <div className="modal fade" id="journalTransferRef" tabIndex="-1" aria-hidden="true" ref={dialogs.journalTransferRef}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Fixkosten übertragen</h1>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDialog}></button>
                    </div>
                    <div className="modal-body">
                        <p>
                            Wähle aus, von welchem Monat du die Fixkosten übernehmen möchtest. Die hier angezeigten Fixkosten werden in den aktuell
                            ausgewählten Monat im Haushaltsbuch übertragen und können dann angepasst werden.
                        </p>
                        <div className="fixed-costs-wrapper">
                            <div className="form-input-group">
                                <div className="input-group">
                                    <button
                                        className="btn dropdown-toggle btn-outline-primary thin-border width-80"
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
                                                <li key={year} onClick={() => setSelectedYear(year)}>
                                                    <span className="dropdown-item pointer">{year}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    <button
                                        className="btn dropdown-toggle btn-outline-primary thin-border width-130"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {convertedMonth}
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-journal">
                                        {defaultMonths.map((monthSelection) => {
                                            return (
                                                <li key={monthSelection} onClick={() => handleChangeMonth(monthSelection)}>
                                                    <span className="dropdown-item pointer">{monthSelection}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                            <div className="fixed-costs-table">
                                {filteredFixedCosts.map((fixedCosts) => {
                                    return (
                                        <div className="fixed-costs" key={fixedCosts.id}>
                                            <span>{fixedCosts.category}</span>
                                            <span>
                                                {fixedCosts.amount.toLocaleString('de-DE', {
                                                    style: 'currency',
                                                    currency: 'EUR',
                                                })}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            {filteredFixedCosts.length === 0 && (
                                <span className="fixed-costs-empty">Noch keine Fixkosten in diesem Monat gebucht</span>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCloseDialog}>
                            Abbrechen
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleTransferData}
                            disabled={selectedJournalId === selectedFixedCostsId || filteredFixedCosts.length === 0}
                        >
                            Kopieren
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
