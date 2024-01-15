import { useCallback, useEffect, useState } from 'react';
import { useCalendar } from '../../contexts/calendarContext';
import Spinner from '../global/spinner';
import MotivationTile from './motivationTile';
import EventsTile from './EventsTile';

export default function DashboardPage() {
    const { isCalendarLoaded, filterEventsForNextWeek } = useCalendar();
    const [nextEvents, setNextEvents] = useState();
    const [eventsLoaded, setEventsLoaded] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    /**
     * loads the filtered and sorted events for the next seven days
     */
    const filterNextEvents = useCallback(
        function filterNextEvents() {
            if (isCalendarLoaded) {
                const nextEvents = filterEventsForNextWeek();
                console.log(nextEvents);
                setNextEvents(nextEvents);
                setEventsLoaded(true);
            }
        },
        [filterEventsForNextWeek, isCalendarLoaded]
    );

    /**
     * loads the data on initial loading of the dashboard
     */
    useEffect(() => {
        filterNextEvents();
        if (eventsLoaded) {
            setIsLoaded(true);
        }
    }, [filterNextEvents, eventsLoaded]);

    return (
        <div className="dashboardPage-wrapper">
            {!isLoaded ? (
                <Spinner>{'Dashboard laden...'}</Spinner>
            ) : (
                <>
                    <MotivationTile />
                    <EventsTile nextEvents={nextEvents} />
                </>
            )}
        </div>
    );
}
