import { doc, collection, runTransaction, serverTimestamp } from "firebase/firestore";
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
            const { adults = 0, kids = 0, total = 0 } = payload.calculatedStats || {};

            // Calculate new global totals
            const currentGlobal = globalDoc.exists() ? globalDoc.data() : { totalAdults: 0, totalKids: 0, totalRegistrations: 0 };
            const newGlobalStats = {
                totalAdults: currentGlobal.totalAdults + adults,
                totalKids: currentGlobal.totalKids + kids,
                totalRegistrations: currentGlobal.totalRegistrations + 1,
                isOpen: currentGlobal.isOpen !== undefined ? currentGlobal.isOpen : true
            };

            // Caculate new representative totals
            const currentRep = repDoc.exists() ? repDoc.data() : { totalAdults: 0, totalKids: 0, totalRegistrations: 0 };
            const newRepStats = {
                totalAdults: currentRep.totalAdults + adults,
                totalKids: currentRep.totalKids + kids,
                totalRegistrations: currentRep.totalRegistrations + 1,
                isOpen: currentRep.isOpen !== undefined ? currentRep.isOpen : true
            };

            // Executes all writes atomically
            transaction.set(newRegRef, {
                ...payload,
                registeredBy: repUid,
                createdAt: serverTimestamp()
            });

            transaction.set(globalStatsRef, newGlobalStats, { merge: true });
            transaction.set(repStatsRef, newRepStats, { merge: true });
        });

        return { success: true};
    } catch (error) {
        console.error("Transaction failed:", error);
        throw error;
    }
};

