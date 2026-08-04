import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase.config';

export const createSupportTicket = async (ticketData) => {
    try {
        const docRef = await addDoc(collection(db, "supportTickets"), {
            ...ticketData,
            status: 'Open', // Default ticket status
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating support ticket in database:", error);
        throw new Error("Failed to submit support request.");
    }
};