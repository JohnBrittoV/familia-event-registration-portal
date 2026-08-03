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

// Fetch submissions created by a specific Responsible person
export const fetchSubmissionsByUser = async (userId) => {
    try {
        const q = query(
            collection(db, "registrations"),
            where("registeredBy", "==", userId),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching user submissions:", error);
        throw error;
    }
};

// ✅Paginated & Sortable fetcher for Global Roster
export const fetchPaginatedGlobalRoster = async (lastVisibleDoc = null, sortBy = 'createdAt', sortDirection = 'desc') => {
    try {
        let orderField = 'createdAt';
        
        // Map user selection to actual database fields
        if (sortBy === 'responsiblePerson') orderField = 'ResponsiblePersonName'; // or 'registeredByName' depending on your schema
        else if (sortBy === 'parish') orderField = 'parish';
        else if (sortBy === 'location') orderField = 'homeTown';
        else if (sortBy === 'createdAt') orderField = 'createdAt';

        const baseQueryArgs = [
            collection(db, 'registrations'),
            orderBy(orderField, sortDirection),
            limit(10) // Fetches 10 items per page to control read quota costs
        ];

        let q;
        if (lastVisibleDoc) {
            q = query(...baseQueryArgs, startAfter(lastVisibleDoc));
        } else {
            q = query(...baseQueryArgs);
        }

        const snapshot = await getDocs(q);
        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        const result = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return { result, lastDoc };
    } catch (error) {
        console.error("Error fetching global roster pages:", error);
        throw error;
    }
};

// Fetch global summary counts (if needed for stats cards)
export const fetchGlobalEventSummary = async () => {
    try {
        const snapshot = await getDocs(collection(db, 'registrations'));
        let totalFamilies = snapshot.size;
        let totalAdults = 0;
        let totalKids = 0;

        snapshot.forEach(doc => {
            const stats = doc.data().calculatedStats || {};
            totalAdults += Number(stats.adults || 0);
            totalKids += Number(stats.kids || 0);
        });

        return { totalFamilies, totalAdults, totalKids, totalAttendees: totalAdults + totalKids };
    } catch (error) {
        console.error("Error fetching event summary stats:", error);
        return { totalFamilies: 0, totalAdults: 0, totalKids: 0, totalAttendees: 0 };
    }
};