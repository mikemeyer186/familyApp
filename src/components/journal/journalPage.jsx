import { useEffect, useState } from 'react';
import { loadJournalFromFirestore } from '../../services/firestore';
import DialogNewData from './dialogNewData';
import JournalToolbar from './journalToolbar';
import Spinner from '../global/spinner';

export default function JournalPage() {
    const date = new Date();
    const [journals, setJournals] = useState([]);
    const [activeJournal, setActiveJournal] = useState({});
    const [year, setYear] = useState(date.getFullYear());
    const [month, setMonth] = useState(date.getMonth() + 1);
    const [isLoaded, setIsLoaded] = useState(false);

    async function loadJournals() {
        const journal = await loadJournalFromFirestore();
        setJournals(journal);
    }

    useEffect(() => {
        loadJournals();
    }, []);

    useEffect(() => {
        const filteredJournals = journals.filter((journal) => journal.id === `${year}-${month}`);
        const filteredJournal = filteredJournals[0];
        setActiveJournal(filteredJournal);
        setTimeout(() => {
            setIsLoaded(true);
        }, 1000);
    }, [journals, month, year]);

    return (
        <>
            <DialogNewData loadJournals={loadJournals} journals={journals} />

            <div className="journalPage-wrapper">
                <div className="journalToolbar">
                    <JournalToolbar year={year} month={month} setYear={setYear} setMonth={setMonth} />
                </div>

                {!isLoaded ? (
                    <Spinner>{'Journal laden...'}</Spinner>
                ) : (
                    <div className="journal-payments">
                        {activeJournal ? (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Datum</th>
                                        <th scope="col">Kategorie</th>
                                        <th className="amount-header" scope="col">
                                            Betrag
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    {activeJournal.payment.map((payment) => (
                                        <tr key={payment.date}>
                                            <th scope="row">
                                                {new Date(payment.date).toLocaleDateString('de-DE', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })}
                                            </th>
                                            <td>{payment.category}</td>
                                            <td className={`payment-amount ${payment.flow === 'Ausgabe' ? 'spend' : 'income'}`}>
                                                {payment.flow === 'Ausgabe'
                                                    ? '- ' + payment.amount.toFixed(2).replace('.', ',')
                                                    : '+ ' + payment.amount.toFixed(2).replace('.', ',')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="journal-payment__date">Noch keine Daten vorhanden</div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
