import { useEffect, useRef, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, endAt, onSnapshot, orderBy, query, startAt } from 'firebase/firestore';
import { useUser } from '../../contexts/userContext';

export default function AssistantPage() {
    const { familyID } = useUser();
    const [chatHistory, setChatHistory] = useState([]);
    const [prompt, setPrompt] = useState('');
    const endOfMessagesRef = useRef(null);

    /**
     * scrolls the chat history to bottom
     */
    function scrollToBottom() {
        endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }

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

    /**
     * scrolls chat history to bottom, if new messages are added
     */
    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

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
                <div ref={endOfMessagesRef} />
                <div className="chat-input">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Stelle eine Frage..."
                        value={prompt || ''}
                        onChange={(event) => setPrompt(event.target.value)}
                    />
                    <button className="btn btn-primary" type="submit" id="addListItemButton" disabled={prompt === ''}>
                        <img src="/assets/icons/send.svg" alt="Senden" />
                    </button>
                </div>
            </div>
        </div>
    );
}
