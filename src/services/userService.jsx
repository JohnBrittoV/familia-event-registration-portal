import { collection, query, where, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';
import { db } from '../config/firebase.config';

export const fetchLatestResponsiblePersons = async (count = 3) => {
    try {
        const q = query(
            collection(db, 'users'),
            where('role', '==', 'responsible_person'),
            orderBy('createdAt', 'desc'),
            limit(count)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    } catch (error) {
        console.error('Error fetching latest responsible persons:', error);
        return [];
    }
}

export const fetchPaginatedUsersByRole = async (role, lastVisibleDoc = null, limitCount = 10) => {
    let q;
    const baseArgs = [
        collection(db, 'users'),
        where('role', '==', role),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
    ];

    if (lastVisibleDoc) {
        q = query(...baseArgs, startAfter(lastVisibleDoc));
    } else {
        q = query(...baseArgs);
    }

    try {
        const snapshot = await getDocs(q);
        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        const result = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return { result, lastDoc };
    } catch (error) {
        console.error(`Error fetching paginated users for role ${role}:`, error);
        throw error;
    }
}