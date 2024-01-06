import { useEffect, useState } from 'react';
import { updateListInFirestore } from '../../services/firestore';
import { useUser } from '../../contexts/userContext';
import Item from './item';
import NewItemForm from './newItemForm';
import ListMenu from './listMenu';
import ListHeader from './listHeader';

export default function ItemList({ list }) {
    const { activeUser } = useUser();
    const [sortBy, setSortBy] = useState('Datum');
    const [listItems, setListItems] = useState(list.list);
    const [listTitle, setListTitle] = useState(list.title);
    const listID = list.id;
    const sortCategories = ['Datum', 'Kategorie', 'Erledigt', 'Priorität'];
    let sortedItems;

    /**
     * adds new item to list
     * @param {string} title - title of new item
     * @param {string} category - category of new item
     */
    function addItem(title, category) {
        setListItems((currentListItems) => {
            const list = [
                ...currentListItems,
                {
                    id: crypto.randomUUID(),
                    title: title,
                    done: false,
                    user: activeUser.displayName,
                    date: new Date().toISOString(),
                    category: category === 'Kategorie' ? 'Sonstiges' : category,
                    amount: 1,
                    priority: false,
                },
            ];
            updateListInFirestore(list, listID, listTitle);
            return list;
        });
    }

    /**
     * updates item in list (done, amount, priority)
     * @param {string} itemId - id of item to update
     * @param {boolean} done - done state of item
     * @param {number} amount - amount of item
     * @param {boolean} priority - priority state of item
     */
    function updateItem(itemId, done, amount, priority) {
        setListItems((currentListItems) => {
            const list = currentListItems.map((item) => {
                if (item.id === itemId) {
                    return { ...item, done, amount, priority };
                }
                return item;
            });
            updateListInFirestore(list, listID, listTitle);
            return list;
        });
    }

    /**
     * deletes item from list
     * @param {string} itemId - id of item to delete
     */
    function deleteItem(itemId) {
        setListItems((currentListItems) => {
            const list = currentListItems.filter((item) => item.id !== itemId);
            updateListInFirestore(list, listID, listTitle);
            return list;
        });
    }

    /**
     * handles sorting of list items
     * @param {string} category - category to sort by (date, category, done, priority)
     */
    function handleSorting(category) {
        setSortBy(category);
    }

    /**
     * sets list items and title from list context when list changes
     */
    useEffect(() => {
        setListItems(list.list);
        setListTitle(list.title);
    }, [list]);

    if (sortBy === 'Datum') sortedItems = listItems;
    if (sortBy === 'Kategorie') sortedItems = listItems.slice().sort((a, b) => a.category.localeCompare(b.category));
    if (sortBy === 'Erledigt') sortedItems = listItems.slice().sort((a, b) => Number(a.done) - Number(b.done));
    if (sortBy === 'Priorität') sortedItems = listItems.slice().sort((a, b) => Number(b.priority) - Number(a.priority));

    return (
        <div className="container py-4 px-3 mx-auto listContainer">
            <h3 className="px-1 mb-3">{listTitle}</h3>

            <ListMenu list={list} />
            <NewItemForm addItem={addItem} />

            <ListHeader sortBy={sortBy} sortCategories={sortCategories} handleSorting={handleSorting} />

            <ul className="list-group">
                {sortedItems.length === 0 && <span className="px-1">Es sind keine Einträge vorhanden.</span>}
                {sortedItems.map((item) => {
                    return <Item item={item} listID={listID} key={item.id} updateItem={updateItem} deleteItem={deleteItem} />;
                })}
            </ul>
        </div>
    );
}
