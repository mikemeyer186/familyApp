import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

export async function signIn(email, password) {
    await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
}

export async function signOut() {}

export async function authState() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            return user;
        } else {
            console.log('No user is signed in.');
        }
    });
}
