import { useState } from 'react';
import { updateListInFirestore } from '../../services/firestore';
import { useUser } from '../../contexts/userContext';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Item from './item';
import NewItemForm from './newItemForm';
import ListMenu from './listMenu';
import ListHeader from './listHeader';

export default function ItemList({ list }) {
    const { activeUser, familyID } = useUser();
    const [itemParent] = useAutoAnimate({ duration: 150, easing: 'ease-in' });
    const [sortBy, setSortBy] = useState('Datum');
    const listItems = list.list;
    const listTitle = list.title;
    const listID = list.id;
    const sortCategories = ['Datum', 'Kategorie', 'Erledigt', 'Priorität'];
    let sortedItems;

    /**
     * adds new item to list
     * @param {string} title - title of new item
     * @param {string} category - category of new item
     */
    function addItem(title, category) {
        const list = [
            ...listItems,
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

        updateListInFirestore(familyID, list, listID, listTitle);
    }

    /**
     * updates item in list (done, amount, priority)
     * @param {string} itemId - id of item to update
     * @param {boolean} done - done state of item
     * @param {number} amount - amount of item
     * @param {boolean} priority - priority state of item
     */
    function updateItem(itemId, done, amount, priority) {
        const list = listItems.map((item) => {
            if (item.id === itemId) {
                return { ...item, done, amount, priority };
            }
            return item;
        });

        updateListInFirestore(familyID, list, listID, listTitle);
    }

    /**
     * deletes item from list
     * @param {string} itemId - id of item to delete
     */
    function deleteItem(itemId) {
        const list = listItems.filter((item) => item.id !== itemId);
        updateListInFirestore(familyID, list, listID, listTitle);
    }

    /**
     * handles sorting of list items
     * @param {string} category - category to sort by (date, category, done, priority)
     */
    function handleSorting(category) {
        setSortBy(category);
    }

    if (sortBy === 'Datum') sortedItems = listItems.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === 'Kategorie') sortedItems = listItems.slice().sort((a, b) => a.category.localeCompare(b.category));
    if (sortBy === 'Erledigt') sortedItems = listItems.slice().sort((a, b) => Number(a.done) - Number(b.done));
    if (sortBy === 'Priorität') sortedItems = listItems.slice().sort((a, b) => Number(b.priority) - Number(a.priority));

    return (
        <div className="container py-4 px-3 mx-auto list-container">
            <h3 className="px-1 mb-3">{listTitle}</h3>

            <ListMenu list={list} />
            <NewItemForm addItem={addItem} />

            <ListHeader sortBy={sortBy} sortCategories={sortCategories} handleSorting={handleSorting} />

            <ul ref={itemParent} className="list-group">
                {sortedItems.length === 0 && <span className="px-1 text-center mt-3">Es sind noch keine Einträge vorhanden</span>}
                {sortedItems.map((item) => {
                    return <Item key={item.id} item={item} listID={listID} updateItem={updateItem} deleteItem={deleteItem} />;
                })}
            </ul>
        </div>
    );
}
