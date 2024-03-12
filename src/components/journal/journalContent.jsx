import JournalToolbar from './journalToolbar';
import JournalTable from './journalTable';
import JournalSum from './journalSum';
import JournalChart from './journalChart';

export default function JournalContent() {
    return (
        <>
            <div className="journal-toolbar">
                <JournalToolbar />
            </div>
            <JournalChart />
            <div className="journal-page-row">
                <JournalSum />
                <JournalTable />
            </div>
        </>
    );
}
