import { useState, useEffect, useCallback } from 'react';
import { prayerConfigService } from '../services/prayerConfigService';
import { nextWednesdayWithOptions } from 'date-fns/fp';

export const usePrayerConfig = () => {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = prayerConfigService.subscribeToConfig((status) => {
            setIsBookingOpen(status === true);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const toggleBooking = useCallback(async (newStatus) => {
        setError(null);
        try {
            await prayerConfigService.toggleBookingStatus(newStatus);
        } catch (error) {
            setError(error.message);
        }
    }, []);

    return{
        isBookingOpen,
        isLoadingConfig: isLoading,
        configError: error,
        toggleBooking
    };
};