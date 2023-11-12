import { useEffect, useState } from 'react';
import { useJournal } from '../../contexts/journalContext';
import DialogNewData from './dialogNewData';
import JournalToolbar from './journalToolbar';
import Spinner from '../global/spinner';
import JournalTable from './journalTable';

export default function JournalPage() {
    const date = new Date();
    const { journals, loadJournals, setActiveJournal } = useJournal();
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
