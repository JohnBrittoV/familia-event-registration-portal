import { db } from '../../../../config/firebase.config';
import { doc, getDoc, updateDoc, collection, 
         runTransaction, serverTimestamp, increment 
    } from "firebase/firestore";

const calculateAgeBrackets = (children) => {
    const ageGroups = { 
        "0-6 months": 0, 
        "6-1 years": 0, 
        "1-3 years": 0, 
        "3-5 years": 0, 
        "5-9 years": 0, 
        "9-14 years": 0,
        "15 above": 0
     };
    
    if (Array.isArray(children)) {
        children.forEach((child) => {
            if (child?.isAttending) {
                const category = child?.age;
                if (category && ageGroups.hasOwnProperty(category)) {
                    ageGroups[category]++;
                }
                
            }
        });
    }
    return ageGroups;
};

const defaultAgeGroups = { 
    "0-6 months": 0, 
    "6-1 years": 0, 
    "1-3 years": 0, 
    "3-5 years": 0, 
    "5-9 years": 0, 
    "9-14 years": 0,
    "15 above": 0
};

// --------------------------------------- 
// ------- Submit Registration Data ------------------------------------------------------
// ----------------------------------------

export const submitRegistrationData = async (payload, repUid, repName = 'Unknown User') => {

    const globalStatusRef = doc(db, 'statistics', 'global_stats');
    const repStatusRef = doc(db, 'statistics', `rep_stats_${repUid}`);
    const newRegRef = doc(collection(db, 'registrations'));

    const accomm = payload.accommodation;
    const blockRef = accomm?.blockId ? doc(db, 'accommodations', accomm.blockId) : null;

    try {
        await runTransaction(db, async (transaction) => {
            console.log('Starting Firestore transaction...');

            // Read all necessary documents first 
            const globalDoc = await transaction.get(globalStatusRef);
            const repDoc = await transaction.get(repStatusRef);
            const blockDoc = blockRef ? await transaction.get(blockRef) : null;

            // Validate Access controls ( open / close registration)
            if (globalDoc.exists() && globalDoc.data().isOpen === false) {
                throw new Error("Global event registration is currently closed.");
            }

            if (repDoc.exists() && repDoc.data().isOpen === false) {
                throw new Error("Your specific registration counter has been closed by an Admin.");
            }

            // Validate and update accommodation inventory if chosen
            let updatedRoomTypes = null;
            if (accomm?.blockId && accomm?.roomType) {
                if (!blockDoc || !blockDoc.exists()) {
                    throw new Error("Selected accommodation block no longer exists.");
                }

                const blockData = blockDoc.data();
                updatedRoomTypes = (blockData.roomTypes || []).map(rt => {
                    if (rt.type === accomm.roomType) {
                        const currentRemaining = Number(rt.remainingRooms ?? rt.totalRooms);
                        if (currentRemaining <= 0) {
                            throw new Error(`The ${rt.type} category in ${blockData.blockName} is fully occupied.`);
                        }
                        return {
                            ...rt,
                            remainingRooms: currentRemaining - 1
                        };
                    }
                    return rt;
                });
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
                "0-6 months": (currentGlobalAgeGroups["0-6 months"] || 0) + ageGroups["0-6 months"],
                "6-1 years": (currentGlobalAgeGroups["6-1 years"] || 0) + ageGroups["6-1 years"],
                "1-3 years": (currentGlobalAgeGroups["1-3 years"] || 0) + ageGroups["1-3 years"],
                "3-5 years": (currentGlobalAgeGroups["3-5 years"] || 0) + ageGroups["3-5 years"],
                "5-9 years": (currentGlobalAgeGroups["5-9 years"] || 0) + ageGroups["5-9 years"],
                "9-14 years": (currentGlobalAgeGroups["9-14 years"] || 0) + ageGroups["9-14 years"],
                "15 above": (currentGlobalAgeGroups["15 above"] || 0) + ageGroups["15 above"],
            };

            const currentRepAgeGroups = currentRep.ageGroups || defaultAgeGroups;
            const updatedRepAgeGroups = {
                "0-6 months": (currentRepAgeGroups["0-6 months"] || 0) + ageGroups["0-6 months"],
                "6-1 years": (currentRepAgeGroups["6-1 years"] || 0) + ageGroups["6-1 years"],
                "1-3 years": (currentRepAgeGroups["1-3 years"] || 0) + ageGroups["1-3 years"],
                "3-5 years": (currentRepAgeGroups["3-5 years"] || 0) + ageGroups["3-5 years"],
                "5-9 years": (currentRepAgeGroups["5-9 years"] || 0) + ageGroups["5-9 years"],
                "9-14 years": (currentRepAgeGroups["9-14 years"] || 0) + ageGroups["9-14 years"],
                "15 above": (currentRepAgeGroups["15 above"] || 0) + ageGroups["15 above"],
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

            // Update accommodation block room inventory if chosen
            if (blockRef && updatedRoomTypes) {
                transaction.update(blockRef, { roomTypes: updatedRoomTypes });
            }
            
            // Executes all writes atomically
            transaction.set(newRegRef, {
                ...payload,
                registeredBy: repUid,
                registrationStatus: 'pending',
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
        const participantDoc = await transaction.get(participantRef);
        if (!participantDoc.exists()) {
            throw new Error("Registration record not found.");
        }

        const data = participantDoc.data();
        const repUid = data.registeredBy;
        const accomm = data.accommodation;

        // If there is an RP, read their stats document right here (before any writes)
        let repStatsRef = null;
        let repDoc = null;
        if (repUid) {
            repStatsRef = doc(db, "statistics", `rep_stats_${repUid}`);
            repDoc = await transaction.get(repStatsRef);
        }

        // If accommodation was booked, read that block document to restore counts
        let blockRef = accomm?.blockId ? doc(db, 'accommodations', accomm.blockId) : null;
        let blockDoc = blockRef ? await transaction.get(blockRef) : null;

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

        // Restore accommodation room count if it existed
        if (blockRef && blockDoc && blockDoc.exists() && accomm?.roomType) {
            const blockData = blockDoc.data();
            const restoredRoomTypes = (blockData.roomTypes || []).map(rt => {
                if (rt.type === accomm.roomType) {
                    const currentRemaining = Number(rt.remainingRooms ?? rt.totalRooms);
                    const maxLimit = Number(rt.totalRooms || currentRemaining);
                    return {
                        ...rt,
                        remainingRooms: Math.min(maxLimit, currentRemaining + 1)
                    };
                }
                return rt;
            });
            transaction.update(blockRef, { roomTypes: restoredRoomTypes });
        }

        // Decrement global statistics
        transaction.update(globalStatsRef, {
            totalRegistrations: increment(-1),
            totalAdults: increment(-adultsCount),
            totalKids: increment(-kidsCount),
            advancePaymentCount: increment(advanceCountDecrement),
            totalAdvanceAmount: increment(advanceAmountDecrement),
            "ageGroups.0-6 months": increment(-ageGroups["0-6 months"]),
            "ageGroups.6-1 years": increment(-ageGroups["6-1 years"]),
            "ageGroups.1-3 years": increment(-ageGroups["1-3 years"]),
            "ageGroups.3-5 years": increment(-ageGroups["3-5 years"]),
            "ageGroups.5-9 years": increment(-ageGroups["5-9 years"]),
            "ageGroups.9-14 years": increment(-ageGroups["9-14 years"]),
            "ageGroups.15 above": increment(-ageGroups["15 above"]),
        });

        // Decrement the specific Responsible Person's statistics if it exists
        if (repUid && repStatsRef && repDoc && repDoc.exists()) {
            transaction.update(repStatsRef, {
                totalRegistrations: increment(-1),
                totalAdults: increment(-adultsCount),
                totalKids: increment(-kidsCount),
                advancePaymentCount: increment(advanceCountDecrement),
                totalAdvanceAmount: increment(advanceAmountDecrement),
                "ageGroups.0-6 months": increment(-ageGroups["0-6 months"]),
                "ageGroups.6-1 years": increment(-ageGroups["6-1 years"]),
                "ageGroups.1-3 years": increment(-ageGroups["1-3 years"]),
                "ageGroups.3-5 years": increment(-ageGroups["3-5 years"]),
                "ageGroups.5-9 years": increment(-ageGroups["5-9 years"]),
                "ageGroups.9-14 years": increment(-ageGroups["9-14 years"]),
                "ageGroups.15 above": increment(-ageGroups["15 above"]),
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
        "0-6 months": newAgeGroups["0-6 months"] - oldAgeGroups["0-6 months"],
        "6-1 years": newAgeGroups["6-1 years"] - oldAgeGroups["6-1 years"],
        "1-3 years": newAgeGroups["1-3 years"] - oldAgeGroups["1-3 years"],
        "3-5 years": newAgeGroups["3-5 years"] - oldAgeGroups["3-5 years"],
        "5-9 years": newAgeGroups["5-9 years"] - oldAgeGroups["5-9 years"],
        "9-14 years": newAgeGroups["9-14 years"] - oldAgeGroups["9-14 years"],
        "15 above": newAgeGroups["15 above"] - oldAgeGroups["15 above"],
    };

    const hasCountChanged = 
        adultDelta !== 0 || 
        kidDelta !== 0 || 
        advanceCountDelta !== 0 || 
        advanceAmountDelta !== 0 ||
        Object.values(ageGroupDeltas).some(delta => delta !== 0);

        const oldAcc = originalData.accommodation || {};
        const newAcc = formData.accommodation || {};
        const hasAccommodationChanged = 
                (oldAcc.blockId !== newAcc.blockId) || 
                (oldAcc.roomType !== newAcc.roomType);

    await runTransaction(db, async (transaction) => {
        // If counts changed, ensure RP stats doc is read first (Firestore transaction rule: reads before writes)
        let repDoc = null;
        if (hasCountChanged && repStatsRef) {
            repDoc = await transaction.get(repStatsRef);
        }

        // Read accommodation blocks if accommodation choice changed
        let oldBlockRef = (hasAccommodationChanged && oldAcc.blockId) ? doc(db, 'accommodations', oldAcc.blockId) : null;
        let newBlockRef = (hasAccommodationChanged && newAcc.blockId) ? doc(db, 'accommodations', newAcc.blockId) : null;

        let oldBlockDoc = oldBlockRef ? await transaction.get(oldBlockRef) : null;
        let newBlockDoc = newBlockRef ? await transaction.get(newBlockRef) : null;

        // Validate new room capacity if accommodation changed and new block is selected
        if (hasAccommodationChanged && newAcc.blockId && newAcc.roomType) {
            if (!newBlockDoc || !newBlockDoc.exists()) {
                throw new Error("The newly selected accommodation block no longer exists.");
            }
            const newBlockData = newBlockDoc.data();
            const targetRoom = (newBlockData.roomTypes || []).find(rt => rt.type === newAcc.roomType);
            const availableCount = Number(targetRoom?.remainingRooms ?? targetRoom?.totalRooms ?? 0);
            
            // If staying in same block, account for releasing old room first
            const isSameBlock = oldAcc.blockId === newAcc.blockId;
            const effectiveAvailable = (isSameBlock && oldAcc.roomType === newAcc.roomType) ? availableCount + 1 : availableCount;

            if (effectiveAvailable <= 0) {
                throw new Error(`Selected room category (${newAcc.roomType}) is fully occupied.`);
            }
        }

        // Prepare updated payload
        const updatedPayload = {
            ...formData,
            calculatedStats,
            updatedAt: serverTimestamp()
        };

        // Perform the participant document update
        transaction.set(participantRef, updatedPayload, { merge: true });

        // Handle Accommodation Inventory Swapping Only if Changed
        if (hasAccommodationChanged) {
            // Step A: Restore old room slot if it existed
            if (oldBlockRef && oldBlockDoc && oldBlockDoc.exists() && oldAcc.roomType) {
                const oldBlockData = oldBlockDoc.data();
                const restoredOldRooms = (oldBlockData.roomTypes || []).map(rt => {
                    if (rt.type === oldAcc.roomType) {
                        const currentRem = Number(rt.remainingRooms ?? rt.totalRooms);
                        const maxLimit = Number(rt.totalRooms || currentRem);
                        return { ...rt, remainingRooms: Math.min(maxLimit, currentRem + 1) };
                    }
                    return rt;
                });
                
                // If old block and new block are the same reference, update combined, otherwise update old block directly
                if (oldAcc.blockId === newAcc.blockId && newBlockDoc) {
                    newBlockDoc._cachedRestoredRooms = restoredOldRooms; // cache for next step
                } else {
                    transaction.update(oldBlockRef, { roomTypes: restoredOldRooms });
                }
            }

            // Step B: Decrement new room slot if selected
            if (newBlockRef && newAcc.roomType) {
                const isSameBlockWithCache = (oldAcc.blockId === newAcc.blockId && newBlockDoc?._cachedRestoredRooms);
                const blockSourceDoc = isSameBlockWithCache 
                    ? { data: () => ({ roomTypes: newBlockDoc._cachedRestoredRooms }), exists: () => true } // Added exists() method here!
                    : newBlockDoc;

                if (blockSourceDoc && typeof blockSourceDoc.exists === 'function' && blockSourceDoc.exists()) {
                    const blockData = blockSourceDoc.data();
                    const updatedNewRooms = (blockData.roomTypes || []).map(rt => {
                        if (rt.type === newAcc.roomType) {
                            const currentRem = Number(rt.remainingRooms ?? rt.totalRooms);
                            return { ...rt, remainingRooms: Math.max(0, currentRem - 1) };
                        }
                        return rt;
                    });
                    transaction.update(newBlockRef, { roomTypes: updatedNewRooms });
                }
            }
        }

        // Update Statistics only if stats/counts changed
        if (hasCountChanged) {
            transaction.update(globalStatsRef, {
                totalAdults: increment(adultDelta),
                totalKids: increment(kidDelta),
                advancePaymentCount: increment(advanceCountDelta),
                totalAdvanceAmount: increment(advanceAmountDelta),
                "ageGroups.0-6 months": increment(ageGroupDeltas["0-6 months"]),
                "ageGroups.6-1 years": increment(ageGroupDeltas["6-1 years"]),
                "ageGroups.1-3 years": increment(ageGroupDeltas["1-3 years"]),
                "ageGroups.3-5 years": increment(ageGroupDeltas["3-5 years"]),
                "ageGroups.5-9 years": increment(ageGroupDeltas["5-9 years"]),
                "ageGroups.9-14 years": increment(ageGroupDeltas["9-14 years"]),
                "ageGroups.15 above": increment(ageGroupDeltas["15 above"]),

            });

            // Update RP Statistics if it exists
            if (repStatsRef && repDoc && repDoc.exists()) {
                transaction.update(repStatsRef, {
                    totalAdults: increment(adultDelta),
                    totalKids: increment(kidDelta),
                    advancePaymentCount: increment(advanceCountDelta),
                    totalAdvanceAmount: increment(advanceAmountDelta),
                    "ageGroups.0-6 months": increment(ageGroupDeltas["0-6 months"]),
                    "ageGroups.6-1 years": increment(ageGroupDeltas["6-1 years"]),
                    "ageGroups.1-3 years": increment(ageGroupDeltas["1-3 years"]),
                    "ageGroups.3-5 years": increment(ageGroupDeltas["3-5 years"]),
                    "ageGroups.5-9 years": increment(ageGroupDeltas["5-9 years"]),
                    "ageGroups.9-14 years": increment(ageGroupDeltas["9-14 years"]),
                    "ageGroups.15 above": increment(ageGroupDeltas["15 above"])
                });
            }
        }          
    });

    return { success: true };
};