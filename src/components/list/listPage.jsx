import { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useList } from '../../contexts/listContext';
import ItemList from './itemList';
import ListToolbar from './listToolbar';
import Spinner from '../global/spinner';

export default function ListPage() {
    const { getLists, lists, setLists } = useList();
    const [sortBy, setSortBy] = useState('Datum');
    const [isLoaded, setIsLoaded] = useState(false);
    const sortCategories = ['Datum', 'Alphabet'];
    let sortedLists;

    /**
     * handle sorting of lists
     * @param {string} category - category to sort by (date or alphabet)
     */
    function handleSorting(category) {
        setSortBy(category);
    }

    /**
     * get lists from database
     * set isLoaded to true when lists are loaded
     */
    useEffect(() => {
        getLists().then(() => {
            setIsLoaded(true);
        });

        return () => {
            setIsLoaded(false);
        };
    }, [getLists]);

    /**
     * observable for lists from firebase
     */
    useEffect(() => {
        const q = query(collection(db, 'lists'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newLists = querySnapshot.docs.map((doc) => doc.data());
            setLists(newLists);
        });

        return () => {
            unsubscribe();
        };
    }, [setLists]);

    if (sortBy === 'Alphabet') sortedLists = lists.slice().sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === 'Datum') sortedLists = lists.slice().sort((a, b) => b.date.localeCompare(a.date));

    return (
        <>
            <div className="listPage-wrapper">
                <div className="listToolbar">
                    <ListToolbar sortBy={sortBy} sortCategories={sortCategories} handleSorting={handleSorting} />
                </div>

                {!isLoaded ? (
                    <Spinner>{'Listen laden...'}</Spinner>
                ) : (
                    <div className="listCollection">
                        {sortedLists.length == 0 ? (
                            <span className="emptyListCollection">
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
