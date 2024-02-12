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
     * handles the check and uncheck of item
     */
    function handleStatusChange() {
        const itemChecked = !item.done;
        updateItem(item.id, itemChecked, item.amount, item.priority);
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
        <li className="list-group-item d-flex justify-content-between align-items-center item-clickable" key={item.id}>
            <div className="item-touch-area" onClick={handleStatusChange}></div>
            {!item.done && (
                <div className="item-priority iconClickable" onClick={handlePriorityChange}>
                    {item.priority ? <img src="/assets/icons/star-fill.svg" alt="Priority" /> : <img src="/assets/icons/star.svg" alt="Priority" />}
                </div>
            )}
            <label className="form-check-label d-flex gap-3 pointer centered-vertical label">
                <input id={item.id} className="checkbox me-1" type="checkbox" checked={item.done} readOnly />
                <div className="item-content-wrapper">
                    <div className="item-description">
                        <div className="item-info-badges">
                            <span className="badge rounded-pill category" style={{ backgroundColor: itemColor }}>
                                {item.category}
                            </span>
                            <div
                                src="/assets/icons/info-circle.svg"
                                alt="info"
                                tabIndex="0"
                                className="badge rounded-pill info-icon"
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

            <img src="/assets/icons/x-lg.svg" className="iconClickable z-1" alt="delete" onClick={() => deleteItem(item.id)} />
        </li>
    );
}
