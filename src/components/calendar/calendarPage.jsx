import { Calendar, luxonLocalizer } from 'react-big-calendar';
import { DateTime } from 'luxon';
import { useMemo, useEffect } from 'react';
import { useCalendar } from '../../contexts/calendarContext';
import CalendarToolbar from './calendarToolbar';
import CalendarEvent from './calendarEvent';
import Spinner from '../global/spinner';
import CalendarPageToolbar from './calendarPageToolbar';
import DialogNewMeeting from './dialogNewMeeting';
import DialogEditMeeting from './dialogEditMeeting';

export default function CalendarPage() {
    const { isLoaded, events, loadEvents, onSelectEvent } = useCalendar();
    const { localizer } = useMemo(() => ({ localizer: luxonLocalizer(DateTime, { firstDayOfWeek: 1 }) }), []);
    const { min, max, messages, formats, components } = useMemo(
        () => ({
            min: new Date(2023, 0, 1, 8, 0, 0),
            max: new Date(2023, 0, 1, 20, 0, 0),
            messages: {
                date: 'Datum',
                time: 'Uhrzeit',
                event: 'Termin',
                week: 'Woche',
                work_week: 'Arbeitswoche',
                day: 'Tag',
                month: 'Monat',
                previous: 'zurück',
                next: 'vor',
                today: `heute`,
                agenda: 'Übersicht',
                allDay: 'ganztägig',
                noEventsInRange: 'Keine Termine in diesem Zeitraum.',
                showMore: (total) => `+${total} mehr`,
            },
            formats: {
                //month view
                dateFormat: (date, culture, localizer) => localizer.format(date, 'd', culture),
                weekdayFormat: (date, culture, localizer) => localizer.format(date, 'ccc', culture),

                //week view
                dayFormat: (date, culture, localizer) => localizer.format(date, 'ccc', culture),
                dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
                    'Woche ' +
                    localizer.format(start, 'WW', culture) +
                    ' | ' +
                    localizer.format(start, 'dd.MM.yyyy', culture) +
                    ' - ' +
                    localizer.format(end, 'dd.MM.yyyy', culture),

                //agenda view
                agendaDateFormat: (date, culture, localizer) => localizer.format(date, 'ccc, dd.MM.yyyy', culture),
                agendaHeaderFormat: ({ start, end }, culture, localizer) =>
                    localizer.format(start, 'dd.MM.yyyy', culture) + ' - ' + localizer.format(end, 'dd.MM.yyyy', culture),
            },
            components: {
                toolbar: CalendarToolbar,
                event: CalendarEvent,
            },
        }),
        []
    );

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
                        defaultView="week"
                        views={['agenda', 'week', 'month']}
                        formats={formats}
                        components={components}
                        startAccessor="start"
                        endAccessor="end"
                        min={min}
                        max={max}
                        events={events}
                        onSelectEvent={onSelectEvent}
                    />
                )}
            </div>
        </>
    );
}
