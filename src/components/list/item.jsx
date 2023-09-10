import { useEffect, useState } from 'react';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Item({ item, updateItem, deleteItem }) {
    const [amount, setAmount] = useState(item.amount);
    const date = new Date(item.date).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
    const time = new Date(item.date).toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
    });

    function handleIncreaseAmount() {
        setAmount(amount + 1);
        updateItem(item.id, item.done, amount + 1, item.priority);
    }

    function handleDecreaseAmount() {
        if (amount >= 2) {
            setAmount(amount - 1);
            updateItem(item.id, item.done, amount - 1, item.priority);
        }
    }

    function handlePriorityChange() {
        item.priority = !item.priority;
        updateItem(item.id, item.done, amount, item.priority);
    }

    useEffect(() => {
        const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
        [...popoverTriggerList].map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl));
    }, []);

    return (
        <li className="list-group-item d-flex justify-content-between align-items-center itemClickable" key={item.id}>
            <div className={`itemPriority ${item.priority && 'red'}`} onClick={handlePriorityChange}></div>
            <label className="form-check-label d-flex gap-3 pointer centeredVertical label">
                <input
                    className="checkbox me-1"
                    type="checkbox"
                    defaultChecked={item.done}
                    onChange={(e) => updateItem(item.id, e.target.checked, amount, item.priority)}
                />
                <div className="itemContentWrapper">
                    <div className="itemDescription">
                        <div className="itemInfoBadges">
                            <span className={`badge rounded-pill category ${item.category}`}>{item.category}</span>
                            <div
                                src="/assets/icons/info-circle.svg"
                                alt="info"
                                tabIndex="0"
                                className="badge rounded-pill infoIcon"
                                role="button"
                                data-bs-container="body"
                                data-bs-html="true"
                                data-bs-toggle="popover"
                                data-bs-trigger="hover"
                                data-bs-title="Info"
                                data-bs-content={`Hinzugefügt von ${item.user} <br/> am ${date} um ${time} Uhr`}
                            >
                                Info
                            </div>
                        </div>
                        <span className={item.done ? 'line-through' : 'title'}>{item.title}</span>
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
