import { useRef, useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useJournal } from '../../contexts/journalContext';
import JournalTableHeader from './journalTableHeader';
import JournalTableExpansion from './journalTableExpansion';

export default function JournalTable() {
    const { activeJournal, expandedRows, setExpansionData, setExpandedRows } = useJournal();
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const dt = useRef(null);
    const formattedPayments = formatPaymentData(activeJournal ? activeJournal.payment : []);

    /**
     * handles global filter change
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
     * handles journal export as csv file
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
     * toggles the expanded rows on click on a table row
     * @param {event} e - event from row click
     */
    function onRowClickToggle(e) {
        if (expandedRows && e.data.id === expandedRows[0].id) {
            setExpandedRows(null);
        } else {
            setExpansionData(e.data);
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
    function rowExpansionTemplate() {
        return <JournalTableExpansion />;
    }

    return (
        <div className="journal-table journal-tile">
            <h3 className="journal-title">Belege</h3>

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
                    sortField="date"
                    sortOrder={-1}
                    header={tableHeader}
                    style={{ width: '100%', cursor: 'pointer' }}
                    exportFilename={activeJournal.id}
                    emptyMessage="Keine Belege in diesem Monat vorhanden"
                    onRowClick={(e) => onRowClickToggle(e)}
                    expandedRows={expandedRows}
                    rowExpansionTemplate={rowExpansionTemplate}
                >
                    <Column
                        field="date"
                        header="Datum"
                        dataType="date"
                        sortable
                        style={{ minWidth: '30%', width: '30%', textAlign: 'start' }}
                    ></Column>
                    <Column field="user" header="User" dataType="text" style={{ display: 'none' }}></Column>
                    <Column field="aggregate" header="Zuordnung" dataType="text" style={{ display: 'none' }}></Column>
                    <Column field="category" header="Kategorie" dataType="text" sortable style={{ minWidth: '49%', width: '49%' }}></Column>
                    <Column field="info" header="Info" dataType="text" style={{ display: 'none' }}></Column>
                    <Column
                        field="amount"
                        header="Betrag"
                        dataType="numeric"
                        body={amountBodyTemplate}
                        sortable
                        style={{ minWidth: '15%', width: '15%', textAlign: 'right' }}
                    ></Column>
                </DataTable>
            ) : (
                <div className="journal-payments-empty">Es wurden noch keine Belege gebucht</div>
            )}
        </div>
    );
}
