import { useJournal } from '../../contexts/journalContext';
import JournalToolbar from './journalToolbar';
import Spinner from '../global/spinner';
import JournalTable from './journalTable';
import JournalSum from './journalSum';

export default function JournalPage() {
    const { isJournalLoaded } = useJournal();

    return (
        <>
            <div className="journalPage-wrapper">
                <div className="journalToolbar">
                    <JournalToolbar />
                </div>

                {!isJournalLoaded ? (
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
