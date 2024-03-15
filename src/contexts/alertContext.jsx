import { createContext, useContext, useEffect, useState } from 'react';

const AlertContext = createContext();

function AlertProvider({ children }) {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [slideOut, setSlideOut] = useState('');

    /**
     * sets timeout for slide animation of alert
     */
    useEffect(() => {
        const alertTime = setTimeout(() => {
            setSlideOut('slide-out-alert');
        }, 3000);

        const slideTime = setTimeout(() => {
            setError('');
            setSuccess('');
            setSlideOut('');
        }, 3200);

        return () => {
            clearTimeout(alertTime);
            clearTimeout(slideTime);
        };
    }, [error, success]);

    return (
        <AlertContext.Provider value={{ error: error, success: success, slideOut: slideOut, setError, setSuccess }}>{children}</AlertContext.Provider>
    );
}

function useAlert() {
    const context = useContext(AlertContext);

    if (context === undefined) {
        throw new Error('useAlert must be used within a AlertProvider');
    }

    return context;
}

export { AlertProvider, useAlert }; //eslint-disable-line
