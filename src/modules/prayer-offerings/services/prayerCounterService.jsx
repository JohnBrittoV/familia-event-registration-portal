import { doc, onSnapshot, updateDoc, increment, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase.config';
import { subscribe } from 'firebase/data-connect';

const TARGET_DOC = doc(db, 'TargetPrayer', 'globalStats');

export const prayerCounterService = {
    subscribeToCount: (callback) => {
        return onSnapshot(TARGET_DOC, (docSnap) => {
            if (docSnap.exists()) {
                callback(docSnap.data().count || 0)
            }
            else {
                setDoc(TARGET_DOC, {count: 0}).then(() => callback(0));
            }
        });
    }, 

    // Safely increment the counter using Firebase's build-in increment
    incrementCount: async (mobileNumber, amount = 1) => {

        if (!mobileNumber) throw new Error('User mobile number is required');

        try {

            const globalUpdate = updateDoc(TARGET_DOC, {
                count: increment(amount)
            });

            const userRef = doc(db, 'prayerOfferings', mobileNumber);
            
            const personalUpdate = updateDoc(userRef, {
                totalHailMarys: increment(1),
                mobile: mobileNumber,
                lastActive: new Date()
            }, {merge: true});

            await Promise.all([globalUpdate, personalUpdate]);

        } catch (error) {
            console.error('Error incrementing prayer count:', error);
            throw error;
        }
    }
};