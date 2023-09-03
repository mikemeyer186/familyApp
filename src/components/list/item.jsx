export default function Item({ item, toggleItem, deleteItem }) {
    const date = new Date(item.date).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    return (
        <li className="list-group-item d-flex justify-content-between align-items-center itemClickable" key={item.id}>
            <label className="form-check-label stretched-link d-flex gap-3 pointer centered">
                <input className="checkbox me-1" type="checkbox" defaultChecked={item.done} onChange={(e) => toggleItem(item.id, e.target.checked)} />
                <div className="itemDescription">
                    <span className={`badge rounded-pill category ${item.category}`}>{item.category}</span>
                    <span className={item.done ? 'line-through' : 'title'}>{item.title}</span>
                    <div className="itemSubDescription">
                        <span>Hinzugefügt von {item.user} </span>
                        <span>am {date}</span>
                    </div>
                </div>
            </label>
            <img src="/assets/icons/x-lg.svg" className="iconClickable z-1" alt="delete" onClick={() => deleteItem(item.id)} />
        </li>
    );
}
