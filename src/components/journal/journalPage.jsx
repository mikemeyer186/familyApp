import { useJournal } from '../../contexts/journalContext';
import Spinner from '../global/spinner';
import JournalContent from './journalContent';

export default function JournalPage() {
    const { isJournalLoaded } = useJournal();

    return <div className="journal-page-wrapper">{!isJournalLoaded ? <Spinner>{'Journal laden...'}</Spinner> : <JournalContent />}</div>;
}
