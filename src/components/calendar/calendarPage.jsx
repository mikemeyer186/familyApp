import { Calendar, luxonLocalizer } from 'react-big-calendar';
import { DateTime, Settings } from 'luxon';
Settings.defaultZone = 'Europe/Berlin';

const localizer = luxonLocalizer(DateTime, { firstDayOfWeek: 1 });
const messages = {
    week: 'Woche',
    work_week: 'Arbeitswoche',
    day: 'Tag',
    month: 'Monat',
    previous: 'zurück',
    next: 'vor',
    today: `heute`,
    agenda: 'Übersicht',

    showMore: (total) => `+${total} plus`,
};

export default function CalendarPage() {
    return (
        <>
            <div className="calendarPage-wrapper">
                <Calendar
                    culture={'de-DE'}
                    messages={messages}
                    // components={components}
                    localizer={localizer}
                    //   events={myEventsList}
                    startAccessor="start"
                    endAccessor="end"
                />
            </div>
        </>
    );
}
