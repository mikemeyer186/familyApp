import { useCallback, useEffect, useState } from 'react';
import { useCalendar } from '../../contexts/calendarContext';
import { useList } from '../../contexts/listContext';
import { useJournal } from '../../contexts/journalContext';
import { useUser } from '../../contexts/userContext';
import { useNavigate } from 'react-router';
import Spinner from '../global/spinner';
import MotivationTile from './motivationTile';
import EventsTile from './EventsTile';
import ListsTile from './listsTile';
import JournalTile from './journalTile';

export default function DashboardPage() {
    const { isCalendarLoaded, filterEventsForNextWeek } = useCalendar();
    const { isListLoaded, filterImportantItems } = useList();
    const { isJournalLoaded, filterDailyBalances } = useJournal();
    const { isMotivationLoaded } = useUser();
    const [nextEvents, setNextEvents] = useState([]);
    const [importantItems, setImportantItems] = useState([]);
    const [journalBalances, setJournalBalances] = useState({});
    const [eventsLoaded, setEventsLoaded] = useState(false);
    const [itemsLoaded, setItemsLoaded] = useState(false);
    const [journalLoaded, setJournalLoaded] = useState(false);
    const [motivationLoaded, setMotivationLoaded] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    /**
     * handles navigation in menu dropdown
     * @param {string} route - route to navigate to
     */
    function navigateToPage(route) {
        navigate(route);
    }

    /**
     * loads the filtered and sorted events for the next seven days
     */
    const filterNextEvents = useCallback(
        function filterNextEvents() {
            if (isCalendarLoaded) {
                const nextEvents = filterEventsForNextWeek();
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
                setImportantItems(importantItems);
                setItemsLoaded(true);
            }
        },
        [filterImportantItems, isListLoaded]
    );

    /**
     * loads the journal for actual month
     */
    const filterJournal = useCallback(
        function filterJournal() {
            if (isJournalLoaded) {
                const dailyBalances = filterDailyBalances();
                setJournalBalances(dailyBalances);
                setJournalLoaded(true);
            }
        },
        [filterDailyBalances, isJournalLoaded]
    );

    /**
     * loads the motivation sentence from firestore
     */
    const loadMotivationSentence = useCallback(
        async function loadMotivationSentence() {
            if (isMotivationLoaded) {
                setMotivationLoaded(true);
            }
        },
        [isMotivationLoaded]
    );

    /**
     * loads the data on initial loading of the dashboard
     */
    useEffect(() => {
        filterNextEvents();
        filterListItems();
        filterJournal();
        loadMotivationSentence();
        if (eventsLoaded && itemsLoaded && journalLoaded && motivationLoaded) {
            setIsLoaded(true);
        }
    }, [filterNextEvents, filterListItems, filterJournal, loadMotivationSentence, eventsLoaded, itemsLoaded, journalLoaded, motivationLoaded]);

    return (
        <div className="dashboardPage-wrapper">
            {!isLoaded ? (
                <Spinner>{'Dashboard laden...'}</Spinner>
            ) : (
                <>
                    <MotivationTile />
                    <EventsTile nextEvents={nextEvents} navigateToPage={navigateToPage} />
                    <JournalTile journalBalances={journalBalances} navigateToPage={navigateToPage} />
                    <ListsTile importantItems={importantItems} navigateToPage={navigateToPage} />
                </>
            )}
        </div>
    );
}
