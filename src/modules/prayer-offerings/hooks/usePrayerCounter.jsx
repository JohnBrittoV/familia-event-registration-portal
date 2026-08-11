import { useState, useEffect, useCallback } from 'react';
import { prayerCounterService } from '../services/prayerCounterService';
import { doc, getDoc, collection, query, where, getDocs, setDoc, increment } from 'firebase/firestore';
import { db } from '../../../config/firebase.config';

export const usePrayerCounter = (userMobile, target = 50000) => {
    const [currentCount, setCurrentCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);

    const [userStats, setUserStats] = useState({
      totalHailMarys: 0,
      holyMassCount: 0,
      fastingCount: 0,
      familiaPrayerCount: 0,
      TotalContribution: 0,
      loadingStats: true
    })

    // Listen to the live count from Firestore
    useEffect(() => {
        
        const unsubscribe = prayerCounterService.subscribeToCount((count) => {
            setCurrentCount(count);
        });

        return () => unsubscribe(); 
    }, []);

    // Fetch individual partner stats when userMobile changes
    const fetchUserContributions = useCallback(async () => {
        
        if(!userMobile) {
          setUserStats(prev => ({ ...prev, loadingStats: false }));
          return;
        }

        try {
                // Fetch user profile stats from prayerOfferings
                const userDocRef = doc(db, 'prayerOfferings', userMobile);
                const userSnap = await getDoc(userDocRef);

                let HailMarys = 0;
                let familiaPrayer = 0;

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    HailMarys = data.totalHailMarys || 0;
                    familiaPrayer = data.familiaPrayerCount || 0;
                  }

                  const bookingRef = collection(db, 'PrayerBookings');
                  const q = query(bookingRef, where('mobile', '==', userMobile));
                  const bookingSnapshot = await getDocs(q);

                  let holyMass = 0;
                  let fasting = 0;

                  bookingSnapshot.docs.forEach(docSnap => {
                    const bookingData = docSnap.data();
                    const prayersArray = bookingData.prayers || [];

                    if (prayersArray.includes('holy_mass')) holyMass += 1;
                    if (prayersArray.includes('fasting')) fasting += 1;
                  });

                  const totalContributionsSum = HailMarys + holyMass + fasting + familiaPrayer;
                    
                    setUserStats({
                        totalHailMarys: HailMarys,
                        holyMassCount: holyMass,
                        fastingCount: fasting,
                        familiaPrayerCount: familiaPrayer,
                        TotalContribution: totalContributionsSum,
                        loadingStats: false
                    });
                
              } catch (error) {
                  console.error('Failed to fetch individual prayer partner stats', error);
                  setUserStats(prev => ({ ...prev, loadingStats: false }));
              }
      }, [userMobile]);

      useEffect(() => {
        fetchUserContributions();
      }, [fetchUserContributions]);

    const handlePrayNow = useCallback(async (amount = 1) => {

      const validAmount = typeof amount === 'number' && amount > 0 ? amount : 1;

      if (isSubmitting || !userMobile) return;

      setIsSubmitting(true);
      setShowAnimation(true);
      
      try {
          await prayerCounterService.incrementCount(userMobile, validAmount);
          await fetchUserContributions();

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
}, [isSubmitting, userMobile, fetchUserContributions]);

  // Calculate percentage, capped at 100%
  const progressPercentage = Math.min((currentCount / target) * 100, 100);

  return {
    currentCount,
    target,
    progressPercentage,
    isSubmitting,
    showAnimation,
    handlePrayNow,
    userStats,
    refreshUserStats: fetchUserContributions
  };
}