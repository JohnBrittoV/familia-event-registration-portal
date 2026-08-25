import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Building2 } from 'lucide-react';

export const BlockModal = ({ isOpen, onClose, blockToEdit, onSave }) => {
    const [blockId, setBlockId] = useState('');
    const [blockName, setBlockName] = useState('');
    const [order, setOrder] = useState(0);
    const [roomTypes, setRoomTypes] = useState([{ type: '', roomNumbers: '' }]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Pre-fill form if editing, or reset if creating
    useEffect(() => {
        if (blockToEdit) {
            setBlockId(blockToEdit.id);
            setBlockName(blockToEdit.blockName || '');
            setOrder(blockToEdit.order || 0);
            setRoomTypes(
                blockToEdit.roomTypes && blockToEdit.roomTypes.length > 0 
                    ? blockToEdit.roomTypes.map(rt => ({ 
                        type: rt.type,
                        roomNumbers: rt.rooms ? rt.rooms.map(r => r.roomNumber).join(', ') : ''  
                    }))
                    : [{ type: '', roomNumbers: '' }]
            );
        } else {
            setBlockId('');
            setBlockName('');
            setOrder(0);
            setRoomTypes([{ type: 'Double', roomNumbers: '101, 102, 103' }]);
        }
        setError('');
    }, [blockToEdit, isOpen]);

    if (!isOpen) return null;

    // Handle adding a new empty room row
    const handleAddRoomRow = () => {
        setRoomTypes([...roomTypes, { type: '', roomNumbers: '' }]);
    };

    // Handle removing a room row
    const handleRemoveRoomRow = (index) => {
        if (roomTypes.length === 1) {
            setError('A block must have at least one room category.');
            return;
        }
        const updated = roomTypes.filter((_, i) => i !== index);
        setRoomTypes(updated);
        setError('');
    };

    // Handle changes to a specific room row field
    const handleRoomChange = (index, field, value) => {
        const updated = [...roomTypes];
        updated[index][field] = value;
        setRoomTypes(updated);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!blockId.trim() || !blockName.trim()) {
            setError('Block ID and Block Name are required fields.');
            return;
        }

        if (roomTypes.length === 0) {
            setError('Please add at least one room type.');
            return;
        }

        const formattedRoomTypes = [];

        for (const rt of roomTypes) {
            if (!rt.type.trim()) {
                setError('All room types must have a valid name (e.g., Double, Single).');
                return;
            }
            
            // Parse comma separated room numbers
            const roomNums = rt.roomNumbers
                .split(',')
                .map(num => num.trim())
                .filter(Boolean);

            if (roomNums.length === 0) {
                setError(`Please enter at least one room number for ${rt.type}.`);
                return;
            }

            // Map into structured room objects, preserving occupancy state if editing
            const existingTypeData = blockToEdit?.roomTypes?.find(r => r.type === rt.type);
            const roomsArray = roomNums.map(num => {
                const existingRoom = existingTypeData?.rooms?.find(r => r.roomNumber === num);
                return {
                    roomNumber: num,
                    isOccupied: existingRoom ? existingRoom.isOccupied : false,
                    occupiedBy: existingRoom ? existingRoom.occupiedBy : null
                };
            });

            const total = roomsArray.length;
            const occupiedCount = roomsArray.filter(r => r.isOccupied).length;
            const remaining = total - occupiedCount;

            formattedRoomTypes.push({
                type: rt.type.trim(),
                totalRooms: total,
                remainingRooms: remaining,
                rooms: roomsArray
            });
        }

        setSubmitting(true);

        // Prepare payload
        const payload = {
            blockName: blockName.trim(),
            order: Number(order) || 0,
            roomTypes: formattedRoomTypes
        };

        const result = await onSave(blockId.trim().toLowerCase().replace(/\s+/g, '_'), payload);
        setSubmitting(false);

        if (result.success) {
            onClose();
        } else {
            setError(result.error || 'Failed to save accommodation block.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-8">
                
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                            <Building2 size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {blockToEdit ? 'Edit Accommodation Block' : 'Add New Accommodation Block'}
                        </h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                                Block ID
                            </label>
                            <input 
                                type="text"
                                value={blockId}
                                onChange={(e) => setBlockId(e.target.value)}
                                disabled={Boolean(blockToEdit)}
                                placeholder="e.g. st_marys"
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-60"
                                required
                            />
                            <p className="text-[11px] text-slate-400 mt-1">Unique identifier (cannot be changed).</p>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                                Block Name
                            </label>
                            <input 
                                type="text"
                                value={blockName}
                                onChange={(e) => setBlockName(e.target.value)}
                                placeholder="e.g. St. Mary's block"
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                            Display Order Priority
                        </label>
                        <input 
                            type="number"
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            className="w-full sm:w-1/2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Room Types & Specific Room Numbers Builder */}
                    <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                Room Categories & Specific Room Numbers
                            </label>
                            <button
                                type="button"
                                onClick={handleAddRoomRow}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                <Plus size={14} /> Add Category
                            </button>
                        </div>

                        <div className="space-y-3">
                            {roomTypes.map((room, index) => (
                                <div key={index} className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <div className="w-full sm:w-1/3">
                                        <input 
                                            type="text"
                                            value={room.type}
                                            onChange={(e) => handleRoomChange(index, 'type', e.target.value)}
                                            placeholder="Category (e.g. Double)"
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="w-full sm:flex-1">
                                        <input 
                                            type="text"
                                            value={room.roomNumbers}
                                            onChange={(e) => handleRoomChange(index, 'roomNumbers', e.target.value)}
                                            placeholder="Rooms (e.g. 101, 102, 103)"
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveRoomRow(index)}
                                        className="self-end sm:self-center p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                                        title="Remove Row"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <p className="text-[11px] text-slate-400">Separate individual room numbers with commas (e.g., 101, 102, 103).</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50"
                        >
                            {submitting ? 'Saving...' : (blockToEdit ? 'Update Block' : 'Create Block')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};