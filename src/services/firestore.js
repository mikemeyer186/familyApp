import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export default async function loadListsFromFirestore() {
    const querySnapshot = await getDocs(collection(db, 'shoppinglists'));
    const rawItems = querySnapshot.docs.map((doc) => doc.data());
    const listItems = rawItems[0].items;
    return listItems;
}
