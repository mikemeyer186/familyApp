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
            <div className="journal-page-wrapper">
                <div className="journal-toolbar">
                    <JournalToolbar />
                </div>

                {!isJournalLoaded ? (
                    <Spinner>{'Journal laden...'}</Spinner>
                ) : (
                    <>
                        <JournalChart />
                        <div className="journal-page-row">
                            <JournalSum />
                            <JournalTable />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
