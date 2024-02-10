export default function ListHeader({ sortBy, sortCategories, handleSorting }) {
    return (
        <>
            <div className="list-header mb-2 mt-4">
                <span className="sort-label">Sortierung nach: </span>

                <button
                    className="btn dropdown-toggle btn-outline-primary sort-options thinBorder"
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
