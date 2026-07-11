import { db } from '../../../config/firebase.config';
import { collection, addDoc, query, where, getDocs, 
         Timestamp, orderBy, limit, doc, getDoc, 
         setDoc, deleteDoc 
    } from 'firebase/firestore';

const COLLECTION_NAME = 'prayerOfferings';
const CONFIG_PATH = 'settings/prayerConfig';

// Booking prayer slot
export const bookPrayerOffering = async (userData, prayerType, bookingDate) => {
    const offeringsRef = collection(db, COLLECTION_NAME);
    const q = query(offeringsRef, where('prayerType', '==', prayerType), where('bookingDate', '==', bookingDate));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) throw new Error(`Already booked for ${bookingDate}`);

    await addDoc(offeringsRef, {
        userId: userData.userId, userName: userData.name, userPhone: userData.phone,
        prayerType, bookingDate, createdAt: Timestamp.now(), status: 'upcoming'
    });
};

// Fetching prayer slot
export const fetchPrayerOfferings = async () => {
    const ref = collection(db, COLLECTION_NAME);
    const q = query(ref, orderBy('bookingDate', 'asc'), orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

// Get prayer config
export const getPrayerConfig = async () => {
    const docSnap = await getDoc(doc(db, CONFIG_PATH));
    return docSnap.exists() ? docSnap.data() : { startDate: new Date().toISOString().split('T')[0], endDate: '2026-12-31' };
};

// Update prayer config
export const updatePrayerConfig = async (startDate, endDate) => {
    await setDoc(doc(db, CONFIG_PATH), { startDate, endDate }, { merge: true });
};

// Get recent bookings
export const getRecentBookings = async () => {
    try {
        const ref = collection(db, COLLECTION_NAME);
        // We limit to the latest 10 prayers so the marquee is fast and neat
        const q = query(ref, orderBy('createdAt', 'desc'), limit(10));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
        console.error("Error fetching recent bookings:", error);
        return []; 
    }
};

