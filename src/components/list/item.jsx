export default function Item({ id, title, done, toggleItem, deleteItem }) {
    return (
        <li className="list-group-item d-flex justify-content-between align-items-center" key={id}>
            <label className="form-check-label stretched-link d-flex gap-2">
                <input className="form-check-input me-1" type="checkbox" defaultChecked={done} onChange={(e) => toggleItem(id, e.target.checked)} />
                {title}
            </label>
            <button type="button" className="btn btn-sm btn-outline-danger z-1" onClick={() => deleteItem(id)}>
                Entfernen
            </button>
        </li>
    );
}
