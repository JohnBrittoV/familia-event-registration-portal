import { db } from '../config/firebase.config';
import { collection, getDocs, doc, updateDoc,
         query, where, limit, getDoc
 } from 'firebase/firestore';

// Fetch users
export const fetchUsers = async () => {
    const userRef = collection(db, 'users');
    const snapshot = await getDocs(userRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))
};

// Approval users
export const toggleApproval = async (userId, currentStatus) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { isApproved: !currentStatus });
    return !currentStatus;
};

// Delete users
export const deleteUserWithSecret = async (userId) => {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
};

// Update user roles
export const updateUserRole = async (userId, newRole) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {role: newRole });
    return newRole;
};

// Registration Access
export const toggleRegistrationAccess = async (targetId, type, currentStatus) => {
    const docPath = type === 'global' ? 'global_stats' : `rep_stats_${targetId}`;
    const statsRef = doc(db, 'statistics', docPath);

    try {
        await updateDoc(statsRef, {
            isOpen: !currentStatus
        });
        return true;
    } catch (error) {
        console.error("Failed to toggle access:", error);
        throw error;
    }
}

// Fetch the aggregated global Stats
export const getGlobalStats = async () => {
    try {
        const statsRef = doc(db, 'statistics', 'global_stats' );
        const snapshot = await getDoc(statsRef);

        if (snapshot.exists()) {
            return snapshot.data();
        }

        return { totalFamilies: 0, totalParticipants: 0, targetProgress: 0, prayerOfferings: 0};

    } catch (error) {
        console.error('Error fetching global stats:', error);
        throw new Error('Failed to load statistics');
    }
};

// Fetch latest 3 Responsible persons
export const getLastRPs = async () => {
    try {
        const q = query(
            collection(db, 'users'),
            where('role', '==', 'responsible_person'),
            limit(3)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()   
        }))
    } catch (error) {
        console.error('Error fetching lastest RPs:', error);
        throw new Error('Failed to fetch Responsible persons.');
    }
};

