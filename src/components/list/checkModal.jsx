import { useList } from '../../contexts/listContext';

export default function CheckModal({ modalType, listID }) {
    const { clearList, deleteList } = useList();

    return (
        <div className="modal fade" id={`checkModal${listID}`} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">{modalType === 'clear' ? 'Liste löschen' : 'Liste leeren'}</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {modalType === 'clear' ? 'Möchtest du die Liste wirklich löschen?' : 'Möchtest du die Liste komplett leeren?'}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                            Abbrechen
                        </button>

                        {modalType === 'clear' ? (
                            <button type="button" className="btn btn-danger" onClick={() => deleteList(listID)} data-bs-dismiss="modal">
                                Liste löschen
                            </button>
                        ) : (
                            <button type="button" className="btn btn-danger" onClick={() => clearList(listID)} data-bs-dismiss="modal">
                                Liste leeren
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
