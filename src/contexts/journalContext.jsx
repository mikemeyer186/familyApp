import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { addPaymentInFirestore, updatePaymentInFirestore } from '../services/firestore';
import { useAlert } from './alertContext';
import { useUser } from './userContext';

const JournalContext = createContext();

function JournalProvider({ children }) {
    const date = new Date();
    const { familyID } = useUser();
    const { setSuccess } = useAlert();
    const [journals, setJournals] = useState([]);
    const [newActivePayment, setNewActivePayment] = useState([]);
    const [selectedYear, setSelectedYear] = useState(date.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(date.getMonth() + 1 < 10 && '0' + (date.getMonth() + 1));
    const [isJournalLoaded, setIsJournalLoaded] = useState(false);
    const [expansionData, setExpansionData] = useState({});
    const [expandedRows, setExpandedRows] = useState(null);
    const selectedJournalId = `${selectedYear}-${selectedMonth}`;
    const activeJournal = setJournalData();
    const activePayment = useMemo(() => (activeJournal ? activeJournal.payment : []), [activeJournal]);

    /**
     * filters the journals regarding the selected month and year
     * @returns - active journal of selected month and year
     */
    function setJournalData() {
        const filteredJournals = journals.filter((journal) => journal.id === `${selectedYear}-${selectedMonth}`);
        const filteredJournal = filteredJournals[0];
        return filteredJournal;
    }

    /**
     * adds new payment to firestore
     * @param {array} newPayment - new payment to add
     * @param {string} journalId - id of journal to add payment to (format: YYYY-MM)
     */
    async function addNewPayment(newPayment, journalId) {
        const payment = [newPayment, ...activePayment];
        await addPaymentInFirestore(familyID, payment, journalId);
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

        await updatePaymentInFirestore(familyID, newPayments, journalId);
    }

    /**
     * adds edited payment to firestore (other month or year is selected)
     * @param {array} newPayment - edited payment
     * @param {string} journalId - id of journal to add payment to (format: YYYY-MM)
     */
    async function addEditedPayment(newPayment, journalId) {
        const newPayments = [newPayment, ...newActivePayment];
        await addPaymentInFirestore(familyID, newPayments, journalId);
    }

    /**
     * deletes payment from firestore
     * @param {object} data - payment object from table row expansion
     */
    async function deletePayment(data) {
        const newPayments = activePayment.filter((payment) => payment.id !== data.id);
        await updatePaymentInFirestore(familyID, newPayments, activeJournal.id);
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

            return sum;
        },
        [activePayment]
    );

    /**
     * groups the payments by date
     * @param {Object} dailyPayments - active payments from selected month
     * @returns - grouped payments
     */
    const groupDailyPayments = useCallback(function groupDailyPayments(dailyPayments) {
        const groupedByDate = dailyPayments.reduce((acc, payment) => {
            const date = payment.date.slice(5, 10);
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(payment);
            return acc;
        }, {});
        return groupedByDate;
    }, []);

    /**
     * creates an object with dates and daily balances
     * @param {Object} groupedPayments - payments grouped by date
     * @returns - daily balances
     */
    const createBalanceArray = useCallback(function createBalanceArray(groupedPayments) {
        let balance = 0;
        const dailyBalances = {
            dates: [],
            balances: [],
        };

        Object.keys(groupedPayments)
            .sort()
            .forEach((date) => {
                groupedPayments[date].forEach((payment) => {
                    balance += payment.amount;
                });
                let convertedDate = date.split('-')[1];
                dailyBalances.dates.push(convertedDate);
                dailyBalances.balances.push(Number(balance.toFixed(2)));
            });

        dailyBalances.dates.unshift('');
        dailyBalances.balances.unshift(0);
        return dailyBalances;
    }, []);

    /**
     * creates an object with daily balances
     * @returns object with 2 arrays (dates and balances)
     */
    const filterDailyBalances = useCallback(
        function filterDailyBalances() {
            const dailyPayments = activePayment;
            const groupedPayments = groupDailyPayments(dailyPayments);
            const dailyBalances = createBalanceArray(groupedPayments);
            return dailyBalances;
        },
        [activePayment, groupDailyPayments, createBalanceArray]
    );

    const sumOfPayments = useMemo(() => sumPayments(), [sumPayments]);

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
                isJournalLoaded: isJournalLoaded,
                expansionData: expansionData,
                expandedRows: expandedRows,
                setSelectedYear,
                setSelectedMonth,
                setJournals,
                setIsJournalLoaded,
                addNewPayment,
                editPayment,
                addEditedPayment,
                setNewActivePayment,
                deletePayment,
                setExpansionData,
                setExpandedRows,
                filterDailyBalances,
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
