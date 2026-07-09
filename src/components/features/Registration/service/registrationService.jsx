import { doc, collection, runTransaction, serverTimestamp, addDoc } from "firebase/firestore";
import { db } from '../../../../config/firebase.config';

export const submitRegistrationData = async (payload, repUid) => {

    const globalStatusRef = doc(db, 'statistics', 'global_stats');
    const repStatusRef = doc(db, 'statistics', `rep_stats_${repUid}`);
    const newRegRef = doc(collection(db, 'registrations'));

    try {
        await runTransaction(db, async (transaction) => {
            console.log('Starting Firestore transaction...');

            // Read all necessary documents first 
            const globalDoc = await transaction.get(globalStatusRef);
            const repDoc = await transaction.get(repStatusRef);

            // Validate Access controls ( open / close registration)
            if (globalDoc.exists() && globalDoc.data().isOpen === false) {
                throw new Error("Global event registration is currently closed.");
            }

            if (repDoc.exists() && repDoc.data().isOpen === false) {
                throw new Error("Your specific registration counter has been closed by an Admin.");
            }

            // Extract calculated totals from the wizard payloads
            const stats = payload.calculatedStats || {};
            const adults = Number(stats.adults || 0);
            const kids = Number(stats.kids || 0);

            // Calculate new global totals
            const currentGlobal = globalDoc.exists() ? globalDoc.data() : { 
                    totalAdults: 0, totalKids: 0, totalRegistrations: 0, isOpen: true 
                };

            const currentRep = repDoc.exists() ? repDoc.data() : {
                totalAdults: 0, totalKids: 0, totalRegistrations: 0, isOpen: true
            }

           transaction.set(globalStatusRef, {
            totalAdults: (currentGlobal.totalAdults || 0) + adults,
            totalKids: (currentGlobal.totalKids || 0) + kids,
            totalRegistrations: (currentGlobal.totalRegistrations || 0) + 1,
            isOpen: true
           }, {merge: true});

           transaction.set(repStatusRef, {
            totalAdults: (currentRep.totalAdults || 0) + adults,
            totalKids: (currentRep.totalKids || 0) + kids,
            totalRegistrations: (currentRep.totalRegistrations || 0) + 1,
            isOpen: true
           }, {merge: true});

            // Executes all writes atomically
            transaction.set(newRegRef, {
                ...payload,
                registeredBy: repUid,
                createdAt: serverTimestamp()
            });

        });

        return { success: true};
    } catch (error) {
        console.error("Transaction failed:", error);
        throw error;
    }
};

