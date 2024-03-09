import { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, endAt, onSnapshot, orderBy, query, startAt } from 'firebase/firestore';
import { useUser } from '../../contexts/userContext';

export default function AssistantPage() {
    const { familyID } = useUser();
    const [chatHistory, setChatHistory] = useState([]);

    /**
     * observable for journals from firebase
     */
    useEffect(() => {
        const familyCollection = collection(db, familyID);
        const prefix = 'chat';
        const q = query(familyCollection, orderBy('__name__'), startAt(prefix), endAt(prefix + '\uf8ff'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chats = querySnapshot.docs.map((doc) => doc.data());
            chats.sort((a, b) => a.createTime.seconds - b.createTime.seconds);
            setChatHistory(chats);
        });

        return () => {
            unsubscribe();
        };
    }, [setChatHistory, familyID]);

    return (
        <div className="assistant-page-wrapper">
            <div className="assistant-chat-wrapper">
                {chatHistory.map((chat) => {
                    return (
                        <div key={chat.id}>
                            <div className="chat-prompt">
                                <div className="chat-prompt-text">{chat.prompt}</div>
                            </div>
                            <div className="chat-response-text">{chat.response}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
