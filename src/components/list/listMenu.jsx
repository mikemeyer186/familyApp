import { useState } from 'react';
import { useList } from '../../contexts/listContext';
import { useDialog } from '../../contexts/dialogContext';
import CheckModal from './checkModal';

export default function ListMenu({ list }) {
    const { setSelectedList } = useList();
    const { openDialog } = useDialog();
    const [modalType, setModalType] = useState('');

    /**
     * sets the selected list in listContext
     */
    function handleSetSelectedList() {
        setSelectedList(list);
    }

    return (
        <>
            <CheckModal modalType={modalType} listID={list.id} />

            <div className="dropdown listMenu">
                <img
                    src="/assets/icons/three-dots-vertical.svg"
                    className="dropdown-toggle menuIcon"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onClick={handleSetSelectedList}
                />
                <ul className="dropdown-menu">
                    <li>
                        <button
                            className="dropdown-item"
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target={`#checkModal${list.id}`}
                            onClick={() => setModalType('clean')}
                        >
                            Liste leeren
                        </button>
                        <button className="dropdown-item" type="button" onClick={() => openDialog('listEditRef')}>
                            Liste umbenennen
                        </button>
                        <button
                            className="dropdown-item"
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target={`#checkModal${list.id}`}
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
