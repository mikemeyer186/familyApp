import { useRef, useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useJournal } from '../../contexts/journalContext';
import JournalTableHeader from './journalTableHeader';
import JournalTableExpansion from './journalTableExpansion';

export default function JournalTable() {
    const { activeJournal } = useJournal();
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [expandedRows, setExpandedRows] = useState(null);
    const dt = useRef(null);
    const formattedPayments = formatPaymentData(activeJournal ? activeJournal.payment : []);

    /**
     * handle global filter change
     * @param {event} e - event from filter change
     */
    function onGlobalFilterChange(e) {
        const value = e.target.value;
        let filterValues = { ...filters };
        filterValues['global'].value = value;

        setFilters(filterValues);
        setGlobalFilterValue(value);
    }

    /**
     * handle journal export as csv file
     * @param {boolean} selectionOnly - false (all data should be exported)
     */
    function exportCSV(selectionOnly) {
        dt.current.exportCSV({ selectionOnly });
    }

    /**
     * format payment data for table
     * @param {array} payments - array of payments
     * @returns
     */
    function formatPaymentData(payments) {
        const formattedPayments = payments.map((payment) => {
            const formattedPayment = {
                month: payment.month,
                info: payment.info,
                aggregate: payment.aggregate,
                date: formatDate(payment.date),
                category: payment.category,
                flow: payment.flow,
                amount: formatCurrency(payment.amount),
                year: payment.year,
                user: payment.user,
                id: payment.id,
            };
            return formattedPayment;
        });
        return formattedPayments;
    }

    /**
     * formats the date to locale string
     * @param {string} value - date value as ISO string
     * @returns
     */
    function formatDate(value) {
        return new Date(value).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    /**
     * formats the amount to locale string and replaces dot with comma
     * @param {number} amount - amount value
     * @returns
     */
    function formatCurrency(amount) {
        const formattedAmount = amount.toString().replace('.', ',');
        return formattedAmount;
    }

    /**
     * template for amount column in table
     * @param {object} rowData - data of selected row in table
     * @returns
     */
    function amountBodyTemplate(rowData) {
        const amount = rowData.amount.toString().replace(',', '.');
        const amountNumber = parseFloat(amount);
        let amountString = amountNumber.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

        if (amountNumber < 0) {
            amountString = amountString.replace('-', '');
            return <span className="spend">{amountString}</span>;
        } else if (amountNumber > 0) {
            return <span className="income">{amountString}</span>;
        }
    }

    /**
     * sets the expanded rows to null if there are expanded rows (closes expanded row)
     * otherwise it sets the expanded rows to the selected row data (opens expanded row)
     * @param {event} e - event from row click
     */
    function onRowClickToggle(e) {
        if (expandedRows) {
            setExpandedRows(null);
        } else {
            setExpandedRows([e.data]);
        }
    }

    /**
     * template for table header
     * @returns html template for table header
     */
    function tableHeader() {
        return <JournalTableHeader globalFilterValue={globalFilterValue} onGlobalFilterChange={onGlobalFilterChange} exportCSV={exportCSV} />;
    }

    /**
     * template for expanded row
     * @param {object} data - data of selected row in table
     * @returns
     */
    function rowExpansionTemplate(data) {
        console.log(data);
        return <JournalTableExpansion data={data} setExpandedRows={setExpandedRows} />;
    }

    return (
        <div className="journal-payments">
            {activeJournal ? (
                <DataTable
                    ref={dt}
                    value={formattedPayments}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    pageLinkSize={3}
                    removableSort
                    filters={filters}
                    globalFilterFields={['date', 'category', 'amount', 'aggregate', 'info', 'user', 'flow']}
                    header={tableHeader}
                    style={{ width: '100%', cursor: 'pointer' }}
                    exportFilename={activeJournal.id}
                    emptyMessage="Keine Belege gefunden"
                    onRowClick={(e) => onRowClickToggle(e)}
                    expandedRows={expandedRows}
                    rowExpansionTemplate={rowExpansionTemplate}
                >
                    <Column field="date" header="Datum" dataType="date" sortable style={{ width: '5%', textAlign: 'center' }}></Column>
                    <Column field="user" header="User" dataType="text" style={{ display: 'none' }}></Column>
                    <Column field="aggregate" header="Zuordnung" dataType="text" style={{ display: 'none' }}></Column>
                    <Column field="category" header="Kategorie" dataType="text" sortable style={{ width: '50%' }}></Column>
                    <Column field="info" header="Info" dataType="text" style={{ display: 'none' }}></Column>
                    <Column
                        field="amount"
                        header="Betrag"
                        dataType="numeric"
                        body={amountBodyTemplate}
                        sortable
                        style={{ width: '5%', textAlign: 'right' }}
                    ></Column>
                </DataTable>
            ) : (
                <div className="journal-payment__date">Es wurden noch keine Belege gebucht</div>
            )}
        </div>
    );
}
