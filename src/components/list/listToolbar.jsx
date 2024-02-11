import { useDialog } from '../../contexts/dialogContext';

export default function ListToolbar({ sortBy, sortCategories, handleSorting }) {
    const { openDialog } = useDialog();

    return (
        <>
            <button type="button" className="btn btn-primary new-list-button" onClick={() => openDialog('listNewRef')}>
                <span>Neue Liste</span>
                <img src="/assets/icons/file-earmark-plus-fill.svg" alt="New list" />
            </button>

            <button
                className="btn dropdown-toggle btn-outline-primary sort-list-button"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {sortBy}
                {sortBy === 'Datum' ? (
                    <img src="/assets/icons/sort-numeric-down.svg" alt="Sort by date" />
                ) : (
                    <img src="/assets/icons/sort-alpha-down.svg" alt="Sort alphabetically" />
                )}
            </button>

            <ul className="dropdown-menu">
                {sortCategories.map((category) => {
                    return (
                        <li key={category} onClick={() => handleSorting(category)}>
                            <span className="dropdown-item pointer">{category}</span>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}
