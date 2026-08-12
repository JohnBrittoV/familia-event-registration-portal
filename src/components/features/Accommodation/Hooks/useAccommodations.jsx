import React, { useState, useEffect, useCallback } from 'react';
import {
    getAccommodations, 
    createAccommodationBlock, 
    updateAccommodationBlock, 
    deleteAccommodationBlock 
} from '../Service/accommodationService';

export const useAccommodations = () => {
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch blocks from Firestore (optimized to avoid continous background reads)
    const fetchBlocks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAccommodations();
            
            if (response.success) {
                const sortedBlocks = (response.data || []).sort((a, b) => (a.order || 0) - (b.order || 0));
                setBlocks(sortedBlocks);
            }

        } catch (error) {
            console.error("Failed to fetch accommodations:", error);
            setError(error.message || "Failed to load accommodations");
        }
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlocks();
    }, [fetchBlocks]);

    // Handle creating a new block with instant state refresh
    const handleCreateBlock = async (blockId, blockData) => {
        try {
            await createAccommodationBlock(blockId, blockData);
            await fetchBlocks(); 
            return { success: true };
        } catch (error) {
            console.error("Failed to create block:", error);
            return { success: false, error: error.message };
        }
    };

    // Handle updating an existing block with instant state refresh
    const handleUpdateBlock = async (blockId, updatedData) => {
        try {
            await updateAccommodationBlock(blockId, updatedData);
            await fetchBlocks();
            return { success: true };
        } catch (error) {
            console.error("Failed to update block:", error);
            return { success: false, error: error.message };
        }
    };

    // Handle deleting a block with instant state refresh
    const handleDeleteBlock = async (blockId) => {
        try {
            await deleteAccommodationBlock(blockId);
            await fetchBlocks(); 
            return { success: true };
        } catch (error) {
            console.error("Failed to delete block:", error);
            return { success: false, error: error.message };
        }
    };

    return {
        blocks,
        loading, 
        error,
        refreshBlocks: fetchBlocks,
        createBlock: handleCreateBlock,
        updateBlock: handleUpdateBlock,
        deleteBlock: handleDeleteBlock
    };

};

