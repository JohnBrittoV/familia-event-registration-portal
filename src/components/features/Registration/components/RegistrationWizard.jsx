import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { RegistrationProgress } from "./RegistrationProgress";
import { RegistrationNavigation } from "./RegistrationNavigation";
import { Step1PersonalInfo } from "./steps/Step1PersonalInfo";
import { Step2ContactDetails } from "./steps/Step2ContactDetails";
import { Step3Participation } from "./steps/Step3Participation";
import { useRegistrationSubmit } from "../hooks/useRegistrationSubmit";
import { CardMessage } from "../../../ui/CardMessage";

export const RegistrationWizard = () => {

    const [submissionStatus, setSubmissionStatus] = useState('idle');
    const [feedback, setFeedback] = useState({type: '', message: ''});
    const [currentStep, setCurrentStep] = useState(1);
    const { submitForm, isSubmitting, error } = useRegistrationSubmit();

    const defaultFormValues = {
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

    const methods = useForm({
        mode: 'onChange',
        defaultValues: defaultFormValues,
    });

    const { trigger, handleSubmit, formState: { isValid }, reset } = methods;

    // Sync hooks error into feedback when it's appear
    useEffect(() => {
        if (error) {
            setFeedback({ type: 'error', message: error});
            setSubmissionStatus('error');
        }
    }, [error]);

    // Reset Every thing back to idle
    const resetToIdle = () => {
        reset(defaultFormValues);
        setCurrentStep(1);
        setSubmissionStatus('idle');
        setFeedback({ type: '', message: ''});
    }

    // Next button handle
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

        const upperCaseData = Object.fromEntries(
            Object.entries(data).map(([Key, value]) => [
                Key,
                typeof value === "string" ? value.toUpperCase() : value
            ])
        );

        console.log(upperCaseData)

        setSubmissionStatus('submitting');
        try {
            const success = await submitForm(upperCaseData);
            if (success) {
                setFeedback({ type: 'success', message: 'Registration successfully saved!'});
                setSubmissionStatus('success');
            }
            else {
                setFeedback({ type: 'error', message: 'Submission failed for an unknown reason.'});
                setSubmissionStatus('error');
            }
        } catch (error) {
            console.error("submission error", error.message);
            setFeedback({type: 'error', message: `Failed: ${error.message}`});    
            setSubmissionStatus('error');
        }
    };

    const renderActionButton = () => {
        if (submissionStatus === 'success') {
            return (
                <button onClick={resetToIdle}
                        className="mt-3 px-6 py-2 bg-blue-600 
                                   text-white rounded-full 
                                   font-semibold hover:bg-blue-700 
                                   transition-colors">
                    Submit Another
                </button>
            )
        }
        if (submissionStatus === 'error') {
            return(
                <button
                        onClick={resetToIdle}
                        className="mt-3 px-6 py-2 bg-red-600 
                                   text-white rounded-full font-semibold 
                                   hover:bg-red-700 transition-colors"
                        >
                    Try Again
                </button>

            );
        }
        return null;
    }

    return (

       <div className="bg-white dark:bg-slate-800 
                       rounded-3xl shadow-sm border 
                       border-slate-200 dark:border-slate-700 
                       p-6 md:p-8">

                {(submissionStatus === "success" || submissionStatus === "error") && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardMessage
                        type={feedback.type}
                        message={feedback.message}
                        onDismiss={null} // optional, but we keep the card until user clicks the action button
                    />
                    <div className="flex justify-center mt-2">{renderActionButton()}</div>
                    </div>
                )}

        {submissionStatus === 'idle' || submissionStatus === 'submitting' ? (
            <>
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
            </>
        )   : null }

    </div>

    )
}