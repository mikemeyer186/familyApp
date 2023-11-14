import { createContext, useContext, useState } from 'react';
import { addPaymentInFirestore, loadJournalFromFirestore, updatePaymentInFirestore } from '../services/firestore';
import { useAlert } from './alertContext';

const JournalContext = createContext();

function JournalProvider({ children }) {
    const { setSuccess } = useAlert();
    const [journals, setJournals] = useState([]);
    const [activeJournal, setActiveJournal] = useState({});
    const [activePayment, setActivePayment] = useState([]);
    const [newActivePayment, setNewActivePayment] = useState([]);

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
        const sumOfPayments = [];

        activePayment.forEach((payment) => {
            const aggregate = payment.aggregate;
            const category = payment.category;
            let aggregateSum = sumOfPayments.find((item) => item.aggregate === aggregate);

            if (!aggregateSum) {
                aggregateSum = {
                    aggregate: aggregate,
                    amount: 0,
                    categories: {},
                };
                sumOfPayments.push(aggregateSum);
            }

            aggregateSum.amount += payment.amount;
            aggregateSum.categories[category] = (aggregateSum.categories[category] || 0) + payment.amount;
        });
        console.log(sumOfPayments);
        return sumOfPayments;
    }

    return (
        <JournalContext.Provider
            value={{
                journals: journals,
                activeJournal: activeJournal,
                activePayment: activePayment,
                setJournals,
                loadJournals,
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
