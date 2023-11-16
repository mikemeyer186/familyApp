import { createContext, useContext, useEffect, useState } from 'react';
import { addPaymentInFirestore, loadJournalFromFirestore, updatePaymentInFirestore } from '../services/firestore';
import { useAlert } from './alertContext';

const JournalContext = createContext();

function JournalProvider({ children }) {
    const date = new Date();
    const { setSuccess } = useAlert();
    const [journals, setJournals] = useState([]);
    const [activeJournal, setActiveJournal] = useState({});
    const [activePayment, setActivePayment] = useState([]);
    const [newActivePayment, setNewActivePayment] = useState([]);
    const [sumOfPayments, setSumOfPayments] = useState([]);
    const [selectedJournalId, setSelectedJournalId] = useState('');
    const [selectedYear, setSelectedYear] = useState(date.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(date.getMonth() + 1);
    const [isLoaded, setIsLoaded] = useState(false);

    async function loadJournals() {
        const loadedJournals = await loadJournalFromFirestore();
        setJournals(loadedJournals);
    }

    async function addNewPayment(newPayment, journalId) {
        const payment = [newPayment, ...activePayment];
        setActivePayment(payment);
        await addPaymentInFirestore(payment, journalId);
        await loadJournals();
        setSuccess('Der neue Beleg wurde erfolgreich gebucht!');
    }

    async function editPayment(newPayment, journalId) {
        const newPayments = activePayment.map((payment) => {
            if (payment.id === newPayment.id) {
                payment = newPayment;
            }
            return payment;
        });

        setActivePayment(newPayments);
        await updatePaymentInFirestore(newPayments, journalId);
        await loadJournals();
    }

    async function addEditedPayment(newPayment, journalId) {
        const newPayments = [newPayment, ...newActivePayment];
        await addPaymentInFirestore(newPayments, journalId);
        await loadJournals();
    }

    async function deletePayment(data) {
        const newPayments = activePayment.filter((payment) => payment.id !== data.id);
        setActivePayment(newPayments);
        await updatePaymentInFirestore(newPayments, activeJournal.id);
        await loadJournals();
    }

    function sumPayments() {
        let sum = [];

        activePayment.map((payment) => {
            const aggregate = payment.aggregate;
            const category = payment.category;
            let aggregateSum = sum.find((object) => object.aggregate === aggregate);

            if (!aggregateSum) {
                aggregateSum = {
                    aggregate: aggregate,
                    sum: payment.amount,
                    categories: {
                        [category]: payment.amount,
                    },
                };
                sum.push(aggregateSum);
            } else {
                aggregateSum.sum += payment.amount;
                aggregateSum.categories[category] = (aggregateSum.categories[category] || 0) + payment.amount;
            }
        });

        setSumOfPayments(sum);
    }

    useEffect(() => {
        sumPayments();
    }, [activePayment]);

    useEffect(() => {
        const filteredJournals = journals.filter((journal) => journal.id === `${selectedYear}-${selectedMonth}`);
        const filteredJournal = filteredJournals[0];
        setSelectedJournalId(`${selectedYear}-${selectedMonth}`);
        setActiveJournal(filteredJournal);
        setActivePayment(filteredJournal ? filteredJournal.payment : []);
        setTimeout(() => {
            setIsLoaded(true);
        }, 500);
    }, [journals, selectedYear, selectedMonth]);

    return (
        <JournalContext.Provider
            value={{
                journals: journals,
                activeJournal: activeJournal,
                activePayment: activePayment,
                sumOfPayments: sumOfPayments,
                selectedJournalId: selectedJournalId,
                selectedYear: selectedYear,
                selectedMonth: selectedMonth,
                isLoaded: isLoaded,
                setSelectedYear,
                setSelectedMonth,
                setJournals,
                loadJournals,
                setSelectedJournalId,
                setActiveJournal,
                setActivePayment,
                addNewPayment,
                editPayment,
                addEditedPayment,
                setNewActivePayment,
                deletePayment,
                sumPayments,
            }}
        >
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
