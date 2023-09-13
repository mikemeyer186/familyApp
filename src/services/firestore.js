import { collection, deleteDoc, getDocs, updateDoc } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export async function loadListsFromFirestore() {
    const querySnapshot = await getDocs(collection(db, 'lists'));
    const allLists = querySnapshot.docs.map((doc) => doc.data());
    return allLists;
}

export async function updateListInFirestore(list, id, title) {
    try {
        await updateDoc(doc(db, 'lists', id), { list, title, id: id });
    } catch (e) {
        console.error('Error updating document: ', e);
    }
}

export async function addListInFirestore(list, id, title, date) {
    try {
        await setDoc(doc(db, 'lists', id), { list, title, id: id, date });
    } catch (e) {
        console.error('Error updating document: ', e);
    }
}

export async function deleteListInFirestore(id) {
    try {
        await deleteDoc(doc(db, 'lists', id));
    } catch (e) {
        console.error('Error deleting document: ', e);
    }
}
