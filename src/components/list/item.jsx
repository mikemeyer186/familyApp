import { useEffect } from 'react';
import { Popover } from 'bootstrap';
import { useUser } from '../../contexts/userContext';

export default function Item({ item, updateItem, deleteItem }) {
    const { appSettings } = useUser();
    const itemCategory = appSettings.list.find((category) => category.category === item.category);
    const itemColor = itemCategory ? itemCategory.color : '#6d767e';

    const date = new Date(item.date).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
    const time = new Date(item.date).toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
    });

    /**
     * handles increase of amount of item
     */
    function handleIncreaseAmount() {
        updateItem(item.id, item.done, item.amount + 1, item.priority);
    }

    /**
     * handles decrease of amount of item
     */
    function handleDecreaseAmount() {
        if (item.amount >= 2) {
            updateItem(item.id, item.done, item.amount - 1, item.priority);
        }
    }

    /**
     * handles change of priority of item
     */
    function handlePriorityChange() {
        item.priority = !item.priority;
        updateItem(item.id, item.done, item.amount, item.priority);
    }

    /**
     * initializes popover for info icon
     */
    useEffect(() => {
        const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
        [...popoverTriggerList].map((popoverTriggerEl) => new Popover(popoverTriggerEl));
    }, []);

    return (
        <li className="list-group-item d-flex justify-content-between align-items-center itemClickable" key={item.id}>
            <div className={`itemPriority ${item.priority && 'red'}`} onClick={handlePriorityChange}></div>
            <label className="form-check-label d-flex gap-3 pointer centeredVertical label">
                <input
                    className="checkbox me-1"
                    type="checkbox"
                    checked={item.done}
                    onChange={(e) => updateItem(item.id, e.target.checked, item.amount, item.priority)}
                />
                <div className="itemContentWrapper">
                    <div className="itemDescription">
                        <div className="itemInfoBadges">
                            <span className="badge rounded-pill category" style={{ backgroundColor: itemColor }}>
                                {item.category}
                            </span>
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
                    <div className="amountArrows">
                        <img className="arrow" src="/assets/icons/caret-up-fill.svg" alt="up" onClick={handleIncreaseAmount} />
                        <div className="amountNumber">{item.amount}</div>
                        <img
                            className={item.amount === 1 ? 'arrow-disabled arrow-down' : 'arrow'}
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
