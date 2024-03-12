import { useList } from '../../contexts/listContext';
import { useDialog } from '../../contexts/dialogContext';

export default function ListMenu({ list }) {
    const { setSelectedList, setModalType } = useList();
    const { openDialog } = useDialog();

    /**
     * sets the selected list in listContext
     */
    function handleSetSelectedList() {
        setSelectedList(list);
    }

    /**
     * opens the clear list dialog and sets the modal ttype to "clear"
     */
    function handleOpenClearDialog() {
        setModalType('clear');
        openDialog('listDeleteRef');
    }

    /**
     * opens the delete dialog and sets the modal type to "delete"
     */
    function handleOpenDeleteDialog() {
        setModalType('delete');
        openDialog('listDeleteRef');
    }

    return (
        <div className="dropdown list-menu">
            <img
                src="/assets/icons/three-dots-vertical.svg"
                className="dropdown-toggle menu-icon"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={handleSetSelectedList}
            />
            <ul className="dropdown-menu">
                <li>
                    <button
                        className={`dropdown-item ${list.list.length === 0 ? 'not-allowed' : ''}`}
                        type="button"
                        onClick={handleOpenClearDialog}
                        disabled={list.list.length === 0}
                    >
                        Liste leeren
                    </button>
                    <button className="dropdown-item" type="button" onClick={() => openDialog('listEditRef')}>
                        Liste umbenennen
                    </button>
                    <button className="dropdown-item" type="button" onClick={handleOpenDeleteDialog}>
                        Liste löschen
                    </button>
                </li>
            </ul>
        </div>
    );
}
