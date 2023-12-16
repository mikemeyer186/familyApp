import { useEffect } from 'react';
import { useJournal } from '../../contexts/journalContext';
import { db } from '../../config/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import DialogNewData from './dialogNewData';
import JournalToolbar from './journalToolbar';
import Spinner from '../global/spinner';
import JournalTable from './journalTable';
import JournalSum from './journalSum';

export default function JournalPage() {
    const { isLoaded, setJournals, loadJournals } = useJournal();

    /**
     * loads the journals from firestore
     */
    useEffect(() => {
        loadJournals();
    }, [loadJournals]);

    /**
     * observable for journals from firebase
     */
    useEffect(() => {
        const q = query(collection(db, 'journal'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newJournal = querySnapshot.docs.map((doc) => doc.data());
            setJournals(newJournal);
        });

        return () => {
            unsubscribe();
        };
    }, [setJournals]);

    return (
        <>
            <DialogNewData />

            <div className="journalPage-wrapper">
                <div className="journalToolbar">
                    <JournalToolbar />
                </div>

                {!isLoaded ? (
                    <Spinner>{'Journal laden...'}</Spinner>
                ) : (
                    <>
                        <JournalSum />
                        <JournalTable />
                    </>
                )}
            </div>
        </>
    );
}
