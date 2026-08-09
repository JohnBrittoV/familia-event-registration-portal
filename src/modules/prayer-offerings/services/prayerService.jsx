import { db } from '../../../config/firebase.config';
import { collection, addDoc, query, where, getDocs, 
         Timestamp, orderBy, limit, doc, getDoc, 
         setDoc, deleteDoc 
    } from 'firebase/firestore';

const COLLECTION_NAME = 'prayerOfferings';
const CONFIG_PATH = 'settings/prayerConfig';

// Get prayer config
export const getPrayerConfig = async () => {
    try {
        const docSnap = await getDoc(doc(db, CONFIG_PATH));
        if (docSnap.exists()) {
            return docSnap.data();
        }

        return {
            isDashboardEnabled: true, 
            isBookingOpen: true, 
            isHistoryVisible: true,
            startDate: new Date().toISOString().split('T')[0], 
            endDate: '2026-12-31'
        }
    } catch (error) {
        console.error("Error fetching prayer config:", error);
        return { isDashboardEnabled: true, isBookingOpen: true, isHistoryVisible: true };  
    }
   
};

// Update prayer config
export const updatePrayerConfig = async (configData) => {
    try {
        await setDoc(doc(db, CONFIG_PATH), configData, { merge: true });
    } catch (error) {
        console.error("Error updating prayer config:", error);
        throw new Error("Failed to update prayer configurations.");
    }
};

// Booking prayer slot
export const bookPrayerOffering = async (userData, prayerType, bookingDate) => {
    
    const config = await getPrayerConfig();

    if (config.isBookingOpen === false) {
        throw new Error("Prayer bookings are currently disabled by the admin.");
    }
    
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

// Get recent bookings
export const getRecentBookings = async () => {
    try {

        const config = await getPrayerConfig();
        if (config.isHistoryVisible === false) {
            return []; // Return empty array if history visibility is toggled off by admin
        }

        const ref = collection(db, COLLECTION_NAME);
        const q = query(ref, orderBy('createdAt', 'desc'), limit(10));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    } catch (error) {
        console.error("Error fetching recent bookings:", error);
        return []; 
    }
};

