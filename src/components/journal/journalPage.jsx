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
                            activeJournal.payment.map((payment) => (
                                <li key={payment.date} className="journal-payment">
                                    <div className="journal-payment__date">{payment.date}</div>
                                    <div className="journal-payment__name">{payment.category}</div>
                                    <div className="journal-payment__amount">{payment.amount}</div>
                                    <div className="journal-payment__description">{payment.info}</div>
                                </li>
                            ))
                        ) : (
                            <div className="journal-payment__date">Noch keine Daten vorhanden</div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
