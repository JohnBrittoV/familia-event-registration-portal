import { useState, useEffect } from "react";
import { prayerBookingService } from "../services/prayerBookingService";

export const usePrayerHistory = (userMobile) => {

  const [userBookings, setUserBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userMobile) {
      setIsLoading(false);
      return;
    }

    // Subscribe to real-time updates safely
    const unsubscribe = prayerBookingService.subscribeToUserBookings(userMobile, (data) => {
      setUserBookings(data);
      setIsLoading(false);
    });

    // Clean up the listener when the component unmounts to save resources
    return () => unsubscribe();
  }, [userMobile]);

  return {
    userBookings,
    isLoading
  };

  
}