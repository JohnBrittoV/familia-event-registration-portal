import { useState } from "react";
import { submitRegistrationData } from "../service/registrationService";
import { useAuth } from '../../../../context/AuthContext';

export const useRegistrationSubmit = () => {

    const [submissionState, setSubmissionState] = useState({
        status: 'idle',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const submitForm = async (wizardData) => {
        if (!user) {
            setError("You must be logged in to submit a registration.");
            return false;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await submitRegistrationData(wizardData, user.uid);
            console.log(wizardData);
            console.log(user.uid);

            setIsSubmitting(false);
            return true;
        } catch (error) {
            setError(error.message || "An error occurred during submission.");
            setIsSubmitting(false);
            return false;
        }
    };

    return { submitForm, isSubmitting, error};
};

