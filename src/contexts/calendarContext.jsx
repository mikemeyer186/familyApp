import { createContext, useCallback, useContext, useState } from 'react';
import { useAlert } from './alertContext';
import { addEventInFirestore, loadEventsFromFirestore } from '../services/firestore';

const CalendarContext = createContext();

function CalendarProvider({ children }) {
    const { setSuccess } = useAlert();
    const [events, setEvents] = useState([]);
    const [firestoreEvents, setFirestoreEvents] = useState([]);
    const [isLoaded, setIsloaded] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [timeSlotClicked, setTimeSlotClicked] = useState(false);
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
     * converts holidays from API to events for the calendar
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
     * loads school holidays and public holidays from API and converts them to events for the calendar
     */
    const loadPublicEvents = useCallback(
        async function loadPublicEvents() {
            const rawSchoolHolidays = await fetchSchoolHolidaysFromAPI();
            const rawPublicHolidays = await fetchPublicHolidaysFromAPI();
            await convertRawEvents(rawSchoolHolidays, schoolHolidayColor);
            await convertRawEvents(rawPublicHolidays, publicHolidayColor);
        },
        [convertRawEvents, fetchPublicHolidaysFromAPI, fetchSchoolHolidaysFromAPI]
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
            await loadPublicEvents();
            await loadFirestoreEvents();
            setIsloaded(true);
        },
        [loadPublicEvents, loadFirestoreEvents]
    );

    /**
     * adds new meeting to firestore and loads all events for the calendar
     * @param {object} newMeeting - new meeting to be added to firestore
     */
    async function addNewMeeting(newMeeting) {
        const newFirestoreEvents = [...firestoreEvents, newMeeting];
        setFirestoreEvents(newFirestoreEvents);
        await addEventInFirestore(newFirestoreEvents);
        await loadEvents();
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
        await loadEvents();
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
        await loadEvents();
        setSuccess('Der Termin wurde erfolgreich gelöscht!');
    }

    /**
     * onSelect event is triggered when user clicks on an event in the calendar
     * sets selectedEvent to the clicked event
     */
    const onSelectEvent = useCallback((calEvent) => {
        setSelectedEvent(calEvent);
    }, []);

    /**
     * onSelect time slot is triggered when user clicks on a time slot in the calendar
     */
    const onSelectTimeSlot = useCallback((slotInfo) => {
        setSelectedTimeSlot(slotInfo);
        setTimeSlotClicked(true);
    }, []);

    /**
     * navigates to agenda view when user clicks on a time slot in month view or more-button
     */
    const getDrilldownView = useCallback((targetDate, currentViewName, configuredViewNames) => {
        if (currentViewName === 'month' && configuredViewNames.includes('agenda')) {
            return 'agenda';
        }
        return null;
    }, []);

    return (
        <CalendarContext.Provider
            value={{
                events: events,
                firestoreEvents: firestoreEvents,
                isLoaded: isLoaded,
                selectedEvent: selectedEvent,
                selectedTimeSlot: selectedTimeSlot,
                timeSlotClicked: timeSlotClicked,
                loadEvents,
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

export { CalendarProvider, useCalendar };
