import { collection, deleteDoc, getDocs, updateDoc } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// List functions
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

// Journal functions
export async function loadJournalFromFirestore() {
    const querySnapshot = await getDocs(collection(db, 'journal'));
    const journal = querySnapshot.docs.map((doc) => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data };
    });
    return journal;
}

export async function addPaymentInFirestore(payment, journalId) {
    try {
        await setDoc(doc(db, 'journal', journalId), { payment, id: journalId });
    } catch (e) {
        console.error('Error updating document: ', e);
    }
}
