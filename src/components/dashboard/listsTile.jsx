import { useUser } from '../../contexts/userContext';

export default function ListsTile({ importantItems, navigateToPage }) {
    const { appSettings } = useUser();

    return (
        <div className="dashboard-tile" onClick={() => navigateToPage('/app/lists?page=Listen')}>
            <h5 className="tile-title">Listen</h5>
            {importantItems.length > 0 ? (
                importantItems.map((item) => {
                    const itemCategory = appSettings.list.find((category) => category.category === item.category);
                    const itemColor = itemCategory ? itemCategory.color : '#6d767e';
                    return (
                        <div className="tile-item" key={item.id}>
                            <div className="item-left">
                                <span className={`badge rounded-pill category ${item.category}`} style={{ backgroundColor: itemColor }}>
                                    {item.category}
                                </span>
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
