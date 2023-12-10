export default function CalendarPageToolbar() {
    return (
        <>
            <button type="button" className="btn btn-secondary newMeeting-button" data-bs-toggle="modal" data-bs-target="#newMeetingModal">
                <span>Neuer Termin</span>
                <img src="/assets/icons/calendar_edit.svg" alt="New meeting" />
            </button>
        </>
    );
}
