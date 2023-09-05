import { useState } from 'react';
import Item from './item';
import NewItemForm from './newItemForm';

export default function ItemList({ listItems, updateItem, deleteItem, addItem }) {
    const [sortBy, setSortBy] = useState('date');

    let sortedItems;

    if (sortBy === 'date') sortedItems = listItems;
    if (sortBy === 'category') sortedItems = listItems.slice().sort((a, b) => a.category.localeCompare(b.category));
    if (sortBy === 'done') sortedItems = listItems.slice().sort((a, b) => Number(a.done) - Number(b.done));
    if (sortBy === 'priority') sortedItems = listItems.slice().sort((a, b) => Number(b.priority) - Number(a.priority));

    return (
        <div className="container py-4 px-3 mx-auto">
            <NewItemForm addItem={addItem} />
            <div className="listHeader">
                <h3 className="px-1 mb-2 mt-5">Einkaufsliste</h3>
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
                    return <Item item={item} key={item.id} updateItem={updateItem} deleteItem={deleteItem} />;
                })}
            </ul>
        </div>
    );
}
