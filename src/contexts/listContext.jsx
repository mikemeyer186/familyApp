import { createContext, useContext, useState } from 'react';
import { addListInFirestore, deleteListInFirestore, updateListInFirestore } from '../services/firestore';
import { useAlert } from './alertContext';
import { useUser } from './userContext';

const ListContext = createContext();

function ListProvider({ children }) {
    const { familyID } = useUser();
    const { setSuccess } = useAlert();
    const [lists, setLists] = useState([]);
    const [selectedList, setSelectedList] = useState({});
    const [modalType, setModalType] = useState('');
    const [isListLoaded, setIsListLoaded] = useState(false);

    /**
     * adds new list to firestore
     * @param {string} newListTitle - title of new list
     */
    function addNewList(newListTitle) {
        const title = newListTitle;
        const id = 'list_' + crypto.randomUUID();
        const date = new Date().toISOString();
        const list = [];

        addListInFirestore(familyID, list, id, title, date);
        setSuccess('Die neue Liste wurde erfolgreich hinzugefügt!');
    }

    /**
     * deletes list from firestore
     * @param {string} listId - id of list to delete
     */
    function deleteList(listId) {
        deleteListInFirestore(familyID, listId);
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
        updateListInFirestore(familyID, listItems, listID, listTitle);
        setSuccess('Alle Elemente wurden erfolgreich gelöscht!');
    }

    /**
     * renames list in firestore
     * @param {string} listID - id of list to rename
     * @param {string} newListTitle - new title of list
     */
    function renameList(listID, newListTitle) {
        let listItems = lists.find((list) => list.id === listID).list;
        updateListInFirestore(familyID, listItems, listID, newListTitle);
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

    /**
     * filters all items by status and returns the numbers
     * @returns - numbers of all items
     */
    function countItems() {
        let doneItems = [];
        let allItems = [];
        let importantItems = [];

        lists.forEach((listObject) => {
            const doneInList = listObject.list.filter((item) => item.done);
            const allInList = listObject.list.filter((item) => item.id);
            const importantInList = listObject.list.filter((item) => item.priority && !item.done);
            doneItems = doneItems.concat(doneInList);
            allItems = allItems.concat(allInList);
            importantItems = importantItems.concat(importantInList);
        });

        return { allItems: allItems.length, doneItems: doneItems.length, importantItems: importantItems.length };
    }

    return (
        <ListContext.Provider
            value={{
                lists: lists,
                selectedList: selectedList,
                modalType: modalType,
                isListLoaded: isListLoaded,
                setLists,
                addNewList,
                deleteList,
                clearList,
                renameList,
                setSelectedList,
                setModalType,
                setIsListLoaded,
                filterImportantItems,
                countItems,
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

export { ListProvider, useList };
