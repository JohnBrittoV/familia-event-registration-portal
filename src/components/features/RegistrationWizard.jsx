import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { FloatingInput } from '../ui/FloatingInput';
import { FloatingTextarea } from '../ui/FloatingTextarea';

export const RegistrationWizard = () => {

    const [currentStep, setCurrentStep] = useState(1);
    const methods = useForm({
        mode: 'onChange',
        defaultValues: {
            fullName: '',
            dob: '',
            spouseName: '',
            spouseDob: ''
        }
    });

    const { trigger, handleSubmit, formState: {isValid}} = methods;
    const nextStep = async () => {

        let fieldsToValidate = [];        
        if (currentStep === 1) fieldsToValidate = ['fullName', 'dob'];
        if (currentStep === 2) fieldsToValidate = ['houseName', 'parish', 'phone', 'address'];

        const isStepValid = await trigger(fieldsToValidate);
        if (isStepValid) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    const prevStep = (e) => {
        e.preventDefault();
        setCurrentStep(prev => Math.max(prev - 1, 1));
    }

    const onSubmit = (data) => {
        console.log('Final Data ready for Firebase:', data);
        alert('Check the console to see the JSON data!');
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
            
            {/* --- PROGRESS BAR --- */}
            <div className="mb-8 border-b border-slate-100 dark:border-slate-700 pb-6">
                <div className="flex items-center justify-between text-sm font-medium">
                    <span className={currentStep >= 1 ? "text-blue-600 font-bold" : "text-slate-400"}>1. Personal Info</span>
                    <ChevronRight size={16} className="text-slate-300 mx-2" />
                    <span className={currentStep >= 2 ? "text-blue-600 font-bold" : "text-slate-400"}>2. Event Details</span>
                    <ChevronRight size={16} className="text-slate-300 mx-2" />
                    <span className={currentStep === 3 ? "text-blue-600 font-bold" : "text-slate-400"}>3. Review</span>
                </div>
            </div>

            {/* --- FORM PROVIDER SHELL --- */}
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* --- STEP 1: PERSONAL INFO --- */}
                    {currentStep === 1 && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Participant Details</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FloatingInput 
                                    name="fullName" 
                                    label="Full Name *" 
                                    validation={{ required: "Name is required" }} 
                                />
                                <FloatingInput 
                                    name="dob" 
                                    type="date" 
                                    label="Date of Birth *" 
                                    validation={{ required: "Date of Birth is required" }} 
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <FloatingInput 
                                    name="spouseName" 
                                    label="Spouse Name" 
                                    validation={{ required: "Spouse Name is required"}}
                                />
                                <FloatingInput 
                                    name="spouseDob" 
                                    type="date" 
                                    label="Spouse DOB" 
                                />
                            </div>
                        </div>
                    )}

                    {/* --- STEP 2 PLACEHOLDER --- */}
                    {currentStep === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Contact & Parish</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FloatingInput 
                                    name="houseName" 
                                    label="House Name *" 
                                    validation={{ required: "House name is required" }} 
                                />
                                <FloatingInput 
                                    name="parish" 
                                    label="Parish Name *" 
                                    validation={{ required: "Parish name is required" }} 
                                />
                            </div>

                            <FloatingInput 
                                name="phone" 
                                type="tel"
                                label="Phone Number *" 
                                validation={{ 
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: "Please enter exactly 10 digits"
                                    }
                                }} 
                            />

                            <FloatingTextarea 
                                name="address" 
                                label="Full Address *" 
                                validation={{ required: "Address is required" }} 
                            />

                        </div>
                    )}

                    {/* --- STEP 3 PLACEHOLDER --- */}
                    {currentStep === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-8">
                            <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Ready to Submit</h3>
                            <p className="text-slate-500">Please review your information before finalizing.</p>
                        </div>
                    )}

                    {/* --- NAVIGATION BUTTONS --- */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-700 mt-8">
                        <Button 
                            type="button" 
                            variant="secondary" 
                            onClick={prevStep} 
                            disabled={currentStep === 1}
                            className={currentStep === 1 ? 'invisible' : ''}
                        >
                            <ChevronLeft size={18} className="mr-1" /> Back
                        </Button>

                        {currentStep < 3 ? (
                            <Button type="button" onClick={nextStep}>
                                Next Step <ChevronRight size={18} className="ml-1" />
                            </Button>
                        ) : (
                            <Button type="submit" disabled={!isValid}>
                                Confirm Registration
                            </Button>
                        )}
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}