import { useEffect, useRef, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, endAt, onSnapshot, orderBy, query, startAt } from 'firebase/firestore';
import { useUser } from '../../contexts/userContext';
import { addPromptInFirestore } from '../../services/firestore';
import TypingLoader from '../global/typingLoader';

export default function AssistantPage() {
    const { familyID, activeUser } = useUser();
    const [chatHistory, setChatHistory] = useState([]);
    const [prompt, setPrompt] = useState('');
    const endOfMessagesRef = useRef(null);

    /**
     * handles the submitting of new prompts to firestore
     * @param {event} e - event from form submit
     */
    async function handlePromptSubmit(e) {
        e.preventDefault();
        const id = 'chat_' + new Date();
        const date = new Date();
        const user = activeUser.uid;
        const photoURL = activeUser.photoURL;
        await addPromptInFirestore(familyID, id, date, user, photoURL, prompt);
        setPrompt('');
    }

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
            chats.sort((a, b) => a.date.seconds - b.date.seconds);
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
                <>
                    <div className="chat-response">
                        <img className="chat-response-image" src="/assets/img/assistant_small.png" alt="AI" />
                        <div className="chat-response-text">
                            Hi, wie kann ich dir helfen? Du kannst mich z.B. nach leckeren Rezepten fragen oder nach Ideen für spannende Aktivitäten.
                        </div>
                    </div>
                </>

                {chatHistory.map((chat) => {
                    return (
                        <div key={chat.id}>
                            <div className="chat-prompt">
                                <div className="chat-prompt-text">{chat.prompt}</div>
                                <img
                                    className="chat-prompt-image"
                                    src={chat.photoURL ? chat.photoURL : '/assets/img/profile-picture.png'}
                                    alt="User"
                                />
                            </div>
                            <div className="chat-response">
                                <img className="chat-response-image" src="/assets/img/assistant_small.png" alt="AI" />
                                <div className="chat-response-text">{chat.response ? chat.response : <TypingLoader />}</div>
                            </div>
                        </div>
                    );
                })}
                <div ref={endOfMessagesRef} />
                <form onSubmit={handlePromptSubmit}>
                    <div className="chat-input">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Stelle eine Frage..."
                            value={prompt || ''}
                            onChange={(event) => setPrompt(event.target.value)}
                            required
                        />
                        <button className="btn btn-primary" type="submit" id="addListItemButton" disabled={prompt === ''}>
                            <img src="/assets/icons/send.svg" alt="Senden" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
