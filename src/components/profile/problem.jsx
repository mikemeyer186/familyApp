import { useNavigate } from 'react-router';
import { useUser } from '../../contexts/userContext';
import { useState } from 'react';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { useAlert } from '../../contexts/alertContext';

export default function Problem() {
    const { activeUser, message, setMessage } = useUser();
    const { setSuccess } = useAlert();
    const [validMessage, setValidMessage] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [lastPage] = useSessionStorage('lastPage');
    const navigate = useNavigate();
    const mailURL = import.meta.env.VITE_MAIL_URL;

    /**
     * handles user data update
     * @param {event} e - event from form submit
     */
    async function handleSubmit(e) {
        setIsSending(true);
        e.preventDefault();
        await sendMail();
        navigate(`/app/${lastPage}`);
        setMessage('');
        setIsSending(false);
        setSuccess('Deine Nachricht wurde erfolgreich versendet!');
    }

    /**
     * sends the message to mail
     * Safari causes "unhandled promise rejection typeerror load failed" in console
     * but POST request works fine - success in error catch to prevent freezing in form
     */
    async function sendMail() {
        let formData = new FormData();
        const user = activeUser.uid;
        const email = activeUser.email;
        formData.append('name', user);
        formData.append('email', email);
        formData.append('message', message.toString());

        try {
            await fetch(mailURL, {
                method: 'POST',
                body: formData,
            });
        } catch (e) {
            console.log(e);
            navigate(`/app/${lastPage}`);
            setSuccess('Deine Nachricht wurde erfolgreich versendet!');
        }
    }

    /**
     * handles the message input and validation
     * @param {string} text - message from text area
     */
    function handleMessageInput(text) {
        validateMessage(text);
    }

    /**
     * validates the message and replaces some special characters
     * @param {string} text - message from text area
     */
    function validateMessage(text) {
        const cleanedMessage = text.replace(/[{}<>[\]]/g, '');
        const hasLetter = /[a-zA-Z]/.test(cleanedMessage);
        setMessage(cleanedMessage);

        if (hasLetter) {
            setValidMessage(true);
        } else {
            setValidMessage(false);
        }
    }

    /**
     * handles the abort of message sending
     */
    function handleAbort() {
        navigate(`/app/${lastPage}`);
    }

    return (
        <div className="profile-wrapper fade-effect problem-wrapper">
            <div className="profile-content">
                <div className="profil-header">
                    <h4 className="profil-title mb-2">Problem melden</h4>
                    <span>
                        Hier kannst du Probleme oder Fehler melden. Du erhältst eine Antwort an deine E-Mail Adresse, mit der du angemeldet bist.
                        Hinterlasse mit auch gerne eine Nachricht, wenn du mit der App zufrieden bist 😉.
                    </span>
                </div>
                <div className="profile-body mt-5">
                    <form>
                        <div className="mb-3">
                            <div className="form-floating">
                                <textarea
                                    className="form-control message-area"
                                    placeholder="Leave a comment here"
                                    id="messageArea"
                                    maxLength="500"
                                    value={message}
                                    onChange={(e) => handleMessageInput(e.target.value)}
                                ></textarea>
                                <label htmlFor="messageArea">Deine Nachricht</label>
                            </div>
                        </div>
                        <div className="profile-footer mt-5">
                            <button type="button" className="btn btn-secondary" onClick={handleAbort} disabled={isSending}>
                                Abbrechen
                            </button>
                            <button type="button" className="btn btn-primary width-108" onClick={handleSubmit} disabled={!validMessage || isSending}>
                                {isSending ? (
                                    <span className="spinner-border spinner-border-small" aria-hidden="true"></span>
                                ) : (
                                    <span role="status">Absenden</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
