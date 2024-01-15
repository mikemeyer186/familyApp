import { useCallback, useEffect, useState } from 'react';
import { useCalendar } from '../../contexts/calendarContext';
import { useList } from '../../contexts/listContext';
import Spinner from '../global/spinner';
import MotivationTile from './motivationTile';
import EventsTile from './EventsTile';
import ListsTile from './listsTile';

export default function DashboardPage() {
    const { isCalendarLoaded, filterEventsForNextWeek } = useCalendar();
    const { isListLoaded, filterImportantItems } = useList();
    const [nextEvents, setNextEvents] = useState([]);
    const [importantItems, setImportantItems] = useState([]);
    const [eventsLoaded, setEventsLoaded] = useState(false);
    const [itemsLoaded, setItemsLoaded] = useState(false);
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
     * loads the important list items
     */
    const filterListItems = useCallback(
        function filterListItems() {
            if (isListLoaded) {
                const importantItems = filterImportantItems();
                console.log(importantItems);
                setImportantItems(importantItems);
                setItemsLoaded(true);
            }
        },
        [filterImportantItems, isListLoaded]
    );

    /**
     * loads the data on initial loading of the dashboard
     */
    useEffect(() => {
        filterNextEvents();
        filterListItems();
        if (eventsLoaded && itemsLoaded) {
            setIsLoaded(true);
        }
    }, [filterNextEvents, filterListItems, eventsLoaded, itemsLoaded]);

    return (
        <div className="dashboardPage-wrapper">
            {!isLoaded ? (
                <Spinner>{'Dashboard laden...'}</Spinner>
            ) : (
                <>
                    <MotivationTile />
                    <EventsTile nextEvents={nextEvents} />
                    <ListsTile importantItems={importantItems} />
                </>
            )}
        </div>
    );
}
