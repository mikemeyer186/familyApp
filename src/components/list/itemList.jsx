import Item from './item';

export default function ItemList({ listItems, toggleItem, deleteItem }) {
    return (
        <ul className="list-group">
            {listItems.length === 0 && <span className="px-1">Es sind keine Einträge vorhanden.</span>}
            {listItems.map((item) => {
                return <Item {...item} key={item.id} toggleItem={toggleItem} deleteItem={deleteItem} />;
            })}
        </ul>
    );
}
