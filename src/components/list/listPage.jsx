import { useEffect, useState } from 'react';
import { loadListsFromFirestore } from '../../services/firestore';
import { addListInFirestore } from '../../services/firestore';
import { deleteListInFirestore } from '../../services/firestore';
import ItemList from './itemList';
import DialogNewList from './dialogNewList';

export default function ListPage() {
    const [currentUser] = useState('Mike');
    const [lists, setLists] = useState([]);
    const [sortBy, setSortBy] = useState('Datum');
    const sortCategories = ['Datum', 'Alphabet'];
    let sortedLists;

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
        const date = new Date().toISOString();
        const list = [];

        setLists((currentLists) => {
            const lists = [
                ...currentLists,
                {
                    id: id,
                    title: title,
                    list: list,
                    date: date,
                },
            ];
            addListInFirestore(list, id, title, date);
            return lists;
        });
    }

    function deleteList(listId) {
        setLists((currentLists) => {
            const lists = currentLists.filter((list) => list.id !== listId);
            deleteListInFirestore(listId);
            return lists;
        });
    }

    function handleSorting(category) {
        setSortBy(category);
    }
    if (sortBy === 'Alphabet') sortedLists = lists.slice().sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === 'Datum') sortedLists = lists.slice().sort((a, b) => Number(a.date) - Number(b.date));

    return (
        <>
            <DialogNewList addNewList={addNewList} />

            <button type="button" className="btn btn-secondary newList-button" data-bs-toggle="modal" data-bs-target="#newListModal">
                <span>Neue Liste</span>
                <img src="/assets/icons/file-earmark-plus-fill.svg" alt="New list" />
            </button>

            <button className="btn dropdown-toggle btn-secondary sortList-button" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {sortBy}
                {sortBy === 'Datum' ? (
                    <img src="/assets/icons/sort-numeric-down.svg" alt="Sort by date" />
                ) : (
                    <img src="/assets/icons/sort-alpha-down.svg" alt="Sort alphabetically" />
                )}
            </button>

            <ul className="dropdown-menu">
                {sortCategories.map((category) => {
                    return (
                        <li key={category} onClick={() => handleSorting(category)}>
                            <span className="dropdown-item pointer">{category}</span>
                        </li>
                    );
                })}
            </ul>

            {sortedLists.map((list) => {
                return <ItemList key={list.id} list={list} currentUser={currentUser} deleteList={deleteList} />;
            })}
        </>
    );
}
