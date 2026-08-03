import { useState } from "react";
import { submitRegistrationData } from "../service/registrationService";
import { useAuth } from '../../../../context/AuthContext';

export const sanitizeDataToUppercase = (data) => {
    if (typeof data === "string") {
        return data.toUpperCase();
    }
    if (Array.isArray(data)) {
        return data.map(item => sanitizeDataToUppercase(item));
    }
    if (data !== null && typeof data === "object") {
        return Object.keys(data).reduce((acc, key) => {
            acc[key] = sanitizeDataToUppercase(data[key]);
            return acc;
        }, {});
    }
    return data;
};

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
            const sanitizeData = sanitizeDataToUppercase(wizardData);
            const userName = user.name || user.displayName;

            await submitRegistrationData(sanitizeData, user.uid, userName);
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

