import { useEffect, useState } from 'react';
import { useCalendar } from '../../contexts/calendarContext';
import motivationSentences from '../../data/motivationSayings';
import Spinner from '../global/spinner';

export default function DashboardPage() {
    const { isCalendarLoaded, events } = useCalendar();
    const [nextEvents, setNextEvents] = useState();
    const [yearDay] = useState(dayOfYear());
    const [isLoaded, setIsLoaded] = useState(false);

    /**
     * calculates the number of current day of the year
     * @returns number of the current day of the year
     */
    function dayOfYear() {
        const date = new Date();
        const day = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        return day;
    }

    /**
     * identifies the events which are today and for the next seven days
     * @param {Array} events
     * @returns
     */
    function filterEventsForNext7Days(events) {
        const currentDate = new Date();
        const nextSevenDays = new Date();
        currentDate.setHours(0, 0, 0, 0);
        nextSevenDays.setDate(currentDate.getDate() + 7);

        const filteredEvents = events.filter((event) => {
            const eventStartDate = new Date(event.start);
            const eventEndDate = new Date(event.end);

            return (
                (eventStartDate >= currentDate && eventStartDate <= nextSevenDays) || (eventEndDate >= currentDate && eventEndDate <= nextSevenDays)
            );
        });

        return filteredEvents;
    }

    // in einzelne Funktionen ändern (Kalender, Journal, Listen) - is...Loaded
    // isLoaded im Dashboard erst auf true, wenn alle anderen Komponenten geladen sind
    // Observable in AppLayout
    // Einzelne Komponenten der Tiltes im Dashboard
    // wenn ganztätiges Event, dann andere Formatierung
    // DashboardContext? oder in vorhandene Kontexte?
    useEffect(() => {
        if (isCalendarLoaded) {
            const nextEvents = filterEventsForNext7Days(events);
            console.log(nextEvents);
            setNextEvents(nextEvents);
            setIsLoaded(true);
        }
    }, [events, isCalendarLoaded]);

    return (
        <div className="dashboardPage-wrapper">
            {!isLoaded ? (
                <Spinner>{'Dashboard laden...'}</Spinner>
            ) : (
                <>
                    <div className="dashboard-tile">
                        <p className="motivation-text">&quot;{motivationSentences[yearDay]}&quot;</p>
                    </div>

                    <div className="dashboard-tile">
                        <p className="tile-title">Termine</p>
                        {nextEvents.map((event) => {
                            return (
                                <div key={event.data.id}>
                                    <p>{event.title}</p>
                                    <p>{event.start.toLocaleString()}</p>
                                    <p>{event.end.toLocaleString()}</p>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
