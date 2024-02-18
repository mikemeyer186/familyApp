import { useCallback, useEffect, useState } from 'react';
import { useCalendar } from '../../contexts/calendarContext';
import { useList } from '../../contexts/listContext';
import { useJournal } from '../../contexts/journalContext';
import { useUser } from '../../contexts/userContext';
import { useNavigate } from 'react-router';
import Spinner from '../global/spinner';
import MotivationTile from './motivationTile';
import EventsTile from './eventsTile';
import ListsTile from './listsTile';
import JournalTile from './journalTile';
import AssistantTile from './assistantTile';

export default function DashboardPage() {
    const { isCalendarLoaded, filterEventsForNextWeek, filterEventsForToday } = useCalendar();
    const { isListLoaded, filterImportantItems, countItems } = useList();
    const { isJournalLoaded, filterDailyBalances } = useJournal();
    const { activeUser, greeting, isMotivationLoaded } = useUser();
    const [nextEvents, setNextEvents] = useState([]);
    const [todayEvents, setTodayEvents] = useState([]);
    const [importantItems, setImportantItems] = useState([]);
    const [numberOfItems, setNumberOfItems] = useState({});
    const [journalBalances, setJournalBalances] = useState({});
    const [eventsLoaded, setEventsLoaded] = useState(false);
    const [itemsLoaded, setItemsLoaded] = useState(false);
    const [journalLoaded, setJournalLoaded] = useState(false);
    const [motivationLoaded, setMotivationLoaded] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [variant, setVariant] = useState('small');
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
                const todayEvents = filterEventsForToday();
                setNextEvents(nextEvents);
                setTodayEvents(todayEvents);
                setEventsLoaded(true);
            }
        },
        [filterEventsForNextWeek, filterEventsForToday, isCalendarLoaded]
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
        async function loadMotivationSentence() {
            if (isMotivationLoaded) {
                setMotivationLoaded(true);
            }
        },
        [isMotivationLoaded]
    );

    function handleChangeView() {
        if (variant === 'small') {
            setVariant('large');
        } else {
            setVariant('small');
        }
    }

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
                    <div className="mb-4">
                        <h5 className="title">
                            {greeting}
                            {activeUser.displayName ? ', ' + activeUser.displayName + '!' : ''}
                        </h5>
                        <MotivationTile variant={variant} />
                    </div>
                    <div>
                        <h5 className="title">Organisation</h5>
                        <div className={variant === 'small' ? 'small-row' : 'large-row'}>
                            <EventsTile nextEvents={nextEvents} todayEvents={todayEvents} navigateToPage={navigateToPage} variant={variant} />
                            <ListsTile
                                importantItems={importantItems}
                                numberOfItems={numberOfItems}
                                navigateToPage={navigateToPage}
                                variant={variant}
                            />
                        </div>
                        <div className={variant === 'small' ? 'small-row' : 'large-row'}>
                            <JournalTile journalBalances={journalBalances} navigateToPage={navigateToPage} variant={variant} />
                            {variant === 'small' && <AssistantTile navigateToPage={navigateToPage} variant={variant} />}
                        </div>
                    </div>
                </>
            )}
            <button className="btn btn-outline-primary" onClick={handleChangeView}>
                Ansicht wechseln
            </button>
        </div>
    );
}
