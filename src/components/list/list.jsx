export default function List() {
    return (
        <>
            <div className="container py-4 px-3 mx-auto">
                <label className="px-1 mb-2" htmlFor="newListItemInput">
                    Der Einkaufsliste hinzufügen:
                </label>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Schreib etwas..."
                        aria-label="Shoppping list item"
                        aria-describedby="button-addon2"
                        id="newListItemInput"
                    />
                    <button className="btn btn-primary" type="button" id="addListItemButton">
                        Hinzufügen
                    </button>
                </div>
            </div>
            <div className="container py-4 px-3 mx-auto">
                <h3 className="px-1 mb-2">Einkaufsliste</h3>
                <ul className="list-group">
                    <li className="list-group-item">
                        <label className="form-check-label stretched-link">
                            <input className="form-check-input me-1" type="checkbox" />
                            First Item
                        </label>
                    </li>
                    <li className="list-group-item">
                        <label className="form-check-label stretched-link">
                            <input className="form-check-input me-1" type="checkbox" />
                            Second Item
                        </label>
                    </li>
                    <li className="list-group-item">
                        <label className="form-check-label stretched-link">
                            <input className="form-check-input me-1" type="checkbox" />
                            Third Item
                        </label>
                    </li>
                </ul>
            </div>
        </>
    );
}
