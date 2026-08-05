import { db } from '../../../../config/firebase.config';
import { doc, getDoc, updateDoc, collection, 
         runTransaction, serverTimestamp, increment 
    } from "firebase/firestore";

// Helper function to calculate age brackets from children array
const calculateAgeBrackets = (children) => {
    const ageGroups = { "0-2": 0, "3-5": 0, "6-8": 0, "9-11": 0, "12-14": 0, ">15": 0 };
    if (Array.isArray(children)) {
        children.forEach((child) => {
            if (child?.isAttending) {
                const age = parseInt(child.age, 10);
                if (!isNaN(age)) {
                    if (age <= 2) ageGroups["0-2"]++;
                    else if (age <= 5) ageGroups["3-5"]++;
                    else if (age <= 8) ageGroups["6-8"]++;
                    else if (age <= 11) ageGroups["9-11"]++;
                    else if (age <= 14) ageGroups["12-14"]++;
                    else ageGroups[">15"]++;
                }
            }
        });
    }
    return ageGroups;
};

// --------------------------------------- 
// ------- Submit Registration Data ------------------------------------------------------
// ----------------------------------------

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

            // Extract advance payment data
            const advancePaid = Boolean(payload.advancePaid);
            const advanceCountDelta = advancePaid ? 1 : 0;
            const advanceAmountVal = advancePaid ? Number(payload.advanceAmount || 0) : 0;

            // Calculate child age brackets
            const ageGroups = calculateAgeBrackets(payload.children);

            const defaultAgeGroups = { "0-2": 0, "3-5": 0, "6-8": 0, "9-11": 0, "12-14": 0, ">15": 0 };

            // Calculate new global totals structure fallback
            const currentGlobal = globalDoc.exists() ? globalDoc.data() : { 
                    totalAdults: 0, totalKids: 0, totalRegistrations: 0, 
                    advancePaymentCount: 0, totalAdvanceAmount: 0,
                    ageGroups: defaultAgeGroups,
                    isOpen: true 
                };

            const currentRep = repDoc.exists() ? repDoc.data() : {
                    totalAdults: 0, totalKids: 0, totalRegistrations: 0, 
                    advancePaymentCount: 0, totalAdvanceAmount: 0,
                    ageGroups: defaultAgeGroups,
                    isOpen: true
                };

            // Build age groups increment map
            const currentGlobalAgeGroups = currentGlobal.ageGroups || defaultAgeGroups;
            const updatedGlobalAgeGroups = {
                "0-2": (currentGlobalAgeGroups["0-2"] || 0) + ageGroups["0-2"],
                "3-5": (currentGlobalAgeGroups["3-5"] || 0) + ageGroups["3-5"],
                "6-8": (currentGlobalAgeGroups["6-8"] || 0) + ageGroups["6-8"],
                "9-11": (currentGlobalAgeGroups["9-11"] || 0) + ageGroups["9-11"],
                "12-14": (currentGlobalAgeGroups["12-14"] || 0) + ageGroups["12-14"],
                ">15": (currentGlobalAgeGroups[">15"] || 0) + ageGroups[">15"],
            };

            const currentRepAgeGroups = currentRep.ageGroups || defaultAgeGroups;
            const updatedRepAgeGroups = {
                "0-2": (currentRepAgeGroups["0-2"] || 0) + ageGroups["0-2"],
                "3-5": (currentRepAgeGroups["3-5"] || 0) + ageGroups["3-5"],
                "6-8": (currentRepAgeGroups["6-8"] || 0) + ageGroups["6-8"],
                "9-11": (currentRepAgeGroups["9-11"] || 0) + ageGroups["9-11"],
                "12-14": (currentRepAgeGroups["12-14"] || 0) + ageGroups["12-14"],
                ">15": (currentRepAgeGroups[">15"] || 0) + ageGroups[">15"],
            };

            transaction.set(globalStatusRef, {
                totalAdults: (currentGlobal.totalAdults || 0) + adults,
                totalKids: (currentGlobal.totalKids || 0) + kids,
                totalRegistrations: (currentGlobal.totalRegistrations || 0) + 1,
                advancePaymentCount: (currentGlobal.advancePaymentCount || 0) + advanceCountDelta,
                totalAdvanceAmount: (currentGlobal.totalAdvanceAmount || 0) + advanceAmountVal,
                ageGroups: updatedGlobalAgeGroups,
                isOpen: true
            }, {merge: true});

            transaction.set(repStatusRef, {
                totalAdults: (currentRep.totalAdults || 0) + adults,
                totalKids: (currentRep.totalKids || 0) + kids,
                totalRegistrations: (currentRep.totalRegistrations || 0) + 1,
                advancePaymentCount: (currentRep.advancePaymentCount || 0) + advanceCountDelta,
                totalAdvanceAmount: (currentRep.totalAdvanceAmount || 0) + advanceAmountVal,
                ageGroups: updatedRepAgeGroups,
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

// -----------------------------------------------
// ---------------------- Delete Participant Data ---------------------
// ------------------------------------------------ 

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
        
        const advancePaid = Boolean(data.advancePaid);
        const advanceCountDecrement = advancePaid ? -1 : 0;
        const advanceAmountDecrement = advancePaid ? -Number(data.advanceAmount || 0) : 0;
        const ageGroups = calculateAgeBrackets(data.children);
   
        // 2. ALL WRITES HAPPEN AFTER ALL READS ARE COMPLETE
        
        // Delete the participant document
        transaction.delete(participantRef);

        // Decrement global statistics
        transaction.update(globalStatsRef, {
            totalRegistrations: increment(-1),
            totalAdults: increment(-adultsCount),
            totalKids: increment(-kidsCount),
            advancePaymentCount: increment(advanceCountDecrement),
            totalAdvanceAmount: increment(advanceAmountDecrement),
            "ageGroups.0-2": increment(-ageGroups["0-2"]),
            "ageGroups.3-5": increment(-ageGroups["3-5"]),
            "ageGroups.6-8": increment(-ageGroups["6-8"]),
            "ageGroups.9-11": increment(-ageGroups["9-11"]),
            "ageGroups.12-14": increment(-ageGroups["12-14"]),
            "ageGroups.>15": increment(-ageGroups[">15"]),
        });

        // Decrement the specific Responsible Person's statistics if it exists
        if (repUid && repStatsRef && repDoc && repDoc.exists()) {
            transaction.update(repStatsRef, {
                totalRegistrations: increment(-1),
                totalAdults: increment(-adultsCount),
                totalKids: increment(-kidsCount),
                advancePaymentCount: increment(advanceCountDecrement),
                totalAdvanceAmount: increment(advanceAmountDecrement),
                "ageGroups.0-2": increment(-ageGroups["0-2"]),
                "ageGroups.3-5": increment(-ageGroups["3-5"]),
                "ageGroups.6-8": increment(-ageGroups["6-8"]),
                "ageGroups.9-11": increment(-ageGroups["9-11"]),
                "ageGroups.12-14": increment(-ageGroups["12-14"]),
                "ageGroups.>15": increment(-ageGroups[">15"]),
            });
        }
    });
};

