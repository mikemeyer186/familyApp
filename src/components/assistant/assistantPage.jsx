import { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, endAt, onSnapshot, orderBy, query, startAt } from 'firebase/firestore';
import { useUser } from '../../contexts/userContext';
import Spinner from '../global/spinner';
import AssistantChat from './assistantChat';

export default function AssistantPage() {
    const { familyID } = useUser();
    const [chatHistory, setChatHistory] = useState([]);
    const [isAssistantLoaded, setIsAssistantLoaded] = useState(false);

    /**
     * listener for chat completions from firebase
     * ensures that responding chat completions are in sync with the app
     */
    useEffect(() => {
        const familyCollection = collection(db, familyID);
        const prefix = 'chat';
        const q = query(familyCollection, orderBy('__name__'), startAt(prefix), endAt(prefix + '\uf8ff'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chats = querySnapshot.docs.map((doc) => doc.data());
            chats.sort((a, b) => a.date.seconds - b.date.seconds);
            setIsAssistantLoaded(true);
            setChatHistory(chats);
        });

        return () => {
            unsubscribe();
        };
    }, [setChatHistory, familyID]);

    return (
        <div className="assistant-page-wrapper">
            {!isAssistantLoaded ? <Spinner>{'Assistent laden...'}</Spinner> : <AssistantChat chatHistory={chatHistory} />}
        </div>
    );
}
