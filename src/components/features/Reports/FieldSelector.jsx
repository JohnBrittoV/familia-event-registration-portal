import React from 'react';
import { CheckSquare, Square } from 'lucide-react';

export const FieldSelector = ({ selectedFields, onChange }) => {
    
    // Keys match your exact Firebase field names
    const fieldLabels = {
        fullName: "Full Name",
        spouseName: "Spouse Name",
        houseName: "House Name",
        homeTown: "Home Town",
        parish: "Parish",
        phone1: "Mobile Number",
        totalMembers: "Total Members",
        advanceAmount: "Advance Payment",
        weddingAnniversary: "Wedding Anniversary",
        createdAt: "Registration Date"
    };

    const toggleField = (key) => {
        onChange({
            ...selectedFields,
            [key]: !selectedFields[key]
        });
    };

    return (
        <div className="space-y-3 mb-8">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Select Fields to Include in Export
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.keys(fieldLabels).map((key) => {
                    const isSelected = selectedFields[key];
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => toggleField(key)}
                            className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all text-left ${
                                isSelected 
                                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-xs' 
                                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                        >
                            {isSelected ? (
                                <CheckSquare size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                            ) : (
                                <Square size={16} className="text-slate-400 shrink-0" />
                            )}
                            <span className="truncate">{fieldLabels[key]}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};