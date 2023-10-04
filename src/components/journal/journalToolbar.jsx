export default function JournalToolbar() {
    return (
        <>
            <button type="button" className="btn btn-secondary newData-button" data-bs-toggle="modal" data-bs-target="#newJournalData">
                <span>Neuer Beleg</span>
                <img src="/assets/icons/file-earmark-plus-fill.svg" alt="New data" />
            </button>
        </>
    );
}
