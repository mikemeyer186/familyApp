import { Outlet } from 'react-router';
import { useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, endAt, onSnapshot, orderBy, query, startAt } from 'firebase/firestore';
import { useCalendar } from '../../contexts/calendarContext';
import { useList } from '../../contexts/listContext';
import { useJournal } from '../../contexts/journalContext';
import { useUser } from '../../contexts/userContext';
import Navbar from './navbar';
import Dialogs from './dialogs';

export default function AppLayout() {
    const { familyID } = useUser();
    const { loadEvents, loadPublicEvents } = useCalendar();
    const { getLists, setLists } = useList();
    const { setJournals, loadJournals } = useJournal();

    /**
     * loads public events for the calendar on first render
     */
    useEffect(() => {
        loadPublicEvents();
    }, [loadPublicEvents]);

    /**
     * get lists from database
     */
    useEffect(() => {
        getLists();
    }, [getLists]);

    /**
     * loads the journals from firestore
     */
    useEffect(() => {
        loadJournals();
    }, [loadJournals]);

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

    /**
     * observable for lists from firebase
     */
    useEffect(() => {
        const familyCollection = collection(db, familyID);
        const prefix = 'list';
        const q = query(familyCollection, orderBy('__name__'), startAt(prefix), endAt(prefix + '\uf8ff'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newLists = querySnapshot.docs.map((doc) => doc.data());
            setLists(newLists);
        });

        return () => {
            unsubscribe();
        };
    }, [setLists, familyID]);

    /**
     * observable for journals from firebase
     */
    useEffect(() => {
        const familyCollection = collection(db, familyID);
        const prefix = '20';
        const q = query(familyCollection, orderBy('__name__'), startAt(prefix), endAt(prefix + '\uf8ff'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newJournal = querySnapshot.docs.map((doc) => doc.data());
            setJournals(newJournal);
        });

        return () => {
            unsubscribe();
        };
    }, [setJournals, familyID]);

    return (
        <>
            <Dialogs />
            <Navbar />
            <Outlet />
        </>
    );
}
