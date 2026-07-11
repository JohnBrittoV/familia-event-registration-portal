import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Greeting } from '../../../components/features/Greeting';
import { PrayerCard } from '../components/PrayerCard';

import { 
    bookPrayerOffering, 
    fetchPrayerOfferings, 
    getPrayerConfig, 
    getRecentBookings 
} from '../services/prayerService';

const PRAYER_TYPES = ['Holy Mass', 'Fasting', 'Adoration', 'Hail Mary', 'Familia Prayer'];

export const PrayerDashboard = () => {
    const { user, dbUser } = useAuth(); 

    const [userData] = useState(() => {
        try {
            const stored = localStorage.getItem('familia26_prayer_user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [bookings, setBookings] = useState([]);
    const [recentBookings, setRecentBookings] = useState([]);
    const [config, setConfig] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isBooking, setIsBooking] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // 1. DATA LOADING
    useEffect(() => {
        console.log("🚀 Dashboard mounted. Starting data fetch...");
        
        const loadData = async () => {
            try {
                const [bookingsData, recentData, configData] = await Promise.all([
                    fetchPrayerOfferings(),
                    getRecentBookings(),
                    getPrayerConfig()
                ]);
                
                console.log("✅ Data fetched successfully! Bookings count:", bookingsData.length);
                
                setBookings(bookingsData || []);
                setRecentBookings(recentData || []);
                setConfig(configData);
            } catch (error) {
                console.error("❌ Failed to load dashboard data:", error);
                setBookings([]);
                setRecentBookings([]);
            } finally {
                console.log("🔄 Setting isLoadingData to FALSE");
                setIsLoadingData(false); 
            }
        };
        loadData();

        const interval = setInterval(async () => {
            try {
                const recent = await getRecentBookings();
                setRecentBookings(recent || []);
            } catch (error) {
                // Silently ignore polling errors
            }
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    // 2. RENDER LOGIC
    console.log("🎨 Rendering component. isLoadingData:", isLoadingData);

    if (isLoadingData) {
        console.log("⏳ Returning Loading Spinner...");
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB] dark:bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin size-12 text-[#3B6AB0]" />
                    <p className="text-slate-500 dark:text-slate-400">Loading your prayer dashboard...</p>
                </div>
            </div>
        );
    }

    console.log("✅ Dashboard UI is now RENDERING!");

    // 3. HANDLERS
    const handlePrayerAction = async (type) => {
        if (!userData) {
            setMessage({ type: 'error', text: 'Session expired. Please sign out and sign in again.' });
            return;
        }

        const dateStr = format(selectedDate, 'yyyy-MM-dd');

        if (config) {
            if (dateStr < config.startDate || dateStr > config.endDate) {
                setMessage({ type: 'error', text: `Prayer offerings are only open from ${config.startDate} to ${config.endDate}.` });
                return;
            }
        }

        setIsBooking(true);
        setMessage({ type: '', text: '' });

        try {
            await bookPrayerOffering(userData, type, dateStr);
            setMessage({ type: 'success', text: `Your ${type} offering for ${dateStr} is booked!` });
            
            const [updatedBookings, updatedRecent] = await Promise.all([
                fetchPrayerOfferings(), 
                getRecentBookings()
            ]);
            setBookings(updatedBookings || []);
            setRecentBookings(updatedRecent || []);
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsBooking(false);
        }
    };

    const getTileClassName = ({ date }) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const isBooked = bookings.some(b => b.bookingDate === dateStr);
        return isBooked ? 'react-calendar__tile--booked' : null;
    };

    // 4. FINAL UI RETURN
    return (
        <>
        <div className="min-h-screen bg-[#F4F7FB] dark:bg-slate-900 px-6 py-8">
            <div className="max-w-6xl mx-auto">
                
                {/* Greeting - If this fails, we added a fallback div directly so you know it's working */}
                <div className="mb-6">
                    {user?.displayName ? (
                        <Greeting 
                            name={user.displayName} 
                            role="Prayer Partner" 
                            subtitle="Thank you for your prayers. Select a date and prayer type below." 
                        />
                    ) : (
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Welcome back, Partner</h1>
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1">Prayer Partner</p>
                            <p className="text-slate-600 dark:text-slate-400">Thank you for your prayers. Select a date and prayer type below.</p>
                        </div>
                    )}
                </div>
                
                {/* Marquee and Stats */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-8 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="w-full overflow-hidden">
                        <div className="flex animate-marquee w-max gap-6">
                            {recentBookings.length > 0 ? (
                                recentBookings.map(b => (
                                    <span key={b.id} className="text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                        {b.userName} • {b.prayerType}
                                    </span>
                                ))
                            ) : (
                                <span className="text-slate-400 italic whitespace-nowrap">No offerings yet. Be the first to offer a prayer!</span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-6 text-sm font-bold text-slate-700 dark:text-slate-300 shrink-0">
                        <span>Total Offered: {bookings.length}</span>
                    </div>
                </div>

                {/* Success / Error Notification */}
                {message.text && (
                    <div className={`mb-6 p-3 rounded-lg text-center text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left: Calendar */}
                    <div className="md:w-2/3 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                        <h3 className="font-bold text-lg mb-3 text-slate-800 dark:text-white">Select a Date</h3>
                        <Calendar 
                            onChange={setSelectedDate} 
                            value={selectedDate} 
                            className="w-full border-none shadow-none rounded-lg bg-transparent" 
                            tileClassName={getTileClassName}
                        />
                    </div>

                    {/* Right: Actions */}
                    <div className="md:w-1/3 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                        <h3 className="font-bold text-lg mb-3 text-slate-800 dark:text-white">Prayer Options</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {PRAYER_TYPES.map(type => (
                                <PrayerCard 
                                    key={type} 
                                    title={type} 
                                    icon={<span className="text-2xl">🙏</span>} 
                                    isDateBased={['Holy Mass', 'Fasting', 'Adoration'].includes(type)}
                                    onAction={() => handlePrayerAction(type)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}