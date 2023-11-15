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

    function onGlobalFilterChange(e) {
        const value = e.target.value;
        let filterValues = { ...filters };
        filterValues['global'].value = value;

        setFilters(filterValues);
        setGlobalFilterValue(value);
    }

    function exportCSV(selectionOnly) {
        dt.current.exportCSV({ selectionOnly });
    }

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

    function formatDate(value) {
        return new Date(value).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    function formatCurrency(amount) {
        const formattedAmount = amount.toString().replace('.', ',');
        return formattedAmount;
    }

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

    function onRowClickToggle(e) {
        if (expandedRows) {
            setExpandedRows(null);
        } else {
            setExpandedRows([e.data]);
        }
    }

    function tableHeader() {
        return <JournalTableHeader globalFilterValue={globalFilterValue} onGlobalFilterChange={onGlobalFilterChange} exportCSV={exportCSV} />;
    }

    function rowExpansionTemplate(data) {
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
                    sortField="date"
                    sortOrder={-1}
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
