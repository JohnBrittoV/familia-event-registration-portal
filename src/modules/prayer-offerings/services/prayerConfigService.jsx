import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase.config';

const CONFIG_DOC = doc(db, 'settings', 'prayerConfig');

export const prayerConfigService = {
    subscribeToConfig: (callback) => {
        return onSnapshot(CONFIG_DOC, (docSnap) => {
            if (docSnap.exists()) {
                callback(docSnap.data().isBookingOpen);
            }
            else {
                callback(false);
            }
        });
    },

    // Admin function to toggle the status
    toggleBookingStatus: async (newStatus) => {
        try {
            await setDoc(CONFIG_DOC, { isBookingOpen: newStatus }, { merge: true });
        } catch (error) {
            console.error('Error updating prayer config:', error);
            throw new Error('Failed to update booking status. Check admin permissions.');
        }
    }
};

