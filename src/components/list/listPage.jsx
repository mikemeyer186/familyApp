import { useEffect, useState } from 'react';
import { loadListsFromFirestore } from '../../services/firestore';
import { addListInFirestore } from '../../services/firestore';
import ItemList from './itemList';

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

    function addNewList() {
        const title = prompt('Wie soll die neue Liste heißen?');
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
            <button type="button" className="btn btn-primary" onClick={addNewList}>
                Neu
            </button>
            {lists.map((list) => {
                return <ItemList key={list.id} list={list} currentUser={currentUser} />;
            })}
        </>
    );
}
