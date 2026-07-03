import { db } from '../config/firebase.config';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Fetch users
export const fetchUsers = async () => {
    const userRef = collection(db, 'users');
    const snapshot = await getDocs(userRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))
}

// Approval users
export const toggleApproval = async (userId, currentStatus) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { isApproved: !currentStatus });
    return !currentStatus;
}

// Delete users
export const deleteUserWithSecret = async (userId) => {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
}

