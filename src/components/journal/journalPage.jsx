import DialogNewData from './dialogNewData';
import JournalToolbar from './journalToolbar';

export default function JournalPage() {
    return (
        <>
            <DialogNewData />
            <div className="journalPage-wrapper">
                <div className="journalToolbar">
                    <JournalToolbar />
                </div>
            </div>
        </>
    );
}
