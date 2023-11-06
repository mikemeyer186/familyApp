import { useRef, useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import JournalTableHeader from './journalTableHeader';

export default function JournalTable({ activeJournal }) {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const dt = useRef(null);
    const formattedPayments = formatPaymentData(activeJournal ? activeJournal.payment : []);

    function onGlobalFilterChange(e) {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
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

    function tableHeader() {
        return <JournalTableHeader globalFilterValue={globalFilterValue} onGlobalFilterChange={onGlobalFilterChange} exportCSV={exportCSV} />;
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
                    style={{ width: '100%' }}
                    exportFilename={activeJournal.id}
                    emptyMessage="Keine Belege gefunden"
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
