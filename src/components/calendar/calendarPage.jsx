import { useCalendar } from '../../contexts/calendarContext';
import Spinner from '../global/spinner';
import CalendarContent from './calendarContent';

export default function CalendarPage() {
    const { isCalendarLoaded } = useCalendar();

    return <div className="calendar-page-wrapper">{!isCalendarLoaded ? <Spinner>{'Kalender laden...'}</Spinner> : <CalendarContent />}</div>;
}
