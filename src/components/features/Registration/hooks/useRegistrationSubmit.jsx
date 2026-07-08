import { useState } from "react";
import { submitRegistrationData } from "../service/registrationService";
import { useAuth } from '../../../../context/AuthContext';

export const useRegistrationSubmit = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    const submitForm = async (wizardData) => {
        if (!currentUser) {
            setError("You must be logged in to submit a registration.");
            return false;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await submitRegistrationData(wizardData, currentUser.uid);
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

