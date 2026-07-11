import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
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