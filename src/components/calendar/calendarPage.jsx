import { Calendar, luxonLocalizer } from 'react-big-calendar';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import CalendarToolbar from './calendarToolbar';

export default function CalendarPage() {
    const { localizer } = useMemo(() => ({ localizer: luxonLocalizer(DateTime, { firstDayOfWeek: 1 }) }), []);
    const { min, max } = useMemo(
        () => ({
            min: new Date(2023, 0, 1, 8, 0, 0),
            max: new Date(2023, 0, 1, 20, 0, 0),
        }),
        []
    );
    const { messages } = useMemo(
        () => ({
            messages: {
                week: 'Woche',
                work_week: 'Arbeitswoche',
                day: 'Tag',
                month: 'Monat',
                previous: 'zurück',
                next: 'vor',
                today: `heute`,
                agenda: 'Übersicht',
                noEventsInRange: 'Keine Termine in diesem Zeitraum.',

                showMore: (total) => `+${total} plus`,
            },
        }),
        []
    );

    const { formats } = useMemo(
        () => ({
            formats: {
                dayFormat: (date, culture, localizer) => localizer.format(date, 'ccc, dd.', culture),
                dateFormat: (date, culture, localizer) => localizer.format(date, 'd', culture),
                dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
                    localizer.format(start, 'dd.MM.yyyy', culture) + ' - ' + localizer.format(end, 'dd.MM.yyyy', culture),
                agendaDateFormat: (date, culture, localizer) => localizer.format(date, 'ccc, dd.MM.yyyy', culture),
                agendaHeaderFormat: ({ start, end }, culture, localizer) =>
                    localizer.format(start, 'dd.MM.yyyy', culture) + ' - ' + localizer.format(end, 'dd.MM.yyyy', culture),
            },
        }),
        []
    );

    const { components } = useMemo(
        () => ({
            components: {
                toolbar: CalendarToolbar,
            },
        }),
        []
    );

    const events = [
        {
            start: new Date('2023-12-08T10:00:00'),
            end: new Date('2023-12-08T11:00:00'),
            title: 'Meeting',
        },
        {
            start: new Date('2023-12-07T12:00:00'),
            end: new Date('2023-12-07T13:00:00'),
            title: 'Termin',
        },
    ];

    return (
        <>
            <div className="calendarPage-wrapper">
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
                />
            </div>
        </>
    );
}
