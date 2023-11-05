import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

export default function JournalTableHeader({ globalFilterValue, onGlobalFilterChange, exportCSV }) {
    return (
        <div className="d-flex justify-content-between">
            <span className="p-input-icon-left">
                <img className="journal-search-icon" src="/assets/icons/search.svg" alt="Suche" />
                <InputText className="journal-searchbar" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Suchen..." />
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
}
