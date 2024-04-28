import { Outlet } from 'react-router';
import { useEffect, useRef } from 'react';
import { db } from '../../config/firebase';
import { collection, doc, endAt, onSnapshot, orderBy, query, startAt } from 'firebase/firestore';
import { useCalendar } from '../../contexts/calendarContext';
import { useList } from '../../contexts/listContext';
import { useJournal } from '../../contexts/journalContext';
import { useUser } from '../../contexts/userContext';
import Navbar from './navbar';
import Dialogs from './dialogs';

export default function AppLayout() {
    const { activeUser, familyID, setFamilyManagement, setAppSettings, setUserSettings, loadMotivation } = useUser();
    const { loadEvents, loadPublicEvents } = useCalendar();
    const { setLists, setIsListLoaded } = useList();
    const { setJournals, setIsJournalLoaded } = useJournal();
    const didInit = useRef(false);

    /**
     * loads public events from api on initial loading
     * loads motivation from firestore api on initial loading
     */
    useEffect(() => {
        if (!didInit.current) {
            loadPublicEvents();
            loadMotivation();
            didInit.current = true;
        }
    }, [loadPublicEvents, loadMotivation]);

    /**
     * listener for app settings from firebase
     */
    useEffect(() => {
        const familyCollection = collection(db, familyID);
        const prefix = 'settings';
        const q = query(familyCollection, orderBy('__name__'), startAt(prefix), endAt(prefix + '\uf8ff'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newSettings = querySnapshot.docs.map((doc) => doc.data());
            setAppSettings(newSettings[0]);
        });

        return () => {
            unsubscribe();
        };
    }, [familyID, setAppSettings]);

    /**
     * listener for user settings from firebase
     */
    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'user', activeUser.uid), (doc) => {
            const newUserSettings = doc.data();
            setUserSettings(newUserSettings);
        });

        return () => {
            unsubscribe();
        };
    }, [activeUser, setUserSettings]);

    /**
     * listener for family management from firebase
     */
    useEffect(() => {
        const familyCollection = collection(db, familyID);
        const prefix = 'management';
        const q = query(familyCollection, orderBy('__name__'), startAt(prefix), endAt(prefix + '\uf8ff'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const management = querySnapshot.docs.map((doc) => doc.data());
            setFamilyManagement(management[0]);
        });

        return () => {
            unsubscribe();
        };
    }, [familyID, setFamilyManagement]);

    /**
     * listener for events from firebase
     */
    useEffect(() => {
        const familyCollection = collection(db, familyID);
        const prefix = 'event';
        const q = query(familyCollection, orderBy('__name__'), startAt(prefix), endAt(prefix + '\uf8ff'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.docs.map((doc) => doc.data());
            loadEvents();
        });

        return () => {
            unsubscribe();
        };
    }, [loadEvents, familyID]);

    /**
     * listener for lists from firebase
     */
    useEffect(() => {
        const familyCollection = collection(db, familyID);
        const prefix = 'list';
        const q = query(familyCollection, orderBy('__name__'), startAt(prefix), endAt(prefix + '\uf8ff'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newLists = querySnapshot.docs.map((doc) => doc.data());
            setLists(newLists);
            setIsListLoaded(true);
        });

        return () => {
            unsubscribe();
        };
    }, [setLists, familyID, setIsListLoaded]);

    /**
     * listener for journals from firebase
     */
    useEffect(() => {
        const familyCollection = collection(db, familyID);
        const prefix = '20';
        const q = query(familyCollection, orderBy('__name__'), startAt(prefix), endAt(prefix + '\uf8ff'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newJournal = querySnapshot.docs.map((doc) => doc.data());
            setJournals(newJournal);
            setIsJournalLoaded(true);
        });

        return () => {
            unsubscribe();
        };
    }, [setJournals, familyID, setIsJournalLoaded]);

    return (
        <>
            <Dialogs />
            <Navbar />
            <Outlet />
        </>
    );
}
