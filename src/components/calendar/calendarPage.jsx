import { Calendar } from 'react-big-calendar';
import { useEffect } from 'react';
import { useCalendar } from '../../contexts/calendarContext';
import { db } from '../../config/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import CalendarConfig from '../../config/rbc';
import Spinner from '../global/spinner';
import CalendarPageToolbar from './calendarPageToolbar';
import DialogNewMeeting from './dialogNewMeeting';
import DialogEditMeeting from './dialogEditMeeting';

export default function CalendarPage() {
    const { isLoaded, events, loadEvents, onSelectEvent, onSelectTimeSlot, getDrilldownView, loadPublicEvents } = useCalendar();
    const { localizer, messages, formats, components, min, max } = CalendarConfig();

    /**
     * loads public events for the calendar on first render
     */
    useEffect(() => {
        loadPublicEvents();
    }, [loadPublicEvents]);

    /**
     * observable for events from firebase
     */
    useEffect(() => {
        const q = query(collection(db, 'calendar'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.docs.map((doc) => doc.data());
            loadEvents();
        });

        return () => {
            unsubscribe();
        };
    }, [loadEvents]);

    return (
        <>
            <DialogNewMeeting />
            <DialogEditMeeting />

            <div className="calendarPage-wrapper">
                <div className="calendarToolbar">
                    <CalendarPageToolbar />
                </div>

                {!isLoaded ? (
                    <Spinner>{'Kalender laden...'}</Spinner>
                ) : (
                    <Calendar
                        localizer={localizer}
                        culture={'de-DE'}
                        messages={messages}
                        defaultView="agenda"
                        views={['agenda', 'week', 'month']}
                        formats={formats}
                        components={components}
                        startAccessor="start"
                        endAccessor="end"
                        min={min}
                        max={max}
                        length={14}
                        events={events}
                        dayLayoutAlgorithm={'no-overlap'}
                        showAllEvents={false}
                        getDrilldownView={getDrilldownView}
                        longPressThreshold={10}
                        onSelectEvent={onSelectEvent}
                        onSelectSlot={onSelectTimeSlot}
                        selectable
                    />
                )}
            </div>
        </>
    );
}
