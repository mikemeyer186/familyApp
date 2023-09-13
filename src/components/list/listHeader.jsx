export default function ListHeader({ sortBy, sortCategories, handleSorting }) {
    return (
        <>
            <div className="listHeader mb-2 mt-4">
                <span className="sortLabel">Sortierung nach: </span>

                <button
                    className="btn dropdown-toggle btn-light sortOptions thinBorder"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    {sortBy}
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
            </div>
        </>
    );
}
