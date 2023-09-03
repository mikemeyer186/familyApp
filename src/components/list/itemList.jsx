import Item from './item';

export default function ItemList({ listItems, updateItem, deleteItem }) {
    return (
        <ul className="list-group">
            {listItems.length === 0 && <span className="px-1">Es sind keine Einträge vorhanden.</span>}
            {listItems.map((item) => {
                return <Item item={item} key={item.id} updateItem={updateItem} deleteItem={deleteItem} />;
            })}
        </ul>
    );
}
