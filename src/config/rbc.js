import { luxonLocalizer } from 'react-big-calendar';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import CalendarToolbar from '../components/calendar/calendarToolbar';
import CalendarEvent from '../components/calendar/calendarEvent';

export default function CalendarConfig() {
    const { localizer } = useMemo(() => ({ localizer: luxonLocalizer(DateTime, { firstDayOfWeek: 1 }) }), []);
    const { min, max, messages, formats, components } = useMemo(
        () => ({
            // start time and end time in week view (8 - 23)
            min: new Date(2023, 0, 1, 8, 0, 0),
            max: new Date(2023, 0, 1, 23, 59, 0),

            // translated titles and names
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

            // date formats
            formats: {
                //month view
                dateFormat: (date, culture, localizer) => localizer.format(date, 'd', culture),
                weekdayFormat: (date, culture, localizer) => localizer.format(date, 'ccc', culture),

                //week view
                dayFormat: (date, culture, localizer) => localizer.format(date, 'ccc', culture),
                dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
                    'Woche ' +
                    localizer.format(start, 'WW', culture) +
                    '|' +
                    localizer.format(start, 'dd.MM.yyyy', culture) +
                    ' - ' +
                    localizer.format(end, 'dd.MM.yyyy', culture),

                //agenda view
                agendaDateFormat: (date, culture, localizer) => localizer.format(date, 'ccc, dd.MM.yyyy', culture),
                agendaHeaderFormat: ({ start, end }, culture, localizer) =>
                    localizer.format(start, 'dd.MM.yyyy', culture) + ' - ' + localizer.format(end, 'dd.MM.yyyy', culture),
            },

            // custom components
            components: {
                toolbar: CalendarToolbar,
                event: CalendarEvent,
            },
        }),
        []
    );
    return {
        localizer,
        min,
        max,
        messages,
        formats,
        components,
    };
}
