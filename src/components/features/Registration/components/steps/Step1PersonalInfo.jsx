import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FloatingInput } from '../../../../ui/form/FloatingInput';
import { FormSection } from '../../../../../components/layout/FormSection';
import { validationRules } from "../../schema/RegistrationSchema";
import { FormRow } from '../../../../ui/form/FormRow';
import { Plus, Trash2, ChevronDown} from 'lucide-react';

// Centralized Child Age Brackets
    const CHILD_AGE_CATEGORIES = [
        "0-6 months",
        "6-1 years",
        "1-3 years",
        "3-5 years",
        "5-9 years",
        "9-14 above"
    ];

export const Step1PersonalInfo = () => {
    const { control, register } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "children"
    });

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <FormSection title="Participant Details">
                <FormRow>
                    <FloatingInput name='fullName' label='Full Name*' validation={validationRules.name} />
                    <FloatingInput name="dob" type="date" label="Date of Birth *" validation={validationRules.dob} />
                </FormRow>
            </FormSection>

            <FormSection title="Spouse Details">
                <FormRow>
                    <FloatingInput name="spouseName" label="Spouse Name *"  validation={validationRules.name}/>
                    <FloatingInput name="spouseDob" type="date" label="Spouse DOB" validation={validationRules.optionalDate}/>
                </FormRow>
            </FormSection>

            <FormSection title="Family Information">
                <FormRow>
                    <FloatingInput name="houseName" label="House Name *" validation={validationRules.requiredText}/>
                    <FloatingInput name="weddingAnniversary" type="date" label="Wedding Anniversary *" validation={validationRules.weddingDate} />
                </FormRow>
            </FormSection>

            {/* Dynamic Children Section */}
            <FormSection title="Children" description="Add details for any children attending.">

                {/* Child Input */}
                <div className="space-y-4">
                    {fields.map((field, index) => (
                        
                        <div key={field.id} 
                             className="flex flex-col sm:flex-row gap-4 
                                        items-start p-4 bg-slate-50 
                                        dark:bg-slate-800/50 rounded-xl 
                                        border border-slate-100 
                                        dark:border-slate-700" >

                            <div className="flex-1 w-full">
                                <FloatingInput name={`children.${index}.name`} label={`Child ${index + 1} Name *`} validation={validationRules.childName}/>
                            </div>

                            {/* Child Age Dropdown Selector */}
                            <div className="w-full sm:w-48 relative">
                                <select
                                    {...register(`children.${index}.age`, { required: "Age category is required" })}
                                    className="w-full appearance-none rounded-xl border-2 border-slate-200 bg-transparent px-4 py-4 pr-10 text-sm font-medium text-slate-900 outline-none transition-colors duration-200 focus:border-blue-600 dark:border-slate-700 dark:text-white dark:focus:border-blue-500 cursor-pointer"
                                >
                                    <option value="" className="bg-white dark:bg-slate-900 text-slate-400">
                                        Select Age group
                                    </option>
                                    {CHILD_AGE_CATEGORIES.map((category) => (
                                        <option key={category} value={category} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                
                                {/* Custom Dropdown Arrow Icon */}
                                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    <ChevronDown size={18} />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="mt-2 sm:mt-1 p-3 text-red-500 
                                           hover:bg-red-50 dark:hover:bg-red-900/20 
                                           rounded-lg transition-colors 
                                           flex items-center justify-center"
                                title="Remove child">
                                <Trash2 size={20} />
                            </button>

                        </div>
                    ))}

                    {fields.length === 0 && (
                        <div className="text-center py-8 text-slate-400 
                                        border-2 border-dashed border-slate-200 
                                        dark:border-slate-700 rounded-xl">
                            No children added.
                        </div>
                    )}
                </div>

                <div className="flex justify-end mt-4 mb-4">
                    <button 
                        type="button"
                        onClick={() => append({ name: '', age: '', isAttending: false})}
                        className="flex items-center px-4 py-2 
                                 bg-blue-50 text-blue-600 
                                 hover:bg-blue-100 dark:bg-blue-900/30 
                                 dark:text-blue-400 rounded-lg font-semibold 
                                 text-sm transition-colors">

                            <Plus size={16} className="mr-2" /> Add Child

                    </button>
                </div>

            </FormSection>
        </div>
    )
}