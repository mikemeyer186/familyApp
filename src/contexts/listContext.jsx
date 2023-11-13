import { createContext, useContext, useState } from 'react';
import { addListInFirestore, deleteListInFirestore, loadListsFromFirestore } from '../services/firestore';
import { useAlert } from './alertContext';

const ListContext = createContext();

function ListProvider({ children }) {
    const { setSuccess } = useAlert();
    const [lists, setLists] = useState([]);

    async function getLists() {
        const lists = await loadListsFromFirestore();
        setLists(lists);
    }

    function addNewList(newListTitle) {
        const title = newListTitle;
        const id = crypto.randomUUID();
        const date = new Date().toISOString();
        const list = [];

        setLists((currentLists) => {
            const lists = [
                ...currentLists,
                {
                    id: id,
                    title: title,
                    list: list,
                    date: date,
                },
            ];
            return lists;
        });
        addListInFirestore(list, id, title, date);
        setSuccess('Die neue Liste wurde erfolgreich hinzugefügt!');
    }

    function deleteList(listId) {
        setLists((currentLists) => {
            const lists = currentLists.filter((list) => list.id !== listId);
            return lists;
        });
        deleteListInFirestore(listId);
        setSuccess('Die Liste wurde erfolgreich gelöscht!');
    }

    return <ListContext.Provider value={{ lists: lists, setLists, getLists, addNewList, deleteList }}>{children}</ListContext.Provider>;
}

function useList() {
    const context = useContext(ListContext);

    if (context === undefined) {
        throw new Error('useAlert must be used within a AlertProvider');
    }

    return context;
}

export { ListProvider, useList };
