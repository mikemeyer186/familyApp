import { useEffect, useState } from 'react';
import { storage } from '../../config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function UserProfile({ setOpenPage, activeUser, updateUserProfile }) {
    const [userName, setUserName] = useState(activeUser.displayName || '');
    const [email, setEmail] = useState(activeUser.email);
    const [photoUrl, setPhotoUrl] = useState(activeUser.photoURL || '');
    const [newPhotoUrl, setNewPhotoUrl] = useState('');
    const [file, setFile] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const userID = activeUser.uid;

    function handleSubmit(e) {
        e.preventDefault();
        updateUserProfile(userName, photoUrl);
        //updateUserEmail(email);
        setOpenPage('ListPage');
    }

    async function getPhotoUrl(storageRef) {
        await getDownloadURL(storageRef).then((url) => {
            setPhotoUrl(url);
        });
    }

    useEffect(() => {
        setTimeout(() => {
            const storageRef = ref(storage, userID + '_' + file.name);
            if (file) {
                uploadBytes(storageRef, file).then(() => {
                    getPhotoUrl(storageRef).then(() => {
                        setIsUploading(false);
                    });
                });
            }
        }, 3000);
    }, [newPhotoUrl, file, userID]);

    useEffect(() => {
        if (file) {
            setIsUploading(true);
        }
    }, [file]);

    return (
        <div className="profil-wrapper">
            <div className="profil-content">
                <div className="profil-header">
                    <h4 className="profil-title mb-2">Benutzerprofil</h4>
                    <span>Hier kannst du deine Benutzerdaten ändern</span>
                </div>
                <div className="profile-body mt-5">
                    <div className="profile-image mb-2">
                        <div className={`image-wrapper ${isUploading && 'uploading-image'}`}>
                            <img className="profil-image" src={photoUrl} alt="Profil image" />
                        </div>
                    </div>

                    <form>
                        <div className="mb-3">
                            <label htmlFor="photoUrl" className="col-form-label">
                                Profilbild
                            </label>
                            <input
                                type="file"
                                className="form-control"
                                id="photoUrl"
                                value={newPhotoUrl}
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
                                onChange={(e) => setUserName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="userName" className="col-form-label">
                                E-Mail
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled
                                required
                            />
                        </div>
                        <div className="profile-footer mt-5">
                            <button type="button" className="btn btn-secondary" onClick={() => setOpenPage('ListPage')}>
                                Abbrechen
                            </button>
                            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                                Speichern
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
