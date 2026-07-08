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