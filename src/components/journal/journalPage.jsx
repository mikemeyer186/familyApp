import { useJournal } from '../../contexts/journalContext';
import JournalToolbar from './journalToolbar';
import Spinner from '../global/spinner';
import JournalTable from './journalTable';
import JournalSum from './journalSum';
import JournalChart from './journalChart';

export default function JournalPage() {
    const { isJournalLoaded } = useJournal();

    return (
        <>
            <div className="journalPage-wrapper">
                <div className="journal-toolbar">
                    <JournalToolbar />
                </div>

                {!isJournalLoaded ? (
                    <Spinner>{'Journal laden...'}</Spinner>
                ) : (
                    <>
                        <JournalChart />
                        <JournalSum />
                        <JournalTable />
                    </>
                )}
            </div>
        </>
    );
}
