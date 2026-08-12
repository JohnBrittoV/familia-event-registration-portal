import React, { useState } from 'react';
import { Greeting } from '../../Greeting';
import { useAuth } from '../../../../context/AuthContext';
import { useAccommodations } from '../Hooks/useAccommodations';
import { Spinner } from '../../../ui/Spinner';
import { Building2, Plus, Edit2, Trash2, Layers } from 'lucide-react';
import { AccommodationGrid } from '../components/AccommodationGrid';
import { BlockModal } from '../components/BlockModal';

export const AdminAccommodationPage = () => {

    const { user } = useAuth();
    const { blocks, loading, error, createBlock, updateBlock, deleteBlock } = useAccommodations();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBlock, setSelectedBlock] = useState(null);

    // Open modal
    const handleOpenCreateModal = () => {
        setSelectedBlock(null);
        setIsModalOpen(true);
    };

    // Open edit modal
    const handleOpenEditModal = (block) => {
        setSelectedBlock(block);
        setIsModalOpen(true);
    };

    // close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBlock(null);
    };

    // create modal / update modal
    const handleSaveBlock = async (blockId, blockData) => {
        let res;
        if (selectedBlock) {
            // Update existing block
            res = await updateBlock(blockId, blockData);
        } else {
            // Create new block
            res = await createBlock(blockId, blockData);
        }
        return res;
    };

    // delete modal
    const handleDelete = async (blockId) => {
        if (window.confirm("Are you sure you want to delete this accommodation block?")) {
            const res = await deleteBlock(blockId);
            if (!res.success) {
                alert(res.error || "Failed to delete block");
            }
        }
    };


    return(

        <div className='max-w-7xl mx-auto space-y-8 pb-12'>
            <Greeting 
                name={user?.displayName} 
                role="Admin" 
                subtitle="Manage accommodation areas and thier room details."/>
                                        
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3">
                    
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                        <Building2 size={24} />
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Accommodation Blocks</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Configure lodging locations and live room capacities.</p>
                    </div>
                </div>

                <button
                    onClick={handleOpenCreateModal}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-600/20"
                >
                    <Plus size={18} />
                    <span>Add New Block</span>
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="py-20 flex justify-center">
                    <Spinner size="lg" />
                </div>
            ) : (
                /* Accommodation Grid Component */
                <AccommodationGrid 
                    blocks={blocks} 
                    onEdit={handleOpenEditModal} 
                    onDelete={handleDelete} 
                />
            )}

            {/* Block Modal Component for Creating/Editing */}
            <BlockModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                blockToEdit={selectedBlock}
                onSave={handleSaveBlock}
            />
                                
        </div>  
    )
}