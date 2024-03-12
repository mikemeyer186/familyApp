import { useEffect, useRef, useState } from 'react';
import { storage } from '../../config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useNavigate } from 'react-router';
import { useUser } from '../../contexts/userContext';
import { useSessionStorage } from '../../hooks/useSessionStorage';

export default function UserProfile() {
    const { activeUser, isGuest, updateUserProfile } = useUser();
    const [userName, setUserName] = useState(activeUser.displayName || '');
    const [photoUrl, setPhotoUrl] = useState(activeUser.photoURL || '');
    const [newPhotoUrl, setNewPhotoUrl] = useState('');
    const [file, setFile] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [lastPage] = useSessionStorage('lastPage');
    const [isChanged, setIsChanged] = useState(false);
    const photoInputRef = useRef(null);
    const userID = activeUser.uid;
    const navigate = useNavigate();

    /**
     * handles user data update
     * @param {event} e - event from form submit
     */
    function handleSubmit(e) {
        e.preventDefault();
        updateUserProfile(userName, photoUrl);
        navigate(`/app/${lastPage}`);
    }

    /**
     * handles the change of user name
     * @param {string} value - user name from input field
     */
    function handleChangeUserName(value) {
        setIsChanged(true);
        setUserName(value);
    }

    /**
     * gets download url of photo from storage
     * and sets photoUrl state
     * @param {string} storageRef - storage reference of photo
     */
    async function getPhotoUrl(storageRef) {
        setIsChanged(true);
        await getDownloadURL(storageRef).then((url) => {
            setPhotoUrl(url);
        });
    }

    /**
     * uploads photo to storage and gets download url
     * and triggers setIsUploading state (3 seconds delay)
     */
    useEffect(() => {
        const uploadTime = setTimeout(() => {
            const storageRef = ref(storage, userID + '_' + file.name);
            if (file) {
                uploadBytes(storageRef, file).then(() => {
                    getPhotoUrl(storageRef).then(() => {
                        setIsUploading(false);
                    });
                });
            }
        }, 3000);

        return () => {
            clearTimeout(uploadTime);
        };
    }, [newPhotoUrl, file, userID]);

    /**
     * sets isUploading state to true on file change
     */
    useEffect(() => {
        if (file) {
            setIsUploading(true);
        }
    }, [file]);

    return (
        <div className="profile-wrapper">
            <div className="profile-content">
                <div className="profil-header">
                    <h4 className="profil-title mb-2">Benutzerprofil</h4>
                    <span>
                        Hier kannst du dein Profilbild und deinen Benutzernamen ändern
                        {isGuest && <span className="not-allowed"> (als Gast nicht möglich)</span>}.
                    </span>
                </div>
                <div className="profile-body mt-5">
                    <div className="profile-image mb-2">
                        <div className={`image-wrapper ${isUploading && 'uploading-image'}`}>
                            <img
                                className="profile-image-circle"
                                src={photoUrl === '' ? '/assets/img/profile-picture.png' : photoUrl}
                                alt="Profil image"
                            />
                            <div className="profile-image-circle-hover" onClick={() => photoInputRef.current.click()}>
                                <img src="/assets/icons/pencil-fill.svg" alt="Edit" />
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="file"
                                className="form-control d-none"
                                id="photoUrl"
                                ref={photoInputRef}
                                value={newPhotoUrl}
                                disabled={isGuest}
                                onChange={(e) => {
                                    setNewPhotoUrl(e.target.value);
                                    setFile(e.target.files[0]);
                                }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="userName" className="col-form-label">
                                Benutzername
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="userName"
                                value={userName}
                                onChange={(e) => handleChangeUserName(e.target.value)}
                                disabled={isGuest}
                                required
                            />
                        </div>
                        <div className="profile-footer mt-5">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate(`/app/${lastPage}`)}>
                                Abbrechen
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={!isChanged}>
                                Speichern
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
