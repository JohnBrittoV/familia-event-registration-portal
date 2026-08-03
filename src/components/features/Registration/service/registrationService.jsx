import { db } from '../../../../config/firebase.config';
import { doc, getDoc, updateDoc, collection, 
         runTransaction, serverTimestamp, increment 
    } from "firebase/firestore";

// Submit Registration Data
export const submitRegistrationData = async (payload, repUid, repName = 'Unknown User') => {

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
            };

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
                ResponsiblePersonName: repName,
                createdAt: serverTimestamp()
            });

        });

        return { success: true };
    } catch (error) {
        console.error("Transaction failed:", error);
        throw error;
    }
};

// Delete Participant Data
export const deleteParticipantRegistration = async (participantId) => {
    const participantRef = doc(db, "registrations", participantId);
    const globalStatsRef = doc(db, "statistics", "global_stats");

    await runTransaction(db, async (transaction) => {
        // 1. ALL READS MUST HAPPEN FIRST
        const participantDoc = await transaction.get(participantRef);
        if (!participantDoc.exists()) {
            throw new Error("Registration record not found.");
        }

        const data = participantDoc.data();
        const repUid = data.registeredBy;

        // If there is an RP, read their stats document right here (before any writes)
        let repStatsRef = null;
        let repDoc = null;
        if (repUid) {
            repStatsRef = doc(db, "statistics", `rep_stats_${repUid}`);
            repDoc = await transaction.get(repStatsRef);
        }

        // Extract counts safely matching how they are calculated during submission
        const stats = data.calculatedStats || {};
        const adultsCount = Number(stats.adults || data.adultsCount || data.totalAdults || 1);
        const kidsCount = Number(stats.kids || (Array.isArray(data.children) ? data.children.length : data.kidsCount || 0));

        // 2. ALL WRITES HAPPEN AFTER ALL READS ARE COMPLETE
        
        // Delete the participant document
        transaction.delete(participantRef);

        // Decrement global statistics
        transaction.update(globalStatsRef, {
            totalRegistrations: increment(-1),
            totalAdults: increment(-adultsCount),
            totalKids: increment(-kidsCount),
        });

        // Decrement the specific Responsible Person's statistics if it exists
        if (repUid && repStatsRef && repDoc && repDoc.exists()) {
            transaction.update(repStatsRef, {
                totalRegistrations: increment(-1),
                totalAdults: increment(-adultsCount),
                totalKids: increment(-kidsCount),
            });
        }
    });
};

// Fetch single Participant Profile
export const fetchParticipantById = async (id) => {
    const docRef = doc(db, "registrations", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        throw new Error("Participant profile not found.");
    }
};

