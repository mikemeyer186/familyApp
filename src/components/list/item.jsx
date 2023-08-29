export default function Item({ id, title, done, toggleItem, deleteItem }) {
    return (
        <li className="list-group-item d-flex justify-content-between align-items-center itemClickable" key={id}>
            <label className="form-check-label stretched-link d-flex gap-2 pointer">
                <input className="form-check-input me-1" type="checkbox" defaultChecked={done} onChange={(e) => toggleItem(id, e.target.checked)} />
                {title}
            </label>
            <img src="/assets/icons/x-lg.svg" className="iconClickable z-1" alt="delete" onClick={() => deleteItem(id)} />
        </li>
    );
}
