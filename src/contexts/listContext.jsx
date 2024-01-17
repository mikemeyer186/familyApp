import { createContext, useCallback, useContext, useState } from 'react';
import { addListInFirestore, deleteListInFirestore, loadListsFromFirestore, updateListInFirestore } from '../services/firestore';
import { useAlert } from './alertContext';

const ListContext = createContext();

function ListProvider({ children }) {
    const { setSuccess } = useAlert();
    const [lists, setLists] = useState([]);
    const [selectedList, setSelectedList] = useState({});
    const [modalType, setModalType] = useState('');
    const [isListLoaded, setIsListLoaded] = useState(false);

    /**
     * loads lists from firestore
     */
    const getLists = useCallback(async function getLists() {
        const lists = await loadListsFromFirestore();
        setLists(lists);
        setIsListLoaded(true);
    }, []);

    /**
     * adds new list to firestore
     * @param {string} newListTitle - title of new list
     */
    function addNewList(newListTitle) {
        const title = newListTitle;
        const id = crypto.randomUUID();
        const date = new Date().toISOString();
        const list = [];

        addListInFirestore(list, id, title, date);
        setSuccess('Die neue Liste wurde erfolgreich hinzugefügt!');
    }

    /**
     * deletes list from firestore
     * @param {string} listId - id of list to delete
     */
    function deleteList(listId) {
        deleteListInFirestore(listId);
        setSuccess('Die Liste wurde erfolgreich gelöscht!');
    }

    /**
     * clears list in firestore
     * @param {string} listID - id of list to clear
     */
    function clearList(listID) {
        const listTitle = lists.find((list) => list.id === listID).title;
        let listItems = lists.find((list) => list.id === listID).list;
        listItems = [];
        updateListInFirestore(listItems, listID, listTitle);
        setSuccess('Alle Elemente wurden erfolgreich gelöscht!');
    }

    /**
     * renames list in firestore
     * @param {string} listID - id of list to rename
     * @param {string} newListTitle - new title of list
     */
    function renameList(listID, newListTitle) {
        let listItems = lists.find((list) => list.id === listID).list;
        updateListInFirestore(listItems, listID, newListTitle);
        setSuccess('Die Liste wurde erfolgreich umbenannt!');
    }

    /**
     * filters the items with priority from all lists
     * @returns - important items
     */
    function filterImportantItems() {
        let importantItems = [];

        lists.forEach((listObject) => {
            const importantInList = listObject.list.filter((item) => item.priority && !item.done);
            importantItems = importantItems.concat(importantInList);
        });

        return importantItems;
    }

    return (
        <ListContext.Provider
            value={{
                lists: lists,
                selectedList: selectedList,
                modalType: modalType,
                isListLoaded: isListLoaded,
                setLists,
                getLists,
                addNewList,
                deleteList,
                clearList,
                renameList,
                setSelectedList,
                setModalType,
                setIsListLoaded,
                filterImportantItems,
            }}
        >
            {children}
        </ListContext.Provider>
    );
}

function useList() {
    const context = useContext(ListContext);

    if (context === undefined) {
        throw new Error('useList must be used within a ListProvider');
    }

    return context;
}

export { ListProvider, useList }; //eslint-disable-line
