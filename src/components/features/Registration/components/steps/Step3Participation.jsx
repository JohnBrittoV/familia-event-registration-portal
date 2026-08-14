import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormSection } from '../../../../layout/FormSection';
import { FloatingTextarea } from '../../../../ui/form/FloatingTextarea';
import { StatCard } from '../../../../ui/StatCard';
import { useAccommodations } from '../../../Accommodation/Hooks/useAccommodations';
import { useToast } from '../../../../../context/ToastContext';
import { Users, User, Baby, Building2, BedDouble } from 'lucide-react';

export const Step3Participation = ({ attemptedSubmit }) => {
    const { watch, setValue, register } = useFormContext();
    const { blocks, loading: accommodationLoading } = useAccommodations();
    const { showToast } = useToast();

    const isAdvancePaid = watch('advancePaid');
    const selectedBlockId = watch('accommodation.blockId');
    const selectedRoomType = watch('accommodation.roomType');

    const [ touched, setTouched ] = useState(false);

    // 1. "Watch" the data from Step 1
    const fullName = watch("fullName");
    const spouseName = watch("spouseName");
    const children = watch("children") || [];
    const attendees = watch("attendees") || {}; 

    // 2. Auto-calculate statistics whenever a checkbox is clicked
    const stats = useMemo(() => {
        let adults = 0;
        let kids = 0;
        let ageGroups = { "0-2": 0, "3-5": 0, "6-8": 0, "9-11": 0, "12-14": 0 };

        if (attendees['self']) adults++;
        if (spouseName && attendees['spouse']) adults++;

        children.forEach((child) => {
            if (child?.isAttending) {
                kids++;
                const age = parseInt(child.age, 10);
                if (!isNaN(age)) {
                    if (age <= 2) ageGroups["0-2"]++;
                    else if (age <= 5) ageGroups["3-5"]++;
                    else if (age <= 8) ageGroups["6-8"]++;
                    else if (age <= 11) ageGroups["9-11"]++;
                    else if (age <= 14) ageGroups["12-14"]++;
                }
            }
        });

        return { adults, kids, total: adults + kids, ageGroups };
    }, [JSON.stringify(attendees), spouseName, JSON.stringify(children)]);

    // 3. Save the calculated stats into the form payload for Firebase
    useEffect(() => {
        setValue('calculatedStats', stats);
    }, [stats, setValue]);

    // Validation checks for Step 3 requirements
    const isAdultsValid = stats.adults >= 2;
    const isAccommodationValid = Boolean(selectedBlockId && selectedRoomType);
    
    // Find currently selected block object
    const currentBlock = blocks.find(b => b.id === selectedBlockId);

    // Handle block selection change
    const handleBlockSelect = (block) => {
        setValue('accommodation.blockId', block.id);
        setValue('accommodation.blockName', block.blockName);
        setValue('accommodation.roomType', ''); // Reset room type when block changes
    };

    // Handle room type selection change
    const handleRoomSelect = (roomType, remaining) => {
        if (remaining <= 0) {
            showToast("This room category is fully occupied.", "error");
            return;
        }
        setValue('accommodation.roomType', roomType);
    };

    // Custom reusable Checkbox Row for family members
    const CheckboxRow = ({ fieldName, label, subtitle }) => (
        <label className="flex items-center justify-between p-4 
                          bg-slate-50 dark:bg-slate-800/50 border 
                          border-slate-200 dark:border-slate-700 
                          rounded-xl cursor-pointer hover:bg-slate-100 
                          dark:hover:bg-slate-800 transition-colors mb-3">

            <div className="flex items-center gap-4">
                <input
                    type="checkbox"
                    {...register(fieldName)}
                    className="w-5 h-5 text-blue-600 rounded 
                               border-slate-300 focus:ring-blue-500 
                               cursor-pointer"
                />

                <div>
                    <p className="font-bold text-slate-900 
                                dark:text-white">{label}</p>
                    {subtitle && <p className="text-xs font-medium text-slate-500">{subtitle}</p>}
                </div>

            </div>
        </label>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <FormSection 
                title="Event Participation" 
                description="Select the family members who will be attending Familia26."
            >
                <div className="mb-6">
                    {/* Render Husband/Wife */}
                    {fullName && <CheckboxRow fieldName="attendees.self" label={fullName} subtitle="Participant" />}
                    {spouseName && <CheckboxRow fieldName="attendees.spouse" label={spouseName} subtitle="Spouse" />}
                    
                    {/* Render Children Dynamically */}
                    {children.map((child, index) => (
                        child.name && child.age ? (
                            <CheckboxRow 
                                key={index} 
                                fieldName={`children.${index}.isAttending`} 
                                label={child.name} 
                                subtitle={`Child (Age: ${child.age})`} 
                            />
                        ) : null
                    ))}
                </div>

                {/* Inline Error Message for Adult Participation Rule (Visible only after confirmation attempt) */}
                {attemptedSubmit && !isAdultsValid && (
                    <p className="text-xs font-medium text-red-500 mt-1 mb-6 animate-in fade-in duration-200">
                        Two adults must be selected to proceed with the family registration.
                    </p>
                )}

            </FormSection>

            {/* --- The Dynamic Summary Dashboard --- */}
            <div className="mb-8">
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Registration Summary</h4>
                
                {/* Changed to grid-cols-1 md:grid-cols-3 so the StatCards stack nicely on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard 
                        title="Total Attendees" 
                        value={stats.total} 
                        icon={Users} 
                    />
                    <StatCard 
                        title="Adults" 
                        value={stats.adults} 
                        icon={User} 
                    />
                    <StatCard 
                        title="Children" 
                        value={stats.kids} 
                        icon={Baby} 
                    />
                </div>
            </div>
           

            <FormSection title="Final Details">
                <label className="flex items-center gap-3 mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <input 
                        type="checkbox" 
                        {...register("advancePaid")} 
                        className="w-5 h-5 text-emerald-500 rounded border-slate-300 focus:ring-emerald-500" 
                    />
                    <span className="font-semibold text-slate-900 dark:text-white">Advance Payment Collected</span>
                </label>

            {/* Conditionally Rendered Amount Input with Smooth Reveal */}
            {isAdvancePaid && (
                <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                        Advance Amount Collected *
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-semibold text-sm">
                            ₹
                        </span>
                        <input 
                            type="number"
                            step="0.01"
                            placeholder="Enter amount"
                            {...register("advanceAmount", { 
                                required: isAdvancePaid ? "Advance amount is required" : false,
                                min: { value: 1, message: "Amount must be greater than 0" }
                            })}
                            className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-1 focus:ring-blue-400 text-slate-800 dark:text-slate-100 text-sm font-medium"
                        />
                    </div>
                </div>
            )}

            {/* --- Accommodation Selection Section --- */}
                <div className="mb-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-3">
                        <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h5 className="font-bold text-slate-900 dark:text-white text-sm">Accommodation Allotment</h5>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                        Select an accommodation block and available room type for this family.
                    </p>

                    {accommodationLoading ? (
                        <p className="text-xs text-slate-400">Loading accommodation blocks...</p>
                    ) : blocks.length === 0 ? (
                        <p className="text-xs text-slate-400">No accommodation blocks configured by admin yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {/* 1. Block Selection Cards */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Select Block</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {blocks.map((block) => {
                                        const isSelected = selectedBlockId === block.id;
                                        return (
                                            <div
                                                key={block.id}
                                                onClick={() => handleBlockSelect(block)}
                                                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                                    isSelected 
                                                        ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-sm' 
                                                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                                }`}
                                            >
                                                <span className={`font-semibold text-sm ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'}`}>
                                                    {block.blockName}
                                                </span>
                                                <BedDouble size={18} className={isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 2. Room Type Selector (Appears only when a block is chosen) */}
                            {currentBlock && (
                                <div className="animate-in fade-in duration-200 pt-2">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Select Room Category</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {(currentBlock.roomTypes || []).map((room, idx) => {
                                            const remaining = Number(room.remainingRooms) ?? Number(room.totalRooms);
                                            const isFullyOccupied = remaining === 0;
                                            const isSelected = selectedRoomType === room.type;

                                            // Check if room type represents a dormitory to switch wording to "Beds"
                                            const isDorm = room.type.toLowerCase().includes('dormitory');
                                            const unitLabel = isDorm ? 'Beds' : 'Rooms';

                                            return (
                                                <div
                                                    key={idx}
                                                    onClick={() => !isFullyOccupied && handleRoomSelect(room.type, remaining)}
                                                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                                                        isFullyOccupied 
                                                            ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800' 
                                                            : isSelected 
                                                                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 cursor-pointer shadow-sm' 
                                                                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-slate-300'
                                                    }`}
                                                >
                                                    <div>
                                                        <p className={`font-semibold text-sm ${isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-200'}`}>
                                                            {room.type}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                            {isFullyOccupied ? 'Fully Occupied' : `${remaining} ${unitLabel} Available`}
                                                        </p>
                                                    </div>
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                        isFullyOccupied 
                                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                                                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                    }`}>
                                                        {isFullyOccupied ? 'Full' : `${remaining} Left`}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                   {/* Inline Error Message for Accommodation Rule (Visible only after confirmation attempt) */}
                    {attemptedSubmit && !isAccommodationValid && (
                        <p className="text-xs font-medium text-red-500 mt-3 animate-in fade-in duration-200">
                            Please select both an accommodation block and a room type to complete your booking.
                        </p>
                    )}

                </div>

                <FloatingTextarea name="prayerRequest" label="Prayer Request (Optional)" rows={4} />
            </FormSection>

        </div>
    );
};