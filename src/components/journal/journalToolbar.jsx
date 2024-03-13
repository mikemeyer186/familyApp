import { useJournal } from '../../contexts/journalContext';
import { useDialog } from '../../contexts/dialogContext';
import { useUser } from '../../contexts/userContext';
import months from '../../data/months';

export default function JournalToolbar() {
    const { selectedYear, selectedMonth, setSelectedYear, setSelectedMonth } = useJournal();
    const { activeYears } = useUser();
    const { openDialog } = useDialog();
    const defaultYears = activeYears;
    const defaultMonths = months;
    const convertedMonth = months[selectedMonth - 1];

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
        <>
            <button type="button" className="btn btn-primary new-data-button" onClick={() => openDialog('journalNewRef')}>
                <span>Neuer Beleg</span>
                <img src="/assets/icons/file-earmark-plus-fill.svg" alt="New data" />
            </button>

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
        </>
    );
}
