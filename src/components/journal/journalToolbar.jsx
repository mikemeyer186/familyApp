import years from '../../data/years';
import months from '../../data/months';

export default function JournalToolbar({ year, month, setYear, setMonth }) {
    const defaultYears = years;
    const defaultMonths = months;
    const convertedMonth = months[month - 1];

    function handleChangeMonth(month) {
        month = months.indexOf(month) + 1;
        if (month < 10) {
            month = `0${month}`;
        }
        setMonth(month);
    }

    return (
        <>
            <button type="button" className="btn btn-secondary newData-button" data-bs-toggle="modal" data-bs-target="#newJournalData">
                <span>Neuer Beleg</span>
                <img src="/assets/icons/file-earmark-plus-fill.svg" alt="New data" />
            </button>

            <div className="form-input-group">
                <div className="input-group">
                    <button
                        className="btn dropdown-toggle btn-outline-secondary thinBorder width80"
                        id="date"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        {year}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-journal">
                        {defaultYears.map((year) => {
                            return (
                                <li key={year} onClick={() => setYear(year)}>
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
