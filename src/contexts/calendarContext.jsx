import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { useAlert } from './alertContext';
import { addEventInFirestore, loadEventsFromFirestore } from '../services/firestore';
import { useUser } from './userContext';

const CalendarContext = createContext();

function CalendarProvider({ children }) {
    const { familyID, appSettings, activeYears } = useUser();
    const { setSuccess } = useAlert();
    const [events, setEvents] = useState([]);
    const [schoolHolidays, setSchoolHolidays] = useState([]);
    const [publicHolidays, setPublicHolidays] = useState([]);
    const [firestoreEvents, setFirestoreEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [timeSlotClicked, setTimeSlotClicked] = useState(false);
    const [meetingID, setMeetingID] = useState('');
    const [newCountryCode, setNewCountryCode] = useState('');
    const firstDate = activeYears[1];
    const lastDate = activeYears[activeYears.length - 2];
    const calendarRange = `${firstDate}-01-01&validTo=${lastDate}-12-31&subdivisionCode=DE-`;
    const countryCode = newCountryCode ? newCountryCode : appSettings.calendar.country;
    const urlSchoolHolidays = import.meta.env.VITE_SCHOOLHOLIDAYS_URL + calendarRange + countryCode;
    const urlPublicHolidays = import.meta.env.VITE_PUBLICHOLIDAYS_URL + calendarRange + countryCode;
    const schoolHolidayColor = appSettings.calendar.schoolHolidayColor;
    const publicHolidayColor = appSettings.calendar.publicHolidayColor;
    const publicEventsLoaded = useRef(false);
    const publicEventsConverted = useRef(false);
    const fireStoreEventsLoaded = useRef(false);
    const isCalendarLoaded = publicEventsConverted.current && fireStoreEventsLoaded.current;

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
        });
        setFirestoreEvents(rawEvents);
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
            publicEventsLoaded.current = true;
        },
        [fetchPublicHolidaysFromAPI, fetchSchoolHolidaysFromAPI]
    );

    /**
     * loads events from firestore and converts them to events for the calendar
     */
    const loadFirestoreEvents = useCallback(
        async function loadFirestoreEvents() {
            const rawFirestoreEvents = await loadEventsFromFirestore(familyID);
            await convertEventsFromFirestore(rawFirestoreEvents);
            fireStoreEventsLoaded.current = true;
        },
        [convertEventsFromFirestore, familyID]
    );

    /**
     * loads all events for the calendar
     */
    const loadEvents = useCallback(
        async function loadEvents() {
            setEvents([]);
            setFirestoreEvents([]);

            if (publicEventsLoaded.current) {
                await convertRawEvents(schoolHolidays, schoolHolidayColor);
                await convertRawEvents(publicHolidays, publicHolidayColor);
                await loadFirestoreEvents();
                publicEventsConverted.current = true;
            }
        },
        [loadFirestoreEvents, convertRawEvents, schoolHolidays, publicHolidays, schoolHolidayColor, publicHolidayColor]
    );

    /**
     * adds new meeting to firestore and loads all events for the calendar
     * @param {object} newMeeting - new meeting to be added to firestore
     */
    async function addNewMeeting(newMeeting) {
        const newFirestoreEvents = [...firestoreEvents, newMeeting];
        setFirestoreEvents(newFirestoreEvents);
        await addEventInFirestore(familyID, newFirestoreEvents);
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
        await addEventInFirestore(familyID, newFirestoreEvents);
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
        await addEventInFirestore(familyID, filteredFirestoreEvents);
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
     * filters the events for the next seven days
     * this function is actually unused, but will be implemented in future
     * @returns - filterd events for the next seven days
     */
    const filterEventsForNextWeek = useCallback(
        function filterEventsForNextWeek() {
            const currentDate = new Date();
            const nextSevenDays = new Date();
            currentDate.setHours(0, 0, 0, 0);
            nextSevenDays.setDate(currentDate.getDate() + 8);

            const filteredEvents = events.slice().filter((event) => {
                const eventStartDate = new Date(event.start);
                const eventEndDate = new Date(event.end);
                return (
                    (eventStartDate >= currentDate && eventStartDate <= nextSevenDays) ||
                    (eventEndDate >= currentDate && eventEndDate <= nextSevenDays)
                );
            });

            filteredEvents.sort((a, b) => {
                const startDateA = new Date(a.start);
                const startDateB = new Date(b.start);
                return startDateA - startDateB;
            });

            return filteredEvents;
        },
        [events]
    );

    /**
     * filters the events which are today
     * @returns - filterd events for today
     */
    const filterEventsForToday = useCallback(
        function filterEventsForToday() {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            const filteredEvents = events.slice().filter((event) => {
                const eventStartDate = new Date(event.start);
                eventStartDate.setHours(0, 0, 0, 0);
                const eventEndDate = new Date(event.end);
                eventEndDate.setHours(0, 0, 0, 0);
                return eventStartDate.getTime() <= currentDate.getTime() && eventEndDate.getTime() >= currentDate.getTime();
            });

            filteredEvents.sort((a, b) => {
                const startDateA = new Date(a.start);
                const startDateB = new Date(b.start);
                return startDateA - startDateB;
            });

            return filteredEvents;
        },
        [events]
    );

    return (
        <CalendarContext.Provider
            value={{
                events: events,
                isCalendarLoaded: isCalendarLoaded,
                selectedEvent: selectedEvent,
                selectedTimeSlot: selectedTimeSlot,
                timeSlotClicked: timeSlotClicked,
                meetingID: meetingID,
                loadEvents,
                loadPublicEvents,
                setNewCountryCode,
                addNewMeeting,
                editMeeting,
                deleteMeeting,
                onSelectEvent,
                setSelectedEvent,
                onSelectTimeSlot,
                setTimeSlotClicked,
                getDrilldownView,
                filterEventsForNextWeek,
                filterEventsForToday,
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
