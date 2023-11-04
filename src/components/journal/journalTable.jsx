import { useRef, useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

export default function JournalTable({ activeJournal }) {
    const dt = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const formatDate = (value) => {
        return new Date(value).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatCurrency = (value) => {
        let formattedValue = value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

        if (value < 0) {
            formattedValue = formattedValue.replace('-', '');
            return <span className="spend">{formattedValue}</span>;
        } else if (value > 0) {
            return <span className="income">{formattedValue}</span>;
        }
    };

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.date);
    };

    const amountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.amount);
    };

    const renderHeader = () => {
        return (
            <div className="d-flex justify-content-between">
                <span className="p-input-icon-left">
                    <img className="journal-search-icon" src="/assets/icons/search.svg" alt="Suche" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Suchen..." />
                </span>
                <Button
                    className="journal-csv-icon"
                    type="button"
                    onClick={() => exportCSV(false)}
                    tooltip="Als CSV exportieren"
                    tooltipOptions={{ position: 'left' }}
                >
                    <img src="/assets/icons/file-earmark-arrow-down.svg" alt="Exportieren" />
                </Button>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div className="journal-payments">
            {activeJournal ? (
                <DataTable
                    ref={dt}
                    value={activeJournal.payment}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    sortField="date"
                    sortOrder={-1}
                    filters={filters}
                    globalFilterFields={['date', 'category', 'amount']}
                    header={header}
                    style={{ width: '100%' }}
                    exportFilename={activeJournal.id}
                    emptyMessage="Keine Belege gefunden"
                >
                    <Column
                        field="date"
                        header="Datum"
                        dataType="date"
                        body={dateBodyTemplate}
                        sortable
                        style={{ width: '5%', textAlign: 'center' }}
                    ></Column>
                    <Column field="category" header="Kategorie" dataType="text" sortable style={{ width: '50%' }}></Column>
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
