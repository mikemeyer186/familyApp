import { useState } from 'react';
import CheckModal from './checkModal';
import DialogEditList from './dialogEditList';

export default function ListMenu({ listID, listTitle, renameList, deleteList, clearList }) {
    const [modalType, setModalType] = useState('');

    return (
        <>
            <DialogEditList listID={listID} listTitle={listTitle} renameList={renameList} />
            <CheckModal clearList={clearList} deleteList={deleteList} modalType={modalType} listID={listID} />

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
                        <button
                            className="dropdown-item"
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target={`#checkModal${listID}`}
                            onClick={() => setModalType('clean')}
                        >
                            Liste leeren
                        </button>
                        <button className="dropdown-item" type="button" data-bs-toggle="modal" data-bs-target={`#editListModal${listID}`}>
                            Liste umbenennen
                        </button>
                        <button
                            className="dropdown-item"
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target={`#checkModal${listID}`}
                            onClick={() => setModalType('clear')}
                        >
                            Liste löschen
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
}
