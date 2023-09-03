import { useState } from 'react';

export default function Item({ item, updateItem, deleteItem }) {
    const [amount, setAmount] = useState(item.amount);
    const date = new Date(item.date).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    function handleIncreaseAmount() {
        setAmount(amount + 1);
        updateItem(item.id, item.done, amount + 1);
    }

    function handleDecreaseAmount() {
        if (amount >= 2) {
            setAmount(amount - 1);
            updateItem(item.id, item.done, amount - 1);
        }
    }

    return (
        <li className="list-group-item d-flex justify-content-between align-items-center itemClickable" key={item.id}>
            <label className="form-check-label d-flex gap-3 pointer centeredVertical label">
                <input
                    className="checkbox me-1"
                    type="checkbox"
                    defaultChecked={item.done}
                    onChange={(e) => updateItem(item.id, e.target.checked, amount)}
                />
                <div className="itemContentWrapper">
                    <div className="itemDescription">
                        <span className={`badge rounded-pill category ${item.category}`}>{item.category}</span>
                        <span className={item.done ? 'line-through' : 'title'}>{item.title}</span>
                        <div className="itemSubDescription">
                            <span>Hinzugefügt von {item.user} </span>
                            <span>am {date}</span>
                        </div>
                    </div>
                </div>
            </label>
            <div className={item.done ? 'd-none' : 'itemAmount'}>
                <div className="amountAdjust">
                    <span>{amount}</span>
                    <div className="amountArrows">
                        <img className="arrow" src="/assets/icons/caret-up-fill.svg" alt="up" onClick={handleIncreaseAmount} />
                        <img
                            className={amount === 1 ? 'arrow-disabled' : 'arrow'}
                            src="/assets/icons/caret-down-fill.svg"
                            alt="down"
                            onClick={handleDecreaseAmount}
                        />
                    </div>
                </div>
            </div>

            <img src="/assets/icons/x-lg.svg" className="iconClickable z-1" alt="delete" onClick={() => deleteItem(item.id)} />
        </li>
    );
}
