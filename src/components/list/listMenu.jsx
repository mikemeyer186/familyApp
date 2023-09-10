import DialogEditList from './dialogEditList';

export default function ListMenu({ listID, listTitle, clearList, renameList, deleteList }) {
    return (
        <>
            <DialogEditList listID={listID} listTitle={listTitle} renameList={renameList} />

            <div className="dropdown listMenu">
                <img
                    src="/assets/icons/three-dots-vertical.svg"
                    className="dropdown-toggle menuIcon"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                />
                <ul className="dropdown-menu">
                    <li>
                        <button className="dropdown-item" type="button" onClick={clearList}>
                            Liste leeren
                        </button>
                        <button className="dropdown-item" type="button" data-bs-toggle="modal" data-bs-target={`#editListModal${listID}`}>
                            Liste umbenennen
                        </button>
                        <button className="dropdown-item" type="button" onClick={() => deleteList(listID)}>
                            Liste löschen
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
}
