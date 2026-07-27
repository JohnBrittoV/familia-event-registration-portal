import { useState, useCallback, useEffect } from "react";
import { prayerBookingService } from "../services/prayerBookingService";

export const usePrayerBooking = (userMobile, initialName) => {
    
    const today = new Date().toISOString().split('T')[0];
    const MAX_DATE = '2026-08-29';
    
    const [selectedDate, setSelectedDate] = useState(today);
    const [customName, setCustomName] = useState(initialName || '');
    const [selectedPrayers, setSelectedPrayers] = useState([]);
    const [bookedPrayersForDate, setBookedPrayersForDate] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal States
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: '',
        message: ''
    });

    // Check availability whenever the date changes
    useEffect(() => {
        const checkAvailability = async () => {
        if (!selectedDate) return;

        const booked = await prayerBookingService.getGlobalBookingsForDate(selectedDate);
        setBookedPrayersForDate(booked);
        
        // Auto-deselect prayers if they are already booked on the newly selected date
        setSelectedPrayers(prev => prev.filter(prayer => !booked.includes(prayer)));
        };

        checkAvailability();
    }, [selectedDate]);

    const togglePrayer = useCallback((prayerId) => {
        if (bookedPrayersForDate.includes(prayerId)) return; // Prevent toggling booked prayers

        setSelectedPrayers(prev => 
        prev.includes(prayerId) 
            ? prev.filter(p => p !== prayerId)
            : [...prev, prayerId]
        );
    }, [bookedPrayersForDate]);

    const handleBookPrayer = async () => {
        
        // Date range validation 
        if (selectedDate < today || selectedDate > MAX_DATE) {
            setModalConfig({ 
                isOpen: true, 
                type: 'error', 
                message: 'The selected date must be within the allowed range: no earlier than today and no later than August 29th, 2026.' 
            });
            return;
        }

        // Selection Validation
        if (selectedPrayers.length === 0) {
            setModalConfig({ 
                isOpen: true, 
                type: 'error', 
                message: 'Please select at least one available prayer type.' 
            });
            return;
        }

        // 3. Name Validation
        if (!customName.trim()) {
            setModalConfig({ 
                isOpen: true, 
                type: 'error', 
                message: 'Please provide a name for this prayer commitment.' 
            });
            return;
        }

        setIsSubmitting(true);
        
        try {
            await prayerBookingService.bookPrayer({
                mobile: userMobile,
                name: customName,
                date: selectedDate,
                prayers: selectedPrayers,
                status: 'active'
            });

           setModalConfig({ 
                isOpen: true, 
                type: 'success', 
                message: 'Prayer commitment successfully recorded. Thank you!' 
            });

            // Update local availability state instantly to prevent double-booking
            setBookedPrayersForDate(prev => [...prev, ...selectedPrayers]);

        } catch (error) {
            setModalConfig({ isOpen: true, type: 'error', message: error.message });
        }
        finally{
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        // Reset form inputs to default values on successful submission
        if (modalConfig.type === 'success') {
        setSelectedDate(today);
        setSelectedPrayers([]);
        setCustomName(initialName || '');
        }
        setModalConfig({ isOpen: false, type: '', message: '' });
    };

    return {
        today,
        MAX_DATE,
        selectedDate,
        setSelectedDate,
        customName,
        setCustomName,
        selectedPrayers,
        bookedPrayersForDate,
        togglePrayer,
        isSubmitting,
        modalConfig,
        closeModal,
        handleBookPrayer
    };
};