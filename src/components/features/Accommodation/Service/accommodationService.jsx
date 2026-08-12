import { db } from "../../../../config/firebase.config";
import { collection, doc, getDocs, getDoc, setDoc, 
         updateDoc, deleteDoc, serverTimestamp 
        } from 'firebase/firestore';

const COLLECTION_NAME = 'accommodations';

// Fetch all accommodation blocks and their room inventories. 

export const getAccommodations = async() => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const blocks = [];
        querySnapshot.forEach((docSnap) => {
            blocks.push({id: docSnap.id, ...docSnap.data() });
        })
        return { success: true, data: blocks};
    } catch (error) {
        console.error('Error fetching accommodations:', error);
        throw error;
    }
};

// Create new accommodation block with its specified room types
export const createAccommodationBlock = async (blockId, blockData) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, blockId);

        // Ensure remainingRooms matches totalRooms initially for new entries
        const formattedRoomTypes = (blockData.roomTypes || []).map(rt => ({
            type: rt.type,
            totalRooms: Number(rt.totalRooms || 0),
            remainingRooms: Number(rt.totalRooms || 0)
        }));

        await setDoc(docRef, {
            blockName: blockData.blockName,
            order: Number(blockData.order || 0),
            roomTypes: formattedRoomTypes,
            createdAt: serverTimestamp()
        });

        return { success: true};
    } catch (error) {
        console.error("Error creating accommodation block:", error);
        throw error;
    }
};

// Update an existing block details or room count
export const updateAccommodationBlock = async (blockId, updatedData) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, blockId);

        // If roomTypes are being updated, ensure proper structure
        const payload = {
            ...updatedData,
            updatedAt: serverTimestamp()
        };

        if (updatedData.roomTypes) {
            payload.roomTypes = updatedData.roomTypes.map(rt => ({
                type: rt.type,
                totalRooms: Number(rt.totalRooms || 0),
                remainingRooms: Number(rt.remainingRooms ?? rt.totalRooms ?? 0)
            }));
        }

        await updateDoc(docRef, payload);
        return { success: true };

    } catch (error) {
        console.error("Error updating accommodation block:", error);
        throw error;
    }
};

// Delete an accommodation block by its ID
export const deleteAccommodationBlock = async (blockId) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, blockId);
        await deleteDoc(docRef);
        return { success: true };
    } catch (error) {
        console.error("Error deleting accommodation block:", error);
        throw error;
    }
};