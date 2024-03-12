import { useEffect, useRef } from 'react';
import { useUser } from '../../contexts/userContext';
import { deletePromptInFirestore, addChatInHistory } from '../../services/firestore';
import TypingLoader from '../global/typingLoader';
import AssistantPrompt from './assistantPrompt';

export default function AssistantChat({ chatHistory }) {
    const { familyID } = useUser();
    const endOfMessagesRef = useRef(null);

    /**
     * handles the deletion of prompts in firestore
     * adds the deleted chat in chat-history
     * @param {string} chatID - ID of selected chat
     * @param {object} chat - complete chat object
     */
    async function handleDeletePrompt(chatID, chat) {
        const deletionDate = new Date();
        await addChatInHistory(chatID, chat, deletionDate);
        await deletePromptInFirestore(familyID, chatID);
    }

    /**
     * scrolls the chat history to bottom
     */
    function scrollToBottom() {
        endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * scrolls chat history to bottom, if new messages are added
     */
    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    return (
        <div className="assistant-chat-wrapper">
            <div className="chat-response">
                <img className="chat-response-image" src="/assets/img/assistant_small.png" alt="AI" />
                <div className="chat-response-text">
                    Hi, wie kann ich dir helfen? Du kannst mich z. B. nach leckeren Rezepten fragen oder nach Ideen für spannende Aktivitäten.
                </div>
            </div>

            {chatHistory.map((chat) => {
                return (
                    <div key={chat.id}>
                        <div className="chat-prompt">
                            <div className="chat-prompt-text" data-bs-toggle="dropdown" aria-expanded="false">
                                {chat.prompt}
                            </div>
                            <ul className="dropdown-menu dropdown-menu-assistant dropdown-menu-end">
                                <li>
                                    <button className="dropdown-item" type="button" onClick={() => handleDeletePrompt(chat.id, chat)}>
                                        Nachricht löschen
                                    </button>
                                </li>
                            </ul>
                            <img className="chat-prompt-image" src={chat.photoURL ? chat.photoURL : '/assets/img/profile-picture.png'} alt="User" />
                        </div>
                        <div className="chat-response">
                            <img className="chat-response-image" src="/assets/img/assistant_small.png" alt="AI" />
                            <div className="chat-response-text">{chat.response ? chat.response : <TypingLoader />}</div>
                        </div>
                    </div>
                );
            })}
            <div ref={endOfMessagesRef} />
            <AssistantPrompt />
        </div>
    );
}
