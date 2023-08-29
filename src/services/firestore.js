import { collection, getDocs } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default async function loadListsFromFirestore() {
    const querySnapshot = await getDocs(collection(db, 'shoppinglists'));
    const rawItems = querySnapshot.docs.map((doc) => doc.data());
    const listItems = rawItems[0].list;
    return listItems;
}

export async function updateListInFirestore(list) {
    const shoppingListID = '8OjnR3LwUP0wkKJgc64N'; //to be given as parameter for different shopping lists
    try {
        await setDoc(doc(db, 'shoppinglists', shoppingListID), { list });
    } catch (e) {
        console.error('Error updating document: ', e);
    }
}
