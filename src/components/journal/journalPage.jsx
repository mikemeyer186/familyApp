import { useEffect, useState } from 'react';
import { addPaymentInFirestore, loadJournalFromFirestore } from '../../services/firestore';
import DialogNewData from './dialogNewData';
import JournalToolbar from './journalToolbar';
import Spinner from '../global/spinner';

export default function JournalPage() {
    const [journal, setJournal] = useState([]);
    const [activeJournal, setActiveJournal] = useState([]);
    const [year, setYear] = useState();
    const [month, setMonth] = useState();
    const [isLoaded, setIsLoaded] = useState(false);

    async function loadJournal() {
        const journal = await loadJournalFromFirestore();
        setJournal(journal);
    }

    async function addNewPayment(newPayment, journalId) {
        setActiveJournal((currentJournal) => {
            const journal = [...currentJournal, newPayment];
            addPaymentInFirestore(journal, journalId);
            return journal;
        });
    }

    useEffect(() => {
        const date = new Date();
        setYear(date.getFullYear());
        setMonth(date.getMonth() + 1);
    }, []);

    useEffect(() => {
        loadJournal().then(() => {
            setIsLoaded(true);
        });
    }, []);

    useEffect(() => {
        const filteredJournal = journal.filter((journal) => journal.id === `${year}-${month}`);
        setActiveJournal(filteredJournal);
    }, [journal, month, year]);

    return (
        <>
            <DialogNewData addNewPayment={addNewPayment} />

            <div className="journalPage-wrapper">
                <div className="journalToolbar">
                    <JournalToolbar />
                </div>

                {!isLoaded ? <Spinner>{'Journal laden...'}</Spinner> : <div className="journal-payments"></div>}
            </div>
        </>
    );
}
