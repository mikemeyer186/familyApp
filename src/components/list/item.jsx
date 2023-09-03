export default function Item({ item, toggleItem, deleteItem }) {
    return (
        <li className="list-group-item d-flex justify-content-between align-items-center itemClickable" key={item.id}>
            <label className="form-check-label stretched-link d-flex gap-3 pointer">
                <input
                    className="form-check-input me-1"
                    type="checkbox"
                    defaultChecked={item.done}
                    onChange={(e) => toggleItem(item.id, e.target.checked)}
                />
                <div className="itemDescription">
                    <span className={`badge rounded-pill category ${item.category}`}>{item.category}</span>
                    <span className="title">{item.title}</span>
                </div>
            </label>
            <img src="/assets/icons/x-lg.svg" className="iconClickable z-1" alt="delete" onClick={() => deleteItem(item.id)} />
        </li>
    );
}
