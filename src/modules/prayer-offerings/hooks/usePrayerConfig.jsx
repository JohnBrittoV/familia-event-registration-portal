import { useState, useEffect, useCallback } from 'react';
import { prayerConfigService } from '../services/prayerConfigService';

export const usePrayerConfig = () => {
    
    const [config, setConfig] = useState({
        isBookingOpen: false,
        isHistoryVisible: true
    })
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = prayerConfigService.subscribeToConfig((data) => {
            setConfig({
                isBookingOpen: data?.isBookingOpen === true,
                isHistoryVisible: data?.isHistoryVisible !== false
            });
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);
    
    const toggleBooking = useCallback(async (newStatus) => {
        setError(null);
        try {
            await prayerConfigService.toggleFeature('isBookingOpen', newStatus);
        } catch (error) {
            setError(error.message);
        }
    }, []);

    const toggleHistory = useCallback(async (newStatus) => {
        setError(null);
        try {
            await prayerConfigService.toggleFeature('isHistoryVisible', newStatus);
        } catch (error) {
            setError(error.message);
        }
    }, []);

    return{
        isBookingOpen: config.isBookingOpen,
        isHistoryVisible: config.isHistoryVisible,
        isLoadingConfig: isLoading,
        configError: error,
        toggleBooking,
        toggleHistory
    };
};