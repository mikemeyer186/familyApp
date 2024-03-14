import { useCallback, useEffect, useState } from 'react';
import { useCalendar } from '../../contexts/calendarContext';
import { useList } from '../../contexts/listContext';
import { useJournal } from '../../contexts/journalContext';
import { useUser } from '../../contexts/userContext';
import Spinner from '../global/spinner';
import DashboardContent from './dashboardContent';

export default function DashboardPage() {
    const { isCalendarLoaded, filterEventsForToday } = useCalendar();
    const { isListLoaded, filterImportantItems, countItems } = useList();
    const { isJournalLoaded, filterDailyBalances } = useJournal();
    const { isMotivationLoaded } = useUser();
    const [todayEvents, setTodayEvents] = useState([]);
    const [importantItems, setImportantItems] = useState([]);
    const [numberOfItems, setNumberOfItems] = useState({});
    const [journalBalances, setJournalBalances] = useState({});
    const [eventsLoaded, setEventsLoaded] = useState(false);
    const [itemsLoaded, setItemsLoaded] = useState(false);
    const [journalLoaded, setJournalLoaded] = useState(false);
    const [motivationLoaded, setMotivationLoaded] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    /**
     * check if complete dashboard data is laoded
     */
    const checkLoadingStatus = useCallback(
        function checkLoadingStatus() {
            if (eventsLoaded && itemsLoaded && journalLoaded && motivationLoaded) {
                setIsLoaded(true);
            }
        },
        [eventsLoaded, itemsLoaded, journalLoaded, motivationLoaded]
    );

    /**
     * loads the filtered and sorted events for the next seven days
     */
    const filterNextEvents = useCallback(
        function filterNextEvents() {
            if (isCalendarLoaded) {
                const todayEvents = filterEventsForToday();
                setTodayEvents(todayEvents);
                setEventsLoaded(true);
            }
        },
        [filterEventsForToday, isCalendarLoaded]
    );

    /**
     * loads the important list items
     */
    const filterListItems = useCallback(
        function filterListItems() {
            if (isListLoaded) {
                const importantItems = filterImportantItems();
                const countedItems = countItems();
                setNumberOfItems(countedItems);
                setImportantItems(importantItems);
                setItemsLoaded(true);
            }
        },
        [filterImportantItems, countItems, isListLoaded]
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
        function loadMotivationSentence() {
            if (isMotivationLoaded) {
                setMotivationLoaded(true);
            }
        },
        [isMotivationLoaded]
    );

    /**
     * fetches dashboard data on initial loading of component
     */
    useEffect(() => {
        filterNextEvents();
        filterListItems();
        filterJournal();
        loadMotivationSentence();
        checkLoadingStatus();
    }, [filterNextEvents, filterListItems, filterJournal, loadMotivationSentence, checkLoadingStatus]);

    return (
        <div className="dashboard-page-wrapper">
            {!isLoaded ? (
                <Spinner>{'Dashboard laden...'}</Spinner>
            ) : (
                <DashboardContent
                    todayEvents={todayEvents}
                    importantItems={importantItems}
                    numberOfItems={numberOfItems}
                    journalBalances={journalBalances}
                />
            )}
        </div>
    );
}
