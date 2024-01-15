export default function ListsTile({ importantItems }) {
    return (
        <div className="dashboard-tile">
            <h4 className="tile-title">Wichtige Einkäufe</h4>
            {importantItems.map((item) => {
                return (
                    <div className="tile-item" key={item.id}>
                        <div className="item-left">
                            <span className={`badge rounded-pill category ${item.category}`}>{item.category}</span>
                        </div>
                        <div className="item-right">
                            <span>{item.title}</span>
                            <span className="item-user">{item.user}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
