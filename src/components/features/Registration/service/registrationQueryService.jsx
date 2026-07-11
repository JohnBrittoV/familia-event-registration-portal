import { collection, query, orderBy, limit, startAfter, getDocs, where, getDoc } from 'firebase/firestore';
import { db } from '../../../../config/firebase.config';

export const fetchPaginatedRegistrations = async (lastVisibleDoc = null, filterByRepUid = null) => {
    let q;

    const baseQueryArgs = [
        collection(db, 'registrations'),
        orderBy('createdAt', 'desc'),
        limit(10)
    ];

    if (filterByRepUid) {
        baseQueryArgs.splice(1, 0, where('registeredBy', '==', filterByRepUid));
    }

    if (lastVisibleDoc) {
        q = query(...baseQueryArgs, startAfter(lastVisibleDoc));
    }
    else {
        q = query(...baseQueryArgs);
    }

    // Execute the query
    const snapshot = await getDocs(q);

    // Save the very last document
    const lastDoc  = snapshot.docs[snapshot.docs.length - 1];

    // Format the data for React
    const result = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return { result, lastDoc};
}

// ✅ NEW: Fetch just the latest 5 Registrations for the Home Dashboard
export const fetchLatestRegistrations = async (count = 5) => {
    try {
        const q = query(
            collection(db, 'registrations'),
            limit(count)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching latest registrations:", error);
        return [];
    }
};
