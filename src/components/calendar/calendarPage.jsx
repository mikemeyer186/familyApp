import { Calendar } from 'react-big-calendar';
import { useEffect } from 'react';
import { useCalendar } from '../../contexts/calendarContext';
import CalendarConfig from '../../config/rbc';
import Spinner from '../global/spinner';
import CalendarPageToolbar from './calendarPageToolbar';
import DialogNewMeeting from './dialogNewMeeting';
import DialogEditMeeting from './dialogEditMeeting';

export default function CalendarPage() {
    const { isLoaded, events, loadEvents, onSelectEvent, onSelectTimeSlot, getDrilldownView } = useCalendar();
    const { localizer, messages, formats, components, min, max } = CalendarConfig();

    /**
     * loads all events for the calendar on first render
     */
    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    return (
        <>
            <DialogNewMeeting />
            <DialogEditMeeting />

            <div className="calendarPage-wrapper">
                <div className="calendarToolbar">
                    <CalendarPageToolbar />
                </div>

                {!isLoaded ? (
                    <Spinner>{'Kalender laden...'}</Spinner>
                ) : (
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
                        longPressThreshold={10}
                        onSelectEvent={onSelectEvent}
                        onSelectSlot={onSelectTimeSlot}
                        selectable
                    />
                )}
            </div>
        </>
    );
}
