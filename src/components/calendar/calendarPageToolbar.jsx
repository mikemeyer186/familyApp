import { useDialog } from '../../contexts/dialogContext';

export default function CalendarPageToolbar() {
    const { openDialog } = useDialog();

    return (
        <button type="button" className="btn btn-primary new-meeting-button" onClick={() => openDialog('calendarNewRef')}>
            <span>Neuer Termin</span>
            <img src="/assets/icons/calendar_edit.svg" alt="New meeting" />
        </button>
    );
}
