import { useEffect, useState } from 'react';
import { useJournal } from '../../contexts/journalContext';
import { db } from '../../config/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import DialogNewData from './dialogNewData';
import JournalToolbar from './journalToolbar';
import Spinner from '../global/spinner';
import JournalTable from './journalTable';

export default function JournalPage() {
    const date = new Date();
    const { journals, setJournals, loadJournals, setActiveJournal } = useJournal();
    const [year, setYear] = useState(date.getFullYear());
    const [month, setMonth] = useState(date.getMonth() + 1);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadJournals();
    }, []);

    useEffect(() => {
        const filteredJournals = journals.filter((journal) => journal.id === `${year}-${month}`);
        const filteredJournal = filteredJournals[0];
        setActiveJournal(filteredJournal);
        setTimeout(() => {
            setIsLoaded(true);
        }, 500);
    }, [journals, month, year, setActiveJournal]);

    useEffect(() => {
        const q = query(collection(db, 'journal'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newJournal = querySnapshot.docs.map((doc) => doc.data());
            setJournals(newJournal);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <>
            <DialogNewData />

            <div className="journalPage-wrapper">
                <div className="journalToolbar">
                    <JournalToolbar year={year} month={month} setYear={setYear} setMonth={setMonth} />
                </div>

                {!isLoaded ? <Spinner>{'Journal laden...'}</Spinner> : <JournalTable />}
            </div>
        </>
    );
}
