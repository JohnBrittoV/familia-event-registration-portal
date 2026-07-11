import React, { useEffect, useState } from 'react';
import { fetchPrayerOfferings, getPrayerConfig, updatePrayerConfig } from '../services/prayerService';
import { format, isBefore, parseISO } from 'date-fns';
import { Loader2, Download, ArrowRight, Filter, Calendar } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { AdminLayout } from '../../../components/layout/AdminLayout';

export const PrayerAdminPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('All');
    const [filterDate, setFilterDate] = useState('');

    // 1. Fetch Bookings
    useEffect(() => {
        const load = async () => {
            const data = await fetchPrayerOfferings();
            setBookings(data);
            setLoading(false);
        };
        load();
    }, []);

    // 2. Filtering Logic
    const filteredBookings = bookings.filter(b => {
        const typeMatch = filterType === 'All' || b.prayerType === filterType;
        const dateMatch = !filterDate || b.bookingDate === filterDate;
        return typeMatch && dateMatch;
    });

    // 3. Sort by Date (Earliest first)
    const sortedBookings = [...filteredBookings].sort((a, b) => a.bookingDate.localeCompare(b.bookingDate));

    // 4. Find "Next in Queue" (Earliest upcoming booking)
    const nextInQueue = sortedBookings.find(b => {
        return !isBefore(parseISO(b.bookingDate), new Date());
    });

    // 5. Export to CSV Logic
    const handleExportCSV = () => {
        const headers = ['Name', 'Phone', 'Prayer Type', 'Date', 'Status'];
        const csvRows = sortedBookings.map(b => [
            b.userName, b.userPhone, b.prayerType, b.bookingDate, b.status
        ]);
        const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prayer_bookings_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin size-8 text-blue-600"/></div>;

    return (
        <>
        <AdminLayout>
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Prayer Offerings Dashboard</h2>
                <button onClick={handleExportCSV} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
                    <Download size={18} /> Export CSV
                </button>
            </div>

            {/* Next in Queue Highlight Card */}
            {nextInQueue && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center gap-4">
                    <ArrowRight className="text-blue-600 dark:text-blue-400" size={24} />
                    <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">Next Person in Queue</p>
                        <p className="text-slate-600 dark:text-slate-300">
                            <span className="font-semibold">{nextInQueue.userName}</span> has booked <span className="font-semibold">{nextInQueue.prayerType}</span> for {nextInQueue.bookingDate}.
                        </p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">Filter by Type</label>
                    <select className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="All">All Types</option>
                        <option value="Holy Mass">Holy Mass</option>
                        <option value="Fasting">Fasting</option>
                        <option value="Adoration">Adoration</option>
                        <option value="Hail Mary">Hail Mary</option>
                        <option value="Familia Prayer">Familia Prayer</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">Filter by Date</label>
                    <input type="date" className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                </div>
            </div>

            {/* Main Data Table */}
            <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="p-4 text-xs uppercase font-bold text-slate-500">Name</th>
                            <th className="p-4 text-xs uppercase font-bold text-slate-500">Phone</th>
                            <th className="p-4 text-xs uppercase font-bold text-slate-500">Prayer Type</th>
                            <th className="p-4 text-xs uppercase font-bold text-slate-500">Date</th>
                            <th className="p-4 text-xs uppercase font-bold text-slate-500">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedBookings.map((b) => {
                            const isCompleted = isBefore(parseISO(b.bookingDate), new Date());
                            return (
                                <tr key={b.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0">
                                    <td className="p-4 font-medium text-slate-800 dark:text-white">{b.userName}</td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">{b.userPhone}</td>
                                    <td className="p-4"><span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{b.prayerType}</span></td>
                                    <td className="p-4 text-slate-600 dark:text-slate-400">{b.bookingDate}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${isCompleted ? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                                            {isCompleted ? 'Completed' : 'Upcoming'}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                        {sortedBookings.length === 0 && (
                            <tr><td colSpan="5" className="p-8 text-center text-slate-500">No prayers booked under this filter yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </AdminLayout>
    </>
    );
};