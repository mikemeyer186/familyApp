import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export default async function loadListsFromFirestore() {
    const querySnapshot = await getDocs(collection(db, 'shoppinglists'));
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, ' => ', doc.data());
    });
}
