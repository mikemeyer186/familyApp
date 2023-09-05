import { useEffect, useState } from 'react';
import ItemList from './itemList';
import loadListsFromFirestore from '../../services/firestore';
import { updateListInFirestore } from '../../services/firestore';

export default function ListPage() {
    const [currentUser] = useState('Mike');
    const [listItems, setListItems] = useState([]);

    useEffect(() => {
        getListItems();
    }, []);

    async function getListItems() {
        const listItems = await loadListsFromFirestore();
        setListItems(listItems);
    }

    function addItem(title, category) {
        setListItems((currentListItems) => {
            const list = [
                ...currentListItems,
                {
                    id: crypto.randomUUID(),
                    title: title,
                    done: false,
                    user: currentUser,
                    date: new Date().toISOString(),
                    category: category === 'Kategorie' ? 'Sonstiges' : category,
                    amount: 1,
                    priority: false,
                },
            ];
            updateListInFirestore(list);
            return list;
        });
    }

    function updateItem(itemId, done, amount, priority) {
        setListItems((currentListItems) => {
            const list = currentListItems.map((item) => {
                if (item.id === itemId) {
                    return { ...item, done, amount, priority };
                }
                return item;
            });
            updateListInFirestore(list);
            return list;
        });
    }

    function deleteItem(itemId) {
        setListItems((currentListItems) => {
            const list = currentListItems.filter((item) => item.id !== itemId);
            updateListInFirestore(list);
            return list;
        });
    }

    return <ItemList listItems={listItems} updateItem={updateItem} deleteItem={deleteItem} addItem={addItem} />;
}
