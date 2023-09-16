import { useEffect, useState } from 'react';
import { signIn } from '../../services/auth';
import { authState } from '../../services/auth';

export default function Login({ onAuth }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        signIn(email, password).then(() => {
            onAuth(true);
        });
        setEmail('');
        setPassword('');
    }

    return (
        <>
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="text"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                            Anmelden
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
