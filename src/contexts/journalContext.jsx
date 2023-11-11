import { createContext, useContext, useState } from 'react';
import { loadJournalFromFirestore } from '../services/firestore';

const JournalContext = createContext();

function JournalProvider({ children }) {
    const [journals, setJournals] = useState([]);
    const [activeJournal, setActiveJournal] = useState({});

    async function loadJournals() {
        const journal = await loadJournalFromFirestore();
        setJournals(journal);
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
        throw new Error('useUser must be used within a UserProvider');
    }

    return context;
}

export { JournalProvider, useJournal };
