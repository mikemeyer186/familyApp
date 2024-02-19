import { useJournal } from '../../contexts/journalContext';
import months from '../../data/months';

export default function JournalTile({ journalBalances, navigateToPage }) {
    const { selectedMonth, selectedYear, activePayment } = useJournal();
    const actualBalance = journalBalances.balances[journalBalances.balances.length - 1];
    const actualMonth = months[Number(selectedMonth) - 1];

    return (
        <>
            <div className="dashboard-tile tile-journal tile-small" onClick={() => navigateToPage('/app/journal?page=Journal')}>
                <h6>Finanzen</h6>
                <img src="/assets/img/journal.webp" alt="Journal" />
                <div className="tile-small-content">
                    <span className="small-content-header">
                        {actualMonth} {selectedYear}
                    </span>
                    <div className="journal-small-content">
                        {journalBalances.dates.length > 0 ? (
                            <>
                                <div>
                                    <span>Kontostand: </span>
                                    <span className={`tile-title-balance ${actualBalance >= 0 ? 'income' : 'spend'}`}>
                                        {actualBalance.toLocaleString('de-DE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        })}
                                    </span>
                                </div>
                                <div>
                                    <span>Belege gebucht: </span>
                                    <span className="journal-small-content-number">{activePayment ? activePayment.length : 0}</span>
                                </div>
                            </>
                        ) : (
                            <div className="tile-empty-text">Noch keine Belege in diesem Monat gebucht</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
