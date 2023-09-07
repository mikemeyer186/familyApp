import { useState } from 'react';
import { updateListInFirestore } from '../../services/firestore';
import Item from './item';
import NewItemForm from './newItemForm';
import ListMenu from './listMenu';

export default function ItemList({ list, currentUser }) {
    const [sortBy, setSortBy] = useState('date');
    const [listItems, setListItems] = useState(list.list);
    const listID = list.id;
    const listTitle = list.title;
    let sortedItems;

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
            updateListInFirestore(list, listID, listTitle);
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
            updateListInFirestore(list, listID, listTitle);
            return list;
        });
    }

    function deleteItem(itemId) {
        setListItems((currentListItems) => {
            const list = currentListItems.filter((item) => item.id !== itemId);
            updateListInFirestore(list, listID, listTitle);
            return list;
        });
    }

    function clearList() {
        setListItems(() => {
            const list = [];
            updateListInFirestore(list, listID, listTitle);
            return list;
        });
    }

    if (sortBy === 'date') sortedItems = listItems;
    if (sortBy === 'category') sortedItems = listItems.slice().sort((a, b) => a.category.localeCompare(b.category));
    if (sortBy === 'done') sortedItems = listItems.slice().sort((a, b) => Number(a.done) - Number(b.done));
    if (sortBy === 'priority') sortedItems = listItems.slice().sort((a, b) => Number(b.priority) - Number(a.priority));

    return (
        <div className="container py-4 px-3 mx-auto listContainer">
            <h3 className="px-1 mb-3">{listTitle}</h3>
            <ListMenu clearList={clearList} />
            <NewItemForm addItem={addItem} />
            <div className="listHeader mb-2 mt-4">
                <span className="sortLabel">Sortierung nach: </span>
                <select value={sortBy} className="form-select sortOptions" onChange={(e) => setSortBy(e.target.value)}>
                    <option value="date">Datum</option>
                    <option value="category">Kategorie</option>
                    <option value="done">Erledigt</option>
                    <option value="priority">Priorität</option>
                </select>
            </div>
            <ul className="list-group">
                {sortedItems.length === 0 && <span className="px-1">Es sind keine Einträge vorhanden.</span>}
                {sortedItems.map((item) => {
                    return <Item item={item} listID={listID} key={item.id} updateItem={updateItem} deleteItem={deleteItem} />;
                })}
            </ul>
        </div>
    );
}
