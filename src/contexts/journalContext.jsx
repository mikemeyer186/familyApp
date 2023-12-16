import { createContext, useCallback, useContext, useEffect, useState } from 'react';
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

    /**
     * loads journals from firestore
     */
    const loadJournals = useCallback(async function loadJournals() {
        const loadedJournals = await loadJournalFromFirestore();
        setJournals(loadedJournals);
    }, []);

    /**
     * adds new payment to firestore
     * @param {array} newPayment - new payment to add
     * @param {string} journalId - id of journal to add payment to (format: YYYY-MM)
     */
    async function addNewPayment(newPayment, journalId) {
        const payment = [newPayment, ...activePayment];
        setActivePayment(payment);
        await addPaymentInFirestore(payment, journalId);
        await loadJournals();
        setSuccess('Der neue Beleg wurde erfolgreich gebucht!');
    }

    /**
     * updates payment in firestore
     * @param {array} newPayment - edited payment
     * @param {string} journalId - id of journal to add payment to (format: YYYY-MM)
     */
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

    /**
     * adds edited payment to firestore (other month or year is selected)
     * @param {array} newPayment - edited payment
     * @param {string} journalId - id of journal to add payment to (format: YYYY-MM)
     */
    async function addEditedPayment(newPayment, journalId) {
        const newPayments = [newPayment, ...newActivePayment];
        await addPaymentInFirestore(newPayments, journalId);
        await loadJournals();
    }

    /**
     * deletes payment from firestore
     * @param {object} data - payment object from table row expansion
     */
    async function deletePayment(data) {
        const newPayments = activePayment.filter((payment) => payment.id !== data.id);
        setActivePayment(newPayments);
        await updatePaymentInFirestore(newPayments, activeJournal.id);
        await loadJournals();
    }

    /**
     * sums payments by aggregate and category
     */
    const sumPayments = useCallback(
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
        },
        [activePayment]
    );

    /**
     * sums payments on activePayment change
     */
    useEffect(() => {
        sumPayments();
    }, [activePayment, sumPayments]);

    /**
     * sets active journal and active payment on selected month or year change
     */
    useEffect(() => {
        const filteredJournals = journals.filter((journal) => journal.id === `${selectedYear}-${selectedMonth}`);
        const filteredJournal = filteredJournals[0];
        setSelectedJournalId(`${selectedYear}-${selectedMonth}`);
        setActiveJournal(filteredJournal);
        setActivePayment(filteredJournal ? filteredJournal.payment : []);
        setTimeout(() => {
            setIsLoaded(true);
        }, 1000);
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

export { JournalProvider, useJournal }; //eslint-disable-line
