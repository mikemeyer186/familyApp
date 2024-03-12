import { useNavigate } from 'react-router';
import { useList } from '../../contexts/listContext';

export default function ListsTile({ numberOfItems }) {
    const { lists } = useList();
    const navigate = useNavigate();

    return (
        <div className="dashboard-tile" onClick={() => navigate('/app/lists?page=Listen')}>
            <h6>Listen</h6>
            <img src="/assets/img/listen.webp" alt="Listen" />
            <div className="tile-content">
                <span className="tile-content-header">
                    {lists.length === 0 ? 'Keine Listen' : lists.length === 1 ? '1 Liste' : `${lists.length} Listen`}
                </span>

                <div className="tile-content-body">
                    <div>
                        <span>Einträge erledigt: </span>
                        <span className="list-number">
                            {numberOfItems.doneItems}/{numberOfItems.allItems}
                        </span>
                    </div>
                    <div>
                        <span>mit </span>
                        <img className="list-star" src="/assets/icons/star-fill.svg" alt="Priority" />
                        <span> markiert: </span>
                        <span className="list-number">{numberOfItems.importantItems}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
