import { useEffect, useState } from 'react';
import { loadListsFromFirestore } from '../../services/firestore';
import { addListInFirestore } from '../../services/firestore';
import ItemList from './itemList';
import DialogNewList from './dialogNewList';

export default function ListPage() {
    const [currentUser] = useState('Mike');
    const [lists, setLists] = useState([]);

    useEffect(() => {
        getLists();
    }, []);

    async function getLists() {
        const lists = await loadListsFromFirestore();
        setLists(lists);
    }

    function addNewList(newListTitle) {
        const title = newListTitle;
        const id = crypto.randomUUID();
        const list = [];

        setLists((currentLists) => {
            const lists = [
                ...currentLists,
                {
                    id: id,
                    title: title,
                    list: list,
                },
            ];
            addListInFirestore(list, id, title);
            return lists;
        });
    }

    return (
        <>
            <DialogNewList addNewList={addNewList} />

            <button type="button" className="btn btn-secondary newList-button" data-bs-toggle="modal" data-bs-target="#newListModal">
                <span>Neue Liste</span>
                <img src="/assets/icons/file-earmark-plus-fill.svg" alt="New list" />
            </button>

            {lists.map((list) => {
                return <ItemList key={list.id} list={list} currentUser={currentUser} />;
            })}
        </>
    );
}
