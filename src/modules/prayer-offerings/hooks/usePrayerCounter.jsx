import { useState, useEffect, useCallback } from 'react';
import { prayerCounterService } from '../services/prayerCounterService';

export const usePrayerCounter = (userMobile, target = 50000) => {
    const [currentCount, setCurrentCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);

    // Listen to the live count from Firestore
    useEffect(() => {
        
        const unsubscribe = prayerCounterService.subscribeToCount((count) => {
            setCurrentCount(count);
        });

        return () => unsubscribe(); 
    }, []);

    const handlePrayNow = useCallback(async () => {
    if (isSubmitting || !userMobile) return;

    setIsSubmitting(true);
    setShowAnimation(true);
    
    try {
        await prayerCounterService.incrementCount(userMobile);
    } catch (error) {
        console.error('Failed to submit prayer', error);
    }

    // Hide the visual floating animation after 1 second
    setTimeout(() => {
      setShowAnimation(false);
    }, 1000);

    // Keep the button disabled for 2 seconds (Debounce/Anti-spam)
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
}, [isSubmitting, userMobile]);

  // Calculate percentage, capped at 100%
  const progressPercentage = Math.min((currentCount / target) * 100, 100);

  return {
    currentCount,
    target,
    progressPercentage,
    isSubmitting,
    showAnimation,
    handlePrayNow
  };
}