import { useCallback, useEffect, useRef, useState } from 'react';
import { useUser } from '../../contexts/userContext';
import { deletePromptInFirestore, addChatInHistory, loadUserDataFromFirestore } from '../../services/firestore';
import TypingLoader from '../global/typingLoader';
import AssistantPrompt from './assistantPrompt';
import ReactMarkdown from 'react-markdown';

export default function AssistantChat({ chatHistory }) {
    const { familyID, familyManagement } = useUser();
    const [memberData, setMemberData] = useState([]);
    const endOfMessagesRef = useRef(null);
    const familyImages = memberData.reduce(
        (map, member) => ({
            ...map,
            [member.id]: member.photo,
        }),
        {}
    );

    /**
     * loads the user data of family members from firestore
     */
    const loadMemberData = useCallback(
        function loadMemberData() {
            let memberData = [];

            familyManagement.member.map(async (member) => {
                const data = await loadUserDataFromFirestore(member);
                memberData = [...memberData, data.profile];
                setMemberData(memberData);
            });
        },
        [familyManagement]
    );

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
     * loads user data on component loading from firestore
     */
    useEffect(() => {
        loadMemberData();
    }, [loadMemberData]);

    /**
     * scrolls chat history to bottom, if new messages are added
     * needs to be in sync with responding chat completion from api
     */
    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    return (
        <div className="assistant-chat-wrapper fade-effect">
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
                            <img className="chat-prompt-image" src={familyImages[chat.user] ?? '/assets/img/profile-picture.png'} alt="User" />
                        </div>
                        <div className="chat-response">
                            <img className="chat-response-image" src="/assets/img/assistant_small.png" alt="AI" />
                            {chat.status.state !== 'COMPLETED' && chat.status.state !== 'ERROR' && (
                                <div className="chat-response-text">
                                    <TypingLoader />
                                </div>
                            )}
                            {chat.status.state === 'COMPLETED' && (
                                <div className="chat-response-text">
                                    <ReactMarkdown>{chat.response}</ReactMarkdown>
                                </div>
                            )}
                            {chat.status.state === 'ERROR' && (
                                <div className="chat-response-text">
                                    Es tut mir Leid, aber ich konnte deine Anfrage leider nicht beantworten. Gibt es etwas anderes bei dem ich dir
                                    helfen kann?
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
            <div ref={endOfMessagesRef} />
            <AssistantPrompt />
        </div>
    );
}
