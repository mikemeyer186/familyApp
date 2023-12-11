import { createContext, useCallback, useContext, useState } from 'react';
import { useAlert } from './alertContext';
import { addEventInFirestore, loadEventsFromFirestore } from '../services/firestore';

const CalendarContext = createContext();

function CalendarProvider({ children }) {
    const { setSuccess } = useAlert();
    const [events, setEvents] = useState([]);
    const [firestoreEvents, setFirestoreEvents] = useState([]);
    const [isLoaded, setIsloaded] = useState(false);
    const urlSchoolHolidays = import.meta.env.VITE_SCHOOLHOLIDAYS_URL;
    const urlPublicHolidays = import.meta.env.VITE_PUBLICHOLIDAYS_URL;
    const schoolHolidayColor = '#a3dda3';
    const publicHolidayColor = '#d89393';

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
                },
            };
            setEvents((currentEvents) => {
                const events = [...currentEvents, event];
                return events;
            });
        });
    }, []);

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

    const loadFirestoreEvents = useCallback(
        async function loadFirestoreEvents() {
            const rawFirestoreEvents = await loadEventsFromFirestore();
            await convertEventsFromFirestore(rawFirestoreEvents);
        },
        [convertEventsFromFirestore]
    );

    const loadPublicEvents = useCallback(
        async function loadPublicEvents() {
            const rawSchoolHolidays = await fetchSchoolHolidaysFromAPI();
            const rawPublicHolidays = await fetchPublicHolidaysFromAPI();
            await convertRawEvents(rawSchoolHolidays, schoolHolidayColor);
            await convertRawEvents(rawPublicHolidays, publicHolidayColor);
        },
        [convertRawEvents, fetchPublicHolidaysFromAPI, fetchSchoolHolidaysFromAPI]
    );

    const loadEvents = useCallback(
        async function loadEvents() {
            setEvents([]);
            await loadPublicEvents();
            await loadFirestoreEvents();
            setIsloaded(true);
        },
        [loadPublicEvents, loadFirestoreEvents]
    );

    async function addNewMeeting(newMeeting) {
        const newFirestoreEvents = [...firestoreEvents, newMeeting];
        setFirestoreEvents(newFirestoreEvents);
        await addEventInFirestore(newFirestoreEvents);
        await loadFirestoreEvents();
        setSuccess('Der Termin wurde erfolgreich eingetragen!');
    }

    return (
        <CalendarContext.Provider
            value={{
                events: events,
                firestoreEvents: firestoreEvents,
                isLoaded: isLoaded,
                loadEvents,
                setEvents,
                setFirestoreEvents,
                addNewMeeting,
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
