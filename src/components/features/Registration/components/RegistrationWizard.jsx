import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { RegistrationProgress } from "./RegistrationProgress";
import { RegistrationNavigation } from "./RegistrationNavigation";
import { Step1PersonalInfo } from "./steps/Step1PersonalInfo";
import { Step2ContactDetails } from "./steps/Step2ContactDetails";
import { Step3Participation } from "./steps/Step3Participation";
import { useRegistrationSubmit } from "../hooks/useRegistrationSubmit";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

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
        console.log(data);

        setSubmissionStatus('submitting');
        try {
            const success = await submitForm(data);
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

    const renderActionContent = () => {
        if (submissionStatus === 'success') {
            return (
                <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center animate-in fade-in zoom-in duration-300">
                    <CheckCircle2 className="text-emerald-500 w-16 h-16 animate-bounce" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Registration Successful</h3>
                    <p className="text-emerald-700 dark:text-emerald-300 font-medium max-w-sm">{feedback.message}</p>
                    <button onClick={resetToIdle}
                            className="mt-4 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm transition-colors text-sm">
                        Submit Another Participant
                    </button>
                </div>
            );
        }

        if (submissionStatus === 'error') {
            return(
                <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center animate-in fade-in zoom-in duration-300">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Submission Failed</h3>
                    <p className="text-red-600 dark:text-red-400 font-medium max-w-sm">{feedback.message}</p>
                    <button onClick={resetToIdle}
                            className="mt-4 px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-sm transition-colors text-sm">
                        Try Again
                    </button>
                </div>
            );
        }
        return null;
    }

    return (

       <div className="bg-white dark:bg-slate-800 
                       rounded-3xl shadow-sm border 
                       border-slate-200 dark:border-slate-700 
                       p-6 md:p-8">

                {(submissionStatus === "success" || submissionStatus === "error") ? (
                    renderActionContent()
                ) : (
                    <>
                        <RegistrationProgress currentStep={currentStep} />

                            <FormProvider {...methods}>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    
                                    {/* STEP RENDERER (Placeholders for now) */}
                                    <div className="min-h-75">
                                        {currentStep === 1 && <Step1PersonalInfo/>}

                                        {currentStep === 2 && <Step2ContactDetails/>}

                                        {currentStep === 3 && <Step3Participation/>}
                                    
                                    </div>

                                    <RegistrationNavigation 
                                        currentStep={currentStep} 
                                        onPrev={handlePrev} 
                                        onNext={handleNext} 
                                        isValid={isValid} 
                                        isSubmitting={isSubmitting}
                                    />
                                </form>
                            </FormProvider>
                    </>
                )}

    </div>

    )
}