import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { UserPovider } from './contexts/userContext.jsx';
import { AlertProvider } from './contexts/alertContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AlertProvider>
                <UserPovider>
                    <App />
                </UserPovider>
            </AlertProvider>
        </BrowserRouter>
    </React.StrictMode>
);
