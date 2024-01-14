import { Outlet } from 'react-router';
import { useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useCalendar } from '../../contexts/calendarContext';
import Navbar from './navbar';
import Dialogs from './dialogs';

export default function AppLayout() {
    const { loadEvents, loadPublicEvents } = useCalendar();

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
            <Dialogs />
            <Navbar />
            <Outlet />
        </>
    );
}
