import { useEffect, useState } from 'react';
import NewItemForm from './newItemForm';
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
                    prority: 'normal',
                },
            ];
            updateListInFirestore(list);
            return list;
        });
    }

    function updateItem(itemId, done, amount) {
        setListItems((currentListItems) => {
            const list = currentListItems.map((item) => {
                if (item.id === itemId) {
                    return { ...item, done, amount };
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

    return (
        <>
            <div className="container py-4 px-3 mx-auto">
                <NewItemForm addItem={addItem} />
                <h3 className="px-1 mb-2 mt-5">Einkaufsliste</h3>
                <ItemList listItems={listItems} updateItem={updateItem} deleteItem={deleteItem} />
            </div>
        </>
    );
}
