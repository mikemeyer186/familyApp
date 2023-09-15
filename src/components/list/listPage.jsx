import { useEffect, useState } from 'react';
import { loadListsFromFirestore } from '../../services/firestore';
import { addListInFirestore } from '../../services/firestore';
import { deleteListInFirestore } from '../../services/firestore';
import ItemList from './itemList';
import DialogNewList from './dialogNewList';
import ListToolbar from './listToolbar';
import Spinner from '../global/spinner';

export default function ListPage() {
    const [currentUser] = useState('Mike');
    const [lists, setLists] = useState([]);
    const [sortBy, setSortBy] = useState('Datum');
    const [isLoaded, setIsLoaded] = useState(false);
    const sortCategories = ['Datum', 'Alphabet'];
    let sortedLists;

    useEffect(() => {
        getLists().then(() => {
            setIsLoaded(true);
        });
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

            <div className="listPage-wrapper">
                <div className="listToolbar">
                    <ListToolbar sortBy={sortBy} sortCategories={sortCategories} handleSorting={handleSorting} />
                </div>

                {!isLoaded ? (
                    <Spinner />
                ) : (
                    <div className="listCollection">
                        {sortedLists.length == 0 ? (
                            <span className="emptyListCollection">
                                Es sind gerade keine Listen gespeichert. Du kannst eine neue Liste hinzufügen, indem du auf den Button &quot;Neue
                                Liste&quot; klickst.
                            </span>
                        ) : (
                            sortedLists.map((list) => {
                                return <ItemList key={list.id} list={list} currentUser={currentUser} deleteList={deleteList} />;
                            })
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
