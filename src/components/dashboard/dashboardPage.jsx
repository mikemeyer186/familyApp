import { useCallback, useEffect, useRef, useState } from 'react';
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
    const eventsLoaded = useRef(false);
    const itemsLoaded = useRef(false);
    const journalLoaded = useRef(false);
    const motivationLoaded = useRef(false);
    const loadingComplete = eventsLoaded.current && itemsLoaded.current && journalLoaded.current && motivationLoaded.current;

    /**
     * loads the filtered and sorted events for the next seven days
     */
    const filterNextEvents = useCallback(
        function filterNextEvents() {
            if (isCalendarLoaded && !eventsLoaded.current) {
                const todayEvents = filterEventsForToday();
                setTodayEvents(todayEvents);
                eventsLoaded.current = true;
            }
        },
        [filterEventsForToday, isCalendarLoaded]
    );

    /**
     * loads the important list items
     */
    const filterListItems = useCallback(
        function filterListItems() {
            if (isListLoaded && !itemsLoaded.current) {
                const importantItems = filterImportantItems();
                const countedItems = countItems();
                setNumberOfItems(countedItems);
                setImportantItems(importantItems);
                itemsLoaded.current = true;
            }
        },
        [filterImportantItems, countItems, isListLoaded]
    );

    /**
     * loads the journal for actual month
     */
    const filterJournal = useCallback(
        function filterJournal() {
            if (isJournalLoaded && !journalLoaded.current) {
                const dailyBalances = filterDailyBalances();
                setJournalBalances(dailyBalances);
                journalLoaded.current = true;
            }
        },
        [filterDailyBalances, isJournalLoaded]
    );

    /**
     * loads the motivation sentence from firestore
     */
    const loadMotivationSentence = useCallback(
        function loadMotivationSentence() {
            if (isMotivationLoaded && !motivationLoaded.current) {
                motivationLoaded.current = true;
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
    }, [filterNextEvents, filterListItems, filterJournal, loadMotivationSentence]);

    return (
        <div className="dashboard-page-wrapper">
            {!loadingComplete ? (
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
