import { Calendar, luxonLocalizer } from 'react-big-calendar';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import CalendarToolbar from './calendarToolbar';
import CalendarEvent from './calendarEvent';
import { useEffect } from 'react';

export default function CalendarPage() {
    const url =
        'https://openholidaysapi.org/SchoolHolidays?countryIsoCode=DE&languageIsoCode=DE&validFrom=2023-01-01&validTo=2025-12-31&subdivisionCode=DE-NI';

    async function fetchHolidays() {
        const response = await fetch(url);
        const holidays = await response.json();
        console.log(holidays);
    }

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
                noEventsInRange: 'Keine Termine in diesem Zeitraum.',

                showMore: (total) => `+${total} mehr`,
            },
            formats: {
                dayFormat: (date, culture, localizer) => localizer.format(date, 'ccc', culture),
                dateFormat: (date, culture, localizer) => localizer.format(date, 'd', culture),
                dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
                    'Woche ' +
                    localizer.format(start, 'WW', culture) +
                    ' | ' +
                    localizer.format(start, 'dd.MM.yyyy', culture) +
                    ' - ' +
                    localizer.format(end, 'dd.MM.yyyy', culture),
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

    const events = [
        {
            start: new Date('2023-12-08T10:00:00'),
            end: new Date('2023-12-08T11:00:00'),
            title: 'Meeting mit Max Mustermann',
            data: {
                color: '#86d8d5',
            },
        },
        {
            start: new Date('2023-12-08T12:00:00'),
            end: new Date('2023-12-08T13:00:00'),
            title: 'Termin mit Max Mustermann',
            data: {
                color: '#c686d8',
            },
        },
        {
            start: new Date('2023-12-09T12:00:00'),
            end: new Date('2023-12-09T13:00:00'),
            title: 'Essen mit Max Mustermann',
            data: {
                color: '#86d88a',
            },
        },
        {
            start: new Date('2023-12-10T16:00:00'),
            end: new Date('2023-12-10T16:30:00'),
            title: 'Termin mit Max Mustermann',
            data: {
                color: '#d8c686',
            },
        },
    ];

    useEffect(() => {
        fetchHolidays();
    }, []);

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
