import { createContext, useCallback, useContext, useState } from 'react';

const CalendarContext = createContext();

function CalendarProvider({ children }) {
    const [events, setEvents] = useState([]);
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
                },
            };
            setEvents((currentEvents) => {
                const events = [...currentEvents, event];
                return events;
            });
        });
    }, []);

    const loadEvents = useCallback(
        async function loadEvents() {
            setEvents([]);
            const rawSchoolHolidays = await fetchSchoolHolidaysFromAPI();
            const rawPublicHolidays = await fetchPublicHolidaysFromAPI();
            await convertRawEvents(rawSchoolHolidays, schoolHolidayColor);
            await convertRawEvents(rawPublicHolidays, publicHolidayColor);
            setIsloaded(true);
        },
        [convertRawEvents, fetchPublicHolidaysFromAPI, fetchSchoolHolidaysFromAPI]
    );

    return (
        <CalendarContext.Provider
            value={{
                events: events,
                isLoaded: isLoaded,
                loadEvents,
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
