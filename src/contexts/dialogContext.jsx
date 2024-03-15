import { Modal } from 'bootstrap';
import { createContext, useContext, useEffect, useMemo, useRef } from 'react';

const DialogContext = createContext();

function DialogProvider({ children }) {
    const calendarDeleteRef = useRef();
    const calendarEditRef = useRef();
    const calendarNewRef = useRef();
    const journalNewRef = useRef();
    const journalEditRef = useRef();
    const journalDeleteRef = useRef();
    const listNewRef = useRef();
    const listEditRef = useRef();
    const listDeleteRef = useRef();
    const didInit = useRef(false);
    const modals = useMemo(() => ({}), []);
    const dialogs = useMemo(
        () => ({
            calendarDeleteRef,
            calendarEditRef,
            calendarNewRef,
            journalNewRef,
            journalEditRef,
            journalDeleteRef,
            listNewRef,
            listEditRef,
            listDeleteRef,
        }),
        []
    );

    /**
     * opens modal
     * @param {string} dialogRef - reference to dialog
     */
    const openDialog = (dialogRef) => {
        const dialog = modals[dialogRef];
        dialog.show();
    };

    /**
     * closes modal
     * @param {string} dialogRef - reference to dialog
     */
    const closeDialog = (dialogRef) => {
        const dialog = modals[dialogRef];
        dialog.hide();
    };

    /**
     * creates modals for dialogs on initial loading
     * one instance of each dialog is needed for showing and hiding
     */
    useEffect(() => {
        if (!didInit.current) {
            Object.keys(dialogs).forEach((dialog) => {
                modals[dialog] = new Modal(dialogs[dialog].current);
            });
            didInit.current = true;
        }
    }, [dialogs, modals]);

    return <DialogContext.Provider value={{ dialogs: dialogs, openDialog, closeDialog }}>{children}</DialogContext.Provider>;
}

function useDialog() {
    const context = useContext(DialogContext);

    if (context === undefined) {
        throw new Error('useDialog must be used within a DialogProvider');
    }

    return context;
}

export { DialogProvider, useDialog };
