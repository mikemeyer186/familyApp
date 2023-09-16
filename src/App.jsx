import './styles/global.scss';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/dist/js/bootstrap.min.js';
import { useState } from 'react';
import ListPage from './components/list/listPage';
import Navbar from './components/main/navbar';
import Login from './components/main/login';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <>
            {!isAuthenticated ? (
                <Login onAuth={setIsAuthenticated} />
            ) : (
                <>
                    <div className="navbar-container">
                        <Navbar />
                    </div>
                    <div className="listPage-container">
                        <ListPage />
                    </div>
                </>
            )}
        </>
    );
}
