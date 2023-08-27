import { useState } from 'react';
import NewItemForm from './newItemForm';
import ItemList from './itemList';

export default function ListPage() {
    const [listItems, setListItems] = useState([]);

    function addItem(title) {
        setListItems((currentListItems) => {
            return [
                ...currentListItems,
                {
                    id: crypto.randomUUID(),
                    title,
                    done: false,
                },
            ];
        });
    }

    function toggleItem(itemId, done) {
        setListItems((currentListItems) => {
            return currentListItems.map((item) => {
                if (item.id === itemId) {
                    return { ...item, done };
                }

                return item;
            });
        });
    }

    function deleteItem(itemId) {
        setListItems((currentListItems) => {
            return currentListItems.filter((item) => item.id !== itemId);
        });
    }

    return (
        <>
            <div className="container py-4 px-3 mx-auto">
                <NewItemForm onSubmit={addItem} />
                <h3 className="px-1 mb-2 mt-5">Einkaufsliste</h3>
                <ItemList listItems={listItems} toggleItem={toggleItem} deleteItem={deleteItem} />
            </div>
        </>
    );
}