// --------------------------------------- 
// Fetch single Participant Profile----------------
// --------------------------------------- 

export const fetchParticipantById = async (id) => {
    const docRef = doc(db, "registrations", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        throw new Error("Participant profile not found.");
    }
};

// ----------------------------------------------------------
// -- Update participants count when counts changed ------------------------------
// --------------------------------------------------------------------

export const updateParticipantRegistration = async (participantId, formData, calculatedStats, originalData) => {
    const participantRef = doc(db, "registrations", participantId);
    const globalStatsRef = doc(db, "statistics", "global_stats");
    
    const repUid = originalData.registeredBy;
    const repStatsRef = repUid ? doc(db, "statistics", `rep_stats_${repUid}`) : null;

    // 1. Extract previous counts safely
    const oldStats = originalData.calculatedStats || {};
    const oldAdults = Number(oldStats.adults || 0);
    const oldKids = Number(oldStats.kids || 0);

    const oldAdvancePaid = Boolean(originalData.advancePaid);
    const oldAdvanceAmount = oldAdvancePaid ? Number(originalData.advanceAmount || 0) : 0;
    const oldAgeGroups = calculateAgeBrackets(originalData.children);

    // 2. Extract new counts safely
    const newAdults = Number(calculatedStats.adults || 0);
    const newKids = Number(calculatedStats.kids || 0);

    const newAdvancePaid = Boolean(formData.advancePaid);
    const newAdvanceAmount = newAdvancePaid ? Number(formData.advanceAmount || 0) : 0;
    const newAgeGroups = calculateAgeBrackets(formData.children);

    // 3. Compute the deltas (differences)
    const adultDelta = newAdults - oldAdults;
    const kidDelta = newKids - oldKids;
    
    const oldAdvanceCount = oldAdvancePaid ? 1 : 0;
    const newAdvanceCount = newAdvancePaid ? 1 : 0;
    const advanceCountDelta = newAdvanceCount - oldAdvanceCount;
    const advanceAmountDelta = newAdvanceAmount - oldAdvanceAmount;

    const ageGroupDeltas = {
        "0-2": newAgeGroups["0-2"] - oldAgeGroups["0-2"],
        "3-5": newAgeGroups["3-5"] - oldAgeGroups["3-5"],
        "6-8": newAgeGroups["6-8"] - oldAgeGroups["6-8"],
        "9-11": newAgeGroups["9-11"] - oldAgeGroups["9-11"],
        "12-14": newAgeGroups["12-14"] - oldAgeGroups["12-14"],
        ">15": newAgeGroups[">15"] - oldAgeGroups[">15"],
    };

    const hasCountChanged = 
        adultDelta !== 0 || 
        kidDelta !== 0 || 
        advanceCountDelta !== 0 || 
        advanceAmountDelta !== 0 ||
        Object.values(ageGroupDeltas).some(delta => delta !== 0);

    await runTransaction(db, async (transaction) => {
        // If counts changed, ensure RP stats doc is read first (Firestore transaction rule: reads before writes)
        let repDoc = null;
        if (hasCountChanged && repStatsRef) {
            repDoc = await transaction.get(repStatsRef);
        }

        // Prepare updated payload
        const updatedPayload = {
            ...formData,
            calculatedStats,
            updatedAt: serverTimestamp()
        };

        // Perform the participant document update
        transaction.set(participantRef, updatedPayload, { merge: true });

        // Update Statistics only if stats/counts changed
        if (hasCountChanged) {
            transaction.update(globalStatsRef, {
                totalAdults: increment(adultDelta),
                totalKids: increment(kidDelta),
                advancePaymentCount: increment(advanceCountDelta),
                totalAdvanceAmount: increment(advanceAmountDelta),
                "ageGroups.0-2": increment(ageGroupDeltas["0-2"]),
                "ageGroups.3-5": increment(ageGroupDeltas["3-5"]),
                "ageGroups.6-8": increment(ageGroupDeltas["6-8"]),
                "ageGroups.9-11": increment(ageGroupDeltas["9-11"]),
                "ageGroups.12-14": increment(ageGroupDeltas["12-14"]),
                "ageGroups.>15": increment(ageGroupDeltas[">15"]),
            });

            // Update RP Statistics if it exists
            if (repStatsRef && repDoc && repDoc.exists()) {
                transaction.update(repStatsRef, {
                    totalAdults: increment(adultDelta),
                    totalKids: increment(kidDelta),
                    advancePaymentCount: increment(advanceCountDelta),
                    totalAdvanceAmount: increment(advanceAmountDelta),
                    "ageGroups.0-2": increment(ageGroupDeltas["0-2"]),
                    "ageGroups.3-5": increment(ageGroupDeltas["3-5"]),
                    "ageGroups.6-8": increment(ageGroupDeltas["6-8"]),
                    "ageGroups.9-11": increment(ageGroupDeltas["9-11"]),
                    "ageGroups.12-14": increment(ageGroupDeltas["12-14"]),
                    "ageGroups.>15": increment(ageGroupDeltas?.[">15"] || ageGroupDeltas[">15"]),
                });
            }
        }          
    });

    return { success: true };
};