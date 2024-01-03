import { useCalendar } from '../../contexts/calendarContext';

export default function DialogDeleteMeeting() {
    const { meetingID, deleteMeeting } = useCalendar();

    /**
     * deletes meeting from calendar
     */
    function handleDeleteMeeting() {
        deleteMeeting(meetingID);
    }

    return (
        <div className="modal fade" id="deleteMeetingModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Termin löschen</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">Möchtest du den Termin wirklich löschen?</div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                            Abbrechen
                        </button>
                        <button type="button" className="btn btn-danger" onClick={handleDeleteMeeting} data-bs-dismiss="modal">
                            Termin löschen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
