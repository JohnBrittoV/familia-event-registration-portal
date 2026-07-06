import React, { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormSection } from '../../../../layout/FormSection';

import { FloatingTextarea } from '../../../../ui/form/FloatingTextarea';
import { StatCard } from '../../../../ui/StatCard';
import { Users, User, Baby } from 'lucide-react';

export const Step3Participation = () => {
    const { watch, setValue, register } = useFormContext();

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

        children.forEach((child, index) => {
            if (attendees[`child_${index}`]) {
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
    }, [attendees, spouseName, children]);

    // 3. Save the calculated stats into the form payload for Firebase
    useEffect(() => {
        setValue('calculatedStats', stats);
    }, [stats, setValue]);

    // Custom reusable Checkbox Row for family members
    const CheckboxRow = ({ id, label, subtitle }) => (
        <label className="flex items-center justify-between p-4 
                          bg-slate-50 dark:bg-slate-800/50 border 
                          border-slate-200 dark:border-slate-700 
                          rounded-xl cursor-pointer hover:bg-slate-100 
                          dark:hover:bg-slate-800 transition-colors mb-3">

            <div className="flex items-center gap-4">
                <input
                    type="checkbox"
                    // Check if this specific person is toggled
                    checked={!!attendees[id]}
                    // Toggle their state in the master form
                    onChange={() => setValue(`attendees.${id}`, !attendees[id], { shouldValidate: true })}
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
                    {fullName && <CheckboxRow id="self" label={fullName} subtitle="Primary Registrant" />}
                    {spouseName && <CheckboxRow id="spouse" label={spouseName} subtitle="Spouse" />}
                    
                    {/* Render Children Dynamically */}
                    {children.map((child, index) => (
                        child.name && child.age ? (
                            <CheckboxRow 
                                key={index} 
                                id={`child_${index}`} 
                                label={child.name} 
                                subtitle={`Child (Age: ${child.age})`} 
                            />
                        ) : null
                    ))}
                </div>
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

                <FloatingTextarea name="prayerRequest" label="Prayer Request (Optional)" rows={4} />
            </FormSection>

        </div>
    );
};