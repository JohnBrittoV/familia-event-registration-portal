import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase.config';

export const useRPStats = (userId) => {
    const [stats, setStats] = useState({
        totalFamilies: 0,
        totalAdults: 0,
        totalKids: 0,
        totalAttendees: 0,
        advanceCount: 0,
        advanceAmount: 0,
        formattedAdvanceAmount: '₹ 0',
        ageGroups: { "0-2": 0, "3-5": 0, "6-8": 0, "9-11": 0, "12-14": 0 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const docRef = doc(db, "statistics", `rep_stats_${userId}`);

        // onSnapshot gives you instant, real-time updates without manual refreshing
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const families = data.totalRegistrations || 0;
                const adults = data.totalAdults || 0;
                const kids = data.totalKids || 0;
                const advanceCount = data.advancePaymentCount || 0;
                const advanceAmount = data.totalAdvanceAmount || 0;
                const ageGroups = data.ageGroups || { "0-2": 0, "3-5": 0, "6-8": 0, "9-11": 0, "12-14": 0 };

                // Format amount with Indian style comma separation (e.g., 1,50,000)
                const formattedAdvanceAmount = new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0
                }).format(advanceAmount);

                setStats({
                    totalFamilies: families,
                    totalAdults: adults,
                    totalKids: kids,
                    totalAttendees: adults + kids,
                    advanceCount: advanceCount,
                    advanceAmount: advanceAmount,
                    formattedAdvanceAmount: formattedAdvanceAmount,
                    ageGroups: ageGroups
                });
            } else {
                // Fallback defaults if document doesn't exist yet
                setStats({ 
                    totalFamilies: 0, 
                    totalAdults: 0, 
                    totalKids: 0, 
                    totalAttendees: 0,
                    advanceCount: 0,
                    advanceAmount: 0,
                    formattedAdvanceAmount: '₹ 0',
                    ageGroups: { "0-2": 0, "3-5": 0, "6-8": 0, "9-11": 0, "12-14": 0 }
                });
            }
            setLoading(false);
        }, (error) => {
            console.error("Error listening to real-time stats:", error);
            setLoading(false);
        });

        // Cleanup subscription on unmount to protect quotas and prevent memory leaks
        return () => unsubscribe();
    }, [userId]);

    return { stats, loading };
};