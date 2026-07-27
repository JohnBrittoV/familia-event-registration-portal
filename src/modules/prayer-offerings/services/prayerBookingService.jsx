import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase.config";

export const prayerBookingService = {
    bookPrayer: async (bookingDate) => {
        try {
            const bookingsRef = collection(db, 'PrayerBookings');
            const newBooking = {
                ...bookingDate,
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(bookingsRef, newBooking);
            return docRef.id;

        } catch (error) {
            console.error('Error booking prayer:', error);
            throw new Error('Failed to book prayer. Please try again');
        }
    },

    // Fetch prayers the user has already booked for a specific date
    getGlobalBookingsForDate: async (date) => {
        try {
            const q = query(
                collection(db, 'PrayerBookings'),
                where('date', '==', date)
            );

            const querySnapshot = await getDocs(q);
            let bookedPrayers = [];

           querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.prayers && Array.isArray(data.prayers)) {
                bookedPrayers = [...bookedPrayers, ...data.prayers];
                }
            });

            return bookedPrayers;
        } catch (error) {
            console.error('Error fetching global availability:', error);
            return [];
        }
    }
};