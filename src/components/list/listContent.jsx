import { useEffect, useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useList } from '../../contexts/listContext';
import { Popover } from 'bootstrap';
import ListToolbar from './listToolbar';
import ItemList from './itemList';

export default function ListContent() {
    const { lists } = useList();
    const [sortBy, setSortBy] = useState('Alphabet');
    const sortCategories = ['Datum', 'Alphabet'];
    const [collectionParent] = useAutoAnimate({ duration: 150, easing: 'ease-in' });
    let sortedLists;

    /**
     * handle sorting of lists
     * @param {string} category - category to sort by (date or alphabet)
     */
    function handleSorting(category) {
        setSortBy(category);
    }

    /**
     * initializes and controls popovers from Bootsrap
     * used for info badge hover in each item
     */
    useEffect(() => {
        const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
        [...popoverTriggerList].map((popoverTriggerEl) => new Popover(popoverTriggerEl));
    }, [lists]);

    if (sortBy === 'Alphabet') sortedLists = lists.slice().sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === 'Datum') sortedLists = lists.slice().sort((a, b) => b.date.localeCompare(a.date));

    return (
        <div className="fade-effect">
            <div className="list-toolbar">
                <ListToolbar sortBy={sortBy} sortCategories={sortCategories} handleSorting={handleSorting} />
            </div>
            <div ref={collectionParent} className="listcollection">
                {sortedLists.length == 0 ? (
                    <span className="empty-listcollection">
                        Es sind gerade keine Listen gespeichert. Du kannst eine neue Liste hinzufügen, indem du auf den Button &quot;Neue Liste&quot;
                        klickst.
                    </span>
                ) : (
                    sortedLists.map((list) => {
                        return <ItemList key={list.id} list={list} />;
                    })
                )}
            </div>
        </div>
    );
}
