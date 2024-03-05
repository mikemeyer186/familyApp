import { useCalendar } from '../../contexts/calendarContext';
import { useDialog } from '../../contexts/dialogContext';

export default function DialogDeleteMeeting() {
    const { meetingID, deleteMeeting } = useCalendar();
    const { dialogs, closeDialog } = useDialog();

    /**
     * deletes meeting from calendar
     */
    function handleDeleteMeeting() {
        deleteMeeting(meetingID);
        handleCloseDialog();
    }

    /**
     * closes dialog
     */
    function handleCloseDialog() {
        closeDialog('calendarDeleteRef');
    }

    return (
        <div className="modal fade" id="calendarDeleteRef" tabIndex="-1" aria-hidden="true" ref={dialogs.calendarDeleteRef}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Termin löschen</h1>
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDialog}></button>
                    </div>
                    <div className="modal-body">Möchtest du den Termin wirklich löschen?</div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCloseDialog}>
                            Abbrechen
                        </button>
                        <button type="button" className="btn btn-danger" onClick={handleDeleteMeeting}>
                            Löschen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
