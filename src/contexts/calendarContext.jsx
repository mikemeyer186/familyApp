import { createContext, useCallback, useContext, useState } from 'react';
import { useAlert } from './alertContext';
import { addEventInFirestore, loadEventsFromFirestore } from '../services/firestore';

const CalendarContext = createContext();

function CalendarProvider({ children }) {
    const { setSuccess } = useAlert();
    const [events, setEvents] = useState([]);
    const [schoolHolidays, setSchoolHolidays] = useState([]);
    const [publicHolidays, setPublicHolidays] = useState([]);
    const [firestoreEvents, setFirestoreEvents] = useState([]);
    const [isCalendarLoaded, setIsCalendarloaded] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [timeSlotClicked, setTimeSlotClicked] = useState(false);
    const [meetingID, setMeetingID] = useState('');
    const urlSchoolHolidays = import.meta.env.VITE_SCHOOLHOLIDAYS_URL;
    const urlPublicHolidays = import.meta.env.VITE_PUBLICHOLIDAYS_URL;
    const schoolHolidayColor = '#a3dda3';
    const publicHolidayColor = '#d89393';

    /**
     * fetches school holidays from API
     */
    const fetchSchoolHolidaysFromAPI = useCallback(
        async function fetchSchoolHolidaysFromAPI() {
            const response = await fetch(urlSchoolHolidays);

            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Request failed');
            }
        },
        [urlSchoolHolidays]
    );

    /**
     * fetches public holidays from API
     */
    const fetchPublicHolidaysFromAPI = useCallback(
        async function fetchPublicHolidaysFromAPI() {
            const response = await fetch(urlPublicHolidays);

            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Request failed');
            }
        },
        [urlPublicHolidays]
    );

    /**
     * converts school holidays and public holidays from state to events for the calendar
     */
    const convertRawEvents = useCallback(async function convertRawEvents(rawEvents, color) {
        rawEvents.map((rawEvent) => {
            const event = {
                start: new Date(rawEvent.startDate),
                end: new Date(rawEvent.endDate),
                title: rawEvent.name[0].text,
                allDay: true,
                data: {
                    color: color,
                    id: rawEvent.id,
                    info: 'von OpenHolidays API',
                    user: 'system',
                    creation: new Date().toISOString(),
                    public: true,
                },
            };
            setEvents((currentEvents) => {
                const events = [...currentEvents, event];
                return events;
            });
        });
    }, []);

    /**
     * converts events from firestore to events for the calendar
     */
    const convertEventsFromFirestore = useCallback(async function convertEventsFromFirestore(rawFirestoreEvents) {
        const rawEvents = rawFirestoreEvents.events;
        rawEvents.map((rawEvent) => {
            const event = { ...rawEvent, start: new Date(rawEvent.start), end: new Date(rawEvent.end) };
            setEvents((currentEvents) => {
                const events = [...currentEvents, event];
                return events;
            });
            setFirestoreEvents(rawEvents);
        });
    }, []);

    /**
     * initial laoding on first render
     * loads school holidays and public holidays from API and sets them as state
     */
    const loadPublicEvents = useCallback(
        async function loadPublicEvents() {
            const rawSchoolHolidays = await fetchSchoolHolidaysFromAPI();
            const rawPublicHolidays = await fetchPublicHolidaysFromAPI();
            setSchoolHolidays(rawSchoolHolidays);
            setPublicHolidays(rawPublicHolidays);
        },
        [fetchPublicHolidaysFromAPI, fetchSchoolHolidaysFromAPI]
    );

    /**
     * loads events from firestore and converts them to events for the calendar
     */
    const loadFirestoreEvents = useCallback(
        async function loadFirestoreEvents() {
            const rawFirestoreEvents = await loadEventsFromFirestore();
            await convertEventsFromFirestore(rawFirestoreEvents);
        },
        [convertEventsFromFirestore]
    );

    /**
     * loads all events for the calendar
     */
    const loadEvents = useCallback(
        async function loadEvents() {
            setEvents([]);
            setFirestoreEvents([]);
            await convertRawEvents(schoolHolidays, schoolHolidayColor);
            await convertRawEvents(publicHolidays, publicHolidayColor);
            await loadFirestoreEvents();
            setIsCalendarloaded(true);
        },
        [loadFirestoreEvents, convertRawEvents, schoolHolidays, publicHolidays]
    );

    /**
     * adds new meeting to firestore and loads all events for the calendar
     * @param {object} newMeeting - new meeting to be added to firestore
     */
    async function addNewMeeting(newMeeting) {
        const newFirestoreEvents = [...firestoreEvents, newMeeting];
        setFirestoreEvents(newFirestoreEvents);
        await addEventInFirestore(newFirestoreEvents);
        setSuccess('Der Termin wurde erfolgreich eingetragen!');
    }

    /**
     * adds edited meeting to firestore and loads all events for the calendar
     * @param {object} editedMeeting - edited meeting to be added to firestore
     */
    async function editMeeting(editedMeeting) {
        const filteredEvents = events.filter((event) => {
            return event.data.id !== editedMeeting.data.id;
        });
        const filteredFirestoreEvents = firestoreEvents.filter((firestoreEvent) => {
            return firestoreEvent.data.id !== editedMeeting.data.id;
        });
        const newFirestoreEvents = [...filteredFirestoreEvents, editedMeeting];
        setEvents(filteredEvents);
        setFirestoreEvents(newFirestoreEvents);
        await addEventInFirestore(newFirestoreEvents);
        setSuccess('Der Termin wurde erfolgreich geändert!');
    }

    /**
     * deletes meeting from firestore and loads all events for the calendar
     * @param {string} meetingID - ID of the meeting to be deleted
     */
    async function deleteMeeting(meetingID) {
        const filteredEvents = events.filter((event) => {
            return event.data.id !== meetingID;
        });
        const filteredFirestoreEvents = firestoreEvents.filter((firestoreEvent) => {
            return firestoreEvent.data.id !== meetingID;
        });
        setEvents(filteredEvents);
        setFirestoreEvents(filteredFirestoreEvents);
        await addEventInFirestore(filteredFirestoreEvents);
        setSuccess('Der Termin wurde erfolgreich gelöscht!');
    }

    /**
     * onSelect event is triggered when user clicks on an event in the calendar
     * sets selectedEvent to the clicked event
     */
    const onSelectEvent = useCallback((calEvent) => {
        setSelectedEvent(calEvent);
        setMeetingID(calEvent.data.id);
    }, []);

    /**
     * onSelect time slot is triggered when user clicks on a time slot in the calendar
     */
    const onSelectTimeSlot = useCallback((slotInfo) => {
        setSelectedTimeSlot(slotInfo);
        setTimeSlotClicked(true);
    }, []);

    /**
     * navigates to agenda view when user clicks on a time slot in month view on more-button
     */
    const getDrilldownView = useCallback((targetDate, currentViewName, configuredViewNames) => {
        if (currentViewName === 'month' && configuredViewNames.includes('agenda')) {
            return 'agenda';
        }
        return null;
    }, []);

    /**
     * identifies the events which are today and for the next seven days
     * @param {Array} events
     * @returns - filterd events for the next seven days
     */
    function filterEventsForNextWeek() {
        const currentDate = new Date();
        const nextSevenDays = new Date();
        currentDate.setHours(0, 0, 0, 0);
        nextSevenDays.setDate(currentDate.getDate() + 8);

        const filteredEvents = events.filter((event) => {
            const eventStartDate = new Date(event.start);
            const eventEndDate = new Date(event.end);
            return (
                (eventStartDate >= currentDate && eventStartDate <= nextSevenDays) || (eventEndDate >= currentDate && eventEndDate <= nextSevenDays)
            );
        });

        filteredEvents.sort((a, b) => {
            const startDateA = new Date(a.start);
            const startDateB = new Date(b.start);
            return startDateA - startDateB;
        });

        return filteredEvents;
    }

    return (
        <CalendarContext.Provider
            value={{
                events: events,
                firestoreEvents: firestoreEvents,
                isCalendarLoaded: isCalendarLoaded,
                selectedEvent: selectedEvent,
                selectedTimeSlot: selectedTimeSlot,
                timeSlotClicked: timeSlotClicked,
                meetingID: meetingID,
                loadEvents,
                loadPublicEvents,
                setEvents,
                setFirestoreEvents,
                addNewMeeting,
                editMeeting,
                deleteMeeting,
                onSelectEvent,
                setSelectedEvent,
                onSelectTimeSlot,
                setTimeSlotClicked,
                getDrilldownView,
                setMeetingID,
                filterEventsForNextWeek,
            }}
        >
            {children}
        </CalendarContext.Provider>
    );
}

function useCalendar() {
    const context = useContext(CalendarContext);

    if (context === undefined) {
        throw new Error('useCalendar must be used within a ContextProvider');
    }

    return context;
}

export { CalendarProvider, useCalendar }; // eslint-disable-line
