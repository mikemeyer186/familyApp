import { Modal } from 'bootstrap';
import { createContext, useContext, useRef } from 'react';

const DialogContext = createContext();

function DialogProvider({ children }) {
    const dialogs = {
        calendarDeleteRef: useRef(),
        calendarEditRef: useRef(),
        calendarNewRef: useRef(),
    };

    /**
     * opens dialog
     * @param {string} dialogRef - reference to dialog
     */
    const openDialog = (dialogRef) => {
        const dialog = new Modal(dialogs[dialogRef].current);
        dialog.show();
    };

    /**
     * closes dialog
     * @param {string} dialogRef - reference to dialog
     */
    const closeDialog = (dialogRef) => {
        const dialog = new Modal(dialogs[dialogRef].current);
        dialog.hide();
        dialog.dispose();
    };

    return <DialogContext.Provider value={{ dialogs: dialogs, openDialog, closeDialog }}>{children}</DialogContext.Provider>;
}

function useDialog() {
    const context = useContext(DialogContext);

    if (context === undefined) {
        throw new Error('useDialog must be used within a DialogProvider');
    }

    return context;
}

export { DialogProvider, useDialog }; //eslint-disable-line
