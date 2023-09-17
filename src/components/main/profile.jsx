import { useState } from 'react';

export default function UserProfile({ setOpenPage, activeUser }) {
    const [userName, setUserName] = useState(activeUser.displayName || '');
    const [email, setEmail] = useState(activeUser.email);

    console.log(activeUser);

    return (
        <div className="profil-wrapper">
            <div className="profil-content">
                <div className="profil-header">
                    <h4 className="profil-title mb-2">Benutzerprofil</h4>
                    <span>Hier kannst du deine Benutzerdaten ändern</span>
                </div>
                <div className="profile-body mt-4">
                    <form>
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
                                required
                            />
                        </div>
                        <div className="profile-footer mt-5">
                            <button type="button" className="btn btn-secondary" onClick={() => setOpenPage('ListPage')}>
                                Abbrechen
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Speichern
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
