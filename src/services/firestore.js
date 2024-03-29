import { collection, deleteDoc, endAt, getDoc, getDocs, orderBy, query, startAt, updateDoc } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// User functions
export async function loadUserDataFromFirestore(uid) {
    const docRef = doc(db, 'user', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log('No such document!');
    }
}

// Settings functions
export async function loadSettingsFromFirestore(familyID) {
    const docRef = doc(db, familyID, 'settings');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log('No such document!');
    }
}

export async function saveSettingsInFirestore(familyID, settings) {
    try {
        await setDoc(doc(db, familyID, 'settings'), settings);
    } catch (e) {
        console.error('Error adding document: ', e);
    }
}

export async function loadMotivationFromFirestore() {
    const docRef = doc(db, 'motivation', 'set001');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log('No such document!');
    }
}

// List functions
export async function loadListsFromFirestore(familyID) {
    const familyCollection = collection(db, familyID);
    const prefix = 'list';
    const q = query(familyCollection, orderBy('__name__'), startAt(prefix), endAt(prefix + '\uf8ff'));
    const querySnapshot = await getDocs(q);
    const allLists = querySnapshot.docs.map((doc) => doc.data());
    return allLists;
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
export async function loadJournalFromFirestore(familyID) {
    const familyCollection = collection(db, familyID);
    const prefix = '20';
    const q = query(familyCollection, orderBy('__name__'), startAt(prefix), endAt(prefix + '\uf8ff'));
    const querySnapshot = await getDocs(q);
    const journal = querySnapshot.docs.map((doc) => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data };
    });
    return journal;
}

export async function addPaymentInFirestore(familyID, payment, journalId) {
    try {
        await setDoc(doc(db, familyID, journalId), { payment, id: journalId });
    } catch (e) {
        console.error('Error adding document: ', e);
    }
}

export async function updatePaymentInFirestore(familyID, payment, journalId) {
    try {
        await updateDoc(doc(db, familyID, journalId), { payment, id: journalId });
    } catch (e) {
        console.error('Error updating document: ', e);
    }
}

// Calendar functions
export async function loadEventsFromFirestore(familyID) {
    const docRef = doc(db, familyID, 'events');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log('No such document!');
    }
}

export async function addEventInFirestore(familyID, events) {
    try {
        await setDoc(doc(db, familyID, 'events'), { events });
    } catch (e) {
        console.error('Error adding document: ', e);
    }
}

// Assistant functions
export async function addPromptInFirestore(familyID, id, date, user, photoURL, prompt) {
    try {
        await setDoc(doc(db, familyID, id), { prompt: prompt, id: id, date: date, user: user, photoURL: photoURL });
    } catch (e) {
        console.error('Error adding document: ', e);
    }
}

export async function deletePromptInFirestore(familyID, id) {
    try {
        await deleteDoc(doc(db, familyID, id));
    } catch (e) {
        console.error('Error deleting document: ', e);
    }
}

export async function addChatInHistory(chatID, chat, deletionDate) {
    try {
        await setDoc(doc(db, 'chat-history', chatID), {
            user: chat.user,
            userPrompt: chat.prompt,
            creationDate: chat.date,
            aiResponse: chat.response,
            status: chat.status,
            deltionDate: deletionDate,
        });
    } catch (e) {
        console.error('Error updating document: ', e);
    }
}

// Test version functions
export async function testVersionTracking(id, data) {
    try {
        await setDoc(doc(db, 'test-tracker', id), data);
    } catch (e) {
        console.error('Error adding document: ', e);
    }
}
