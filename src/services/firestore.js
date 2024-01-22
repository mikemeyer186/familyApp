import { collection, deleteDoc, endAt, getDoc, getDocs, orderBy, query, startAt, updateDoc } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// List functions
export async function loadListsFromFirestore(familyID) {
    const familyCollection = collection(db, familyID);
    const prefix = 'list';
    const q = query(familyCollection, orderBy('__name__'), startAt(prefix), endAt(prefix + '\uf8ff'));
    try {
        const querySnapshot = await getDocs(q);
        const allLists = querySnapshot.docs.map((doc) => doc.data());
        return allLists;
    } catch (e) {
        console.error('Error loading documents: ', e);
    }
}

export async function updateListInFirestore(familyID, list, id, title) {
    try {
        await updateDoc(doc(db, familyID, id), { list, title, id: id });
    } catch (e) {
        console.error('Error updating document: ', e);
    }
}

export async function addListInFirestore(familyID, list, id, title, date) {
    try {
        await setDoc(doc(db, familyID, id), { list, title, id: id, date });
    } catch (e) {
        console.error('Error adding document: ', e);
    }
}

export async function deleteListInFirestore(familyID, id) {
    try {
        await deleteDoc(doc(db, familyID, id));
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
        console.error('Error adding document: ', e);
    }
}

export async function updatePaymentInFirestore(payment, journalId) {
    try {
        await updateDoc(doc(db, 'journal', journalId), { payment, id: journalId });
    } catch (e) {
        console.error('Error updating document: ', e);
    }
}

//calendar functions
export async function loadEventsFromFirestore() {
    const docRef = doc(db, 'calendar', 'events');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log('No such document!');
    }
}

export async function addEventInFirestore(events) {
    try {
        await setDoc(doc(db, 'calendar', 'events'), { events });
    } catch (e) {
        console.error('Error adding document: ', e);
    }
}
