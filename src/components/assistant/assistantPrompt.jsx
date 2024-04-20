import { useState } from 'react';
import { useUser } from '../../contexts/userContext';
import { addPromptInFirestore } from '../../services/firestore';

export default function AssistantPrompt() {
    const { familyID, activeUser } = useUser();
    const [prompt, setPrompt] = useState('');

    /**
     * handles the submitting of new prompts to firestore
     * all prompts are also saved in chat-history
     * @param {event} e - event from form submit
     */
    async function handlePromptSubmit(e) {
        e.preventDefault();
        const id = 'chat_' + new Date().toISOString();
        const date = new Date();
        const user = activeUser.uid;
        const status = { state: 'STARTED' };
        await addPromptInFirestore(familyID, id, date, user, prompt, status);
        setPrompt('');
    }

    return (
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
    );
}
