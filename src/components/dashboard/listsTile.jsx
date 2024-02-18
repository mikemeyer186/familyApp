import { useList } from '../../contexts/listContext';
import { useUser } from '../../contexts/userContext';

export default function ListsTile({ importantItems, numberOfItems, navigateToPage, variant }) {
    const { appSettings } = useUser();
    const { lists } = useList();

    return (
        <>
            {variant === 'small' ? (
                <div className="dashboard-tile tile-small" onClick={() => navigateToPage('/app/lists?page=Listen')}>
                    <h6>Listen</h6>
                    <img src="/assets/img/listen.webp" alt="Listen" />
                    <div className="tile-small-content">
                        <div className="item-small-content">
                            <span className="small-content-header">
                                {lists.length === 0 ? 'Keine Listen' : lists.length === 1 ? '1 Liste' : `${lists.length} Listen`}
                            </span>
                            <div>
                                <span>Einträge erledigt: </span>
                                <span className="item-small-number">
                                    {numberOfItems.doneItems}/{numberOfItems.allItems}
                                </span>
                            </div>
                            <div>
                                <span>mit </span>
                                <img className="item-small-star" src="/assets/icons/star-fill.svg" alt="Priority" />
                                <span> markiert: </span>
                                <span className="item-small-number">{numberOfItems.importantItems}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
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
            )}
        </>
    );
}
