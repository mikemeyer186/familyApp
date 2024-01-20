export default function ListsTile({ importantItems, navigateToPage }) {
    return (
        <div className="dashboard-tile" onClick={() => navigateToPage('/app/lists?page=Listen')}>
            <h4 className="tile-title">Wichtige Einkäufe</h4>
            {importantItems.length > 0 ? (
                importantItems.map((item) => {
                    return (
                        <div className="tile-item" key={item.id}>
                            <div className="item-left">
                                <span className={`badge rounded-pill category ${item.category}`}>{item.category}</span>
                            </div>
                            <div className="item-right">
                                <span className="item-title">{item.title}</span>
                                <span className="item-user">{item.user}</span>
                            </div>
                        </div>
                    );
                })
            ) : (
                <span className="tile-empty-text">Es befinden sich gerade keine wichtigen Einträge auf deinen Listen</span>
            )}
        </div>
    );
}
