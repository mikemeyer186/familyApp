import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useDialog } from '../../contexts/dialogContext';

export default function JournalTableHeader({ globalFilterValue, onGlobalFilterChange, exportCSV }) {
    const { openDialog } = useDialog();

    return (
        <div className="d-flex justify-content-between">
            <span className="p-input-icon-left">
                <img className="journal-search-icon" src="/assets/icons/search.svg" alt="Suche" />
                <InputText className="journal-searchbar" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Suchen..." />
            </span>
            <div className="journal-actions">
                <Button
                    className="journal-csv-icon"
                    type="button"
                    onClick={() => openDialog('journalTransferRef')}
                    tooltip="Fixkosten übertragen"
                    tooltipOptions={{ position: 'left' }}
                >
                    <img src="/assets/icons/journals.svg" alt="Übertragen" />
                </Button>
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
        </div>
    );
}
