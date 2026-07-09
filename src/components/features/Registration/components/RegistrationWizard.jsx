import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { RegistrationProgress } from "./RegistrationProgress";
import { RegistrationNavigation } from "./RegistrationNavigation";
import { Step1PersonalInfo } from "./steps/Step1PersonalInfo";
import { Step2ContactDetails } from "./steps/Step2ContactDetails";
import { Step3Participation } from "./steps/Step3Participation";
import { useRegistrationSubmit } from "../hooks/useRegistrationSubmit";

export const RegistrationWizard = () => {

    const [currentStep, setCurrentStep] = useState(1);
    const { submitForm, isSubmitting, error } = useRegistrationSubmit();

    const methods = useForm({
        mode: 'onChange',
        defaultValues: {

            // Step 1:
            fullName: '',
            dob: '',
            spouseName: '',
            spouseDob: '',
            houseName: '',
            weddingAnniversary: '',
            children: [],

            // Step 2:
            parish: '',
            homeTown: '',
            address: '',
            phone1: '',
            phone2: '',

            // Step 3
            advancePaid: false,
            prayerRequest: '',
            attendees: {},
            calculatedStats: {}
        }
    });

    const { trigger, handleSubmit, formState: { isValid }} = methods;

    const handleNext = async (e) => {

        e.preventDefault();
        
        let fieldsToValidate = [];
        
        if (currentStep === 1) {
            fieldsToValidate = ['fullName', 'dob', 'spouseName', 'houseName', 'weddingAnniversary', 'children'];
        }
        else if (currentStep === 2) {
            fieldsToValidate = ['parish', 'homeTown', 'address', 'phone1'];
        }

        const isStepValid = await trigger(fieldsToValidate);
        if (isStepValid) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const onSubmit = async (data) => {
        console.log('Submitting:', data);
        try {
            const success = await submitForm(data);
            if (success) {
                alert('Registration successfully saved to Firebase!');
            }
        } catch (error) {
            // This will print the exact reason to your console
            console.error("FIREBASE ERROR CODE:", error.code);
            console.error("FIREBASE ERROR MESSAGE:", error.message);
            alert(`Failed to save: ${error.code} - ${error.message}`);
        }
        
    };

    return (

       <div className="bg-white dark:bg-slate-800 
                       rounded-3xl shadow-sm border 
                       border-slate-200 dark:border-slate-700 
                       p-6 md:p-8">

            <RegistrationProgress currentStep={currentStep} />

            <FormProvider {...methods}>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* STEP RENDERER (Placeholders for now) */}
                    <div className="min-h-[300px]">
                        {currentStep === 1 && <Step1PersonalInfo/>}

                        {currentStep === 2 && <Step2ContactDetails/>}

                        {currentStep === 3 && <Step3Participation/>}
                    
                    </div>

                    <RegistrationNavigation 
                        currentStep={currentStep} 
                        onPrev={handlePrev} 
                        onNext={handleNext} 
                        isValid={isValid} 
                    />
                </form>
            </FormProvider>
        </div>

    )
}