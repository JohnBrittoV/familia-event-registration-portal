import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase.config';

const CONFIG_DOC = doc(db, 'settings', 'prayerConfig');

export const prayerConfigService = {
    subscribeToConfig: (callback) => {
        return onSnapshot(CONFIG_DOC, (docSnap) => {
            if (docSnap.exists()) {
                callback(docSnap.data());
            }
            else {
                callback({ isBookingOpen: false, isHistoryVisible: true});
            }
        });
    },

    // Admin function to toggle the status
    toggleFeature: async (featureKey, newStatus) => {
        try {
            await setDoc(CONFIG_DOC, { [featureKey] : newStatus }, { merge: true });
        } catch (error) {
            console.error(`Error updating ${featureKey}:`, error);
            throw new Error('Failed to update booking status. Check admin permissions.');
        }
    }
};

