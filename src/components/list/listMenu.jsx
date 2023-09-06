export default function ListMenu({ clearList }) {
    return (
        <div className="dropdown listMenu">
            <img
                src="/assets/icons/three-dots-vertical.svg"
                className="dropdown-toggle menuIcon"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            />
            <ul className="dropdown-menu">
                <li>
                    <button className="dropdown-item" type="button" onClick={clearList}>
                        Liste leeren
                    </button>
                </li>
                <li>
                    <button className="dropdown-item" type="button">
                        Aktion 2
                    </button>
                    <button className="dropdown-item" type="button">
                        Aktion 3
                    </button>
                </li>
            </ul>
        </div>
    );
}
