import { auth, db, googleProvider } from '../config/firebase.config';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, 
         collection, updateDoc, getDocs, onSnapshot } from 'firebase/firestore';

// Login user
export const loginWithGoogleService = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Firebase Service: Error during Google Sign-In:", error);
        throw error;
    }
};

// Logout user
export const logoutUserService = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Firebase Service: Error during Sign out:", error);
        throw error;
    }
};

// onAuthStateChange Listener
export const subscribeToAuthService = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// Check user exist
export const subscribeToUserProfile = async (user, callback) => {
    if(!user) return null;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        
        try {
            await setDoc(userRef, {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                role: 'responsible_person',
                isApproved: false,
                createdAt: serverTimestamp(),
            });
        } catch (error) {
            console.error('Error creating user profile:', error);
            return null;
        }
    }

    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
            callback(docSnapshot.data());
        }
    }, (error) => {
        console.error('Snapshot subscription error:', error);
});    

    return unsubscribe;

}


