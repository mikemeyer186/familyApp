import { Calendar } from 'react-big-calendar';
import { useCalendar } from '../../contexts/calendarContext';
import CalendarPageToolbar from './calendarPageToolbar';
import CalendarConfig from '../../config/rbc';

export default function CalendarContent() {
    const { events, onSelectEvent, onSelectTimeSlot, getDrilldownView } = useCalendar();
    const { localizer, messages, formats, components, min, max } = CalendarConfig();

    return (
        <>
            <div className="calendar-toolbar">
                <CalendarPageToolbar />
            </div>
            <Calendar
                localizer={localizer}
                culture={'de-DE'}
                messages={messages}
                defaultView="agenda"
                views={['agenda', 'week', 'month']}
                formats={formats}
                components={components}
                startAccessor="start"
                endAccessor="end"
                min={min}
                max={max}
                length={14}
                events={events}
                dayLayoutAlgorithm={'no-overlap'}
                showAllEvents={false}
                getDrilldownView={getDrilldownView}
                longPressThreshold={100}
                onSelectEvent={onSelectEvent}
                onSelectSlot={onSelectTimeSlot}
                selectable
            />
        </>
    );
}
