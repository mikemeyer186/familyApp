import Item from './item';
import NewItemForm from './newItemForm';

export default function ItemList({ listItems, updateItem, deleteItem, addItem, sortItems }) {
    function handleSorting() {
        sortItems();
    }

    return (
        <div className="container py-4 px-3 mx-auto">
            <NewItemForm addItem={addItem} />
            <div className="listHeader">
                <h3 className="px-1 mb-2 mt-5">Einkaufsliste</h3>
                <div className="btn-group">
                    <button className="btn btn-secondary btn-sm dropdown-toggle mb-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Sortierung
                    </button>
                    <ul className="dropdown-menu">
                        <li className="dropdown-item pointer" onClick={handleSorting}>
                            Alphabet
                        </li>
                        <li className="dropdown-item pointer">Kategorie</li>
                        <li className="dropdown-item pointer">Datum</li>
                        <li className="dropdown-item pointer">Priorität</li>
                        <li className="dropdown-item pointer">Ersteller</li>
                    </ul>
                </div>
            </div>
            <ul className="list-group">
                {listItems.length === 0 && <span className="px-1">Es sind keine Einträge vorhanden.</span>}
                {listItems.map((item) => {
                    return <Item item={item} key={item.id} updateItem={updateItem} deleteItem={deleteItem} />;
                })}
            </ul>
        </div>
    );
}
