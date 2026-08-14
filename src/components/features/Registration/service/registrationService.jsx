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
        // 1. ALL READS MUST HAPPEN FIRST
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