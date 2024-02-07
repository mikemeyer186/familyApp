import { useState } from 'react';
import { useList } from '../../contexts/listContext';
import ItemList from './itemList';
import ListToolbar from './listToolbar';
import Spinner from '../global/spinner';

export default function ListPage() {
    const { lists, isListLoaded } = useList();
    const [sortBy, setSortBy] = useState('Alphabet');
    const sortCategories = ['Datum', 'Alphabet'];
    let sortedLists;

    /**
     * handle sorting of lists
     * @param {string} category - category to sort by (date or alphabet)
     */
    function handleSorting(category) {
        setSortBy(category);
    }

    if (sortBy === 'Alphabet') sortedLists = lists.slice().sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === 'Datum') sortedLists = lists.slice().sort((a, b) => b.date.localeCompare(a.date));

    return (
        <>
            <div className="listpage-wrapper">
                <div className="list-toolbar">
                    <ListToolbar sortBy={sortBy} sortCategories={sortCategories} handleSorting={handleSorting} />
                </div>

                {!isListLoaded ? (
                    <Spinner>{'Listen laden...'}</Spinner>
                ) : (
                    <div className="listcollection">
                        {sortedLists.length == 0 ? (
                            <span className="empty-listcollection">
                                Es sind gerade keine Listen gespeichert. Du kannst eine neue Liste hinzufügen, indem du auf den Button &quot;Neue
                                Liste&quot; klickst.
                            </span>
                        ) : (
                            sortedLists.map((list) => {
                                return <ItemList key={list.id} list={list} />;
                            })
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
