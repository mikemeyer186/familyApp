import { createContext, useContext, useState } from 'react';
import { loadJournalFromFirestore } from '../services/firestore';

const JournalContext = createContext();

function JournalProvider({ children }) {
    const [journals, setJournals] = useState([]);
    const [activeJournal, setActiveJournal] = useState({});

    async function loadJournals() {
        const loadedJournals = await loadJournalFromFirestore();
        setJournals(loadedJournals);
    }

    return (
        <JournalContext.Provider value={{ journals: journals, activeJournal: activeJournal, loadJournals, setActiveJournal }}>
            {children}
        </JournalContext.Provider>
    );
}

function useJournal() {
    const context = useContext(JournalContext);

    if (context === undefined) {
        throw new Error('useContext must be used within a ContextProvider');
    }

    return context;
}

export { JournalProvider, useJournal };
