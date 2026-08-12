import React from 'react';
import { Edit2, Trash2, Layers } from 'lucide-react';

export const AccommodationGrid = ({ blocks, onEdit, onDelete }) => {
    if (!blocks || blocks.length === 0) {
        return (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <Layers className="mx-auto text-slate-400 mb-3" size={40} />
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No Accommodation Blocks Found</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Get started by creating your first block using the button above.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {blocks.map((block) => (
                <div 
                    key={block.id} 
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between transition-all"
                >
                    {/* Card Header */}
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">{block.blockName}</h4>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => onEdit(block)}
                                className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                title="Edit Block"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button 
                                onClick={() => onDelete(block.id)}
                                className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                title="Delete Block"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Room Types Breakdown List */}
                    <div className="p-5 space-y-3 flex-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Room Type Availability</p>
                        <div className="space-y-2.5">
                            {(block.roomTypes || []).map((room, idx) => {
                                const total = Number(room.totalRooms) || 0;
                                const remaining = Number(room.remainingRooms) ?? total;
                                const booked = total - remaining;
                                const isSoldOut = remaining === 0;

                                return (
                                    <div 
                                        key={idx}
                                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800"
                                    >
                                        <div>
                                            <span className="font-medium text-slate-800 dark:text-slate-200 text-sm">{room.type}</span>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                Booked: {booked} / {total}
                                            </div>
                                        </div>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                            isSoldOut 
                                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                        }`}>
                                            {remaining} Left
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-5 py-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex justify-between">
                        <span>Display Order: {block.order || 0}</span>
                        <span>ID: {block.id}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}