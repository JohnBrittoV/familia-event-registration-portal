import { useState, useEffect, useCallback } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { db } from "../config/firebase.config";

export const useNetworkStatus = () => {

    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const checkConnection = useCallback(() => {
    setIsOnline(navigator.onLine);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkConnection]);

  return { isOnline, checkConnection };
}