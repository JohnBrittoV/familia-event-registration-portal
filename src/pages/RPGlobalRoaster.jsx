import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPaginatedGlobalRoster, fetchGlobalEventSummary } from '../components/features/Registration/service/registrationQueryService';
import { Search, Eye, Users, MapPin, Building2, UserCheck, Calendar, ArrowUpDown, ChevronRight } from 'lucide-react'
import { StatCard } from '../components/ui/StatCard';
import { Greeting } from '../components/features/Greeting';
import { Spinner } from '../components/ui/Spinner';

export const RPGlobalRoster = () => {
    const navigate = useNavigate();
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // Pagination & Cursors stack for previous/next navigation
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    // Sorting State: default to registration date and time (descending)
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');

    // Summary Statistics State
    const [stats, setStats] = useState({ totalFamilies: 0, totalAdults: 0, totalKids: 0, totalAttendees: 0 });

    useEffect(() => {
        loadInitialData();
    }, [sortBy, sortDirection]);

    const loadInitialData = async () => {
            try {
            setLoading(true);
            const [{ result, lastDoc: newLastDoc }, summaryData] = await Promise.all([
                fetchPaginatedGlobalRoster(null, sortBy, sortDirection),
                fetchGlobalEventSummary()
            ]);
            setParticipants(result);
            setLastDoc(newLastDoc);
            setHasMore(result.length === 10);
            setStats(summaryData);
        } catch (err) {
            console.error("Error loading global roster:", err);
        } finally {
            setLoading(false);
        }
    };

    // Load next page (Cursor pagination to save quota)
    const handleLoadMore = async () => {
        if (!lastDoc || loadingMore) return;
        try {
            setLoadingMore(true);
            const { result, lastDoc: newLastDoc } = await fetchPaginatedGlobalRoster(lastDoc, sortBy, sortDirection);
            setParticipants(prev => [...prev, ...result]);
            setLastDoc(newLastDoc);
            setHasMore(result.length === 10);
        } catch (err) {
            console.error("Error loading more records:", err);
        } finally {
            setLoadingMore(false);
        }
    };

    // Format Timestamp safely
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-24 animate-in fade-in duration-300">
            
            {/* Unique Greeting Section */}
            <Greeting 
                name="Responsible Person" 
                role="Global Event Directory" 
                subtitle="Browse, sort, and review all event-wide registrations efficiently across parishes." 
            />

            {/* Summary Stat Cards with Different Colorful Icon Themes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
               
                <StatCard title="Total Families" value={stats.totalFamilies} icon={Users} theme='blue'/>

                <StatCard title="Total Adults" value={stats.totalAdults} icon={UserCheck} theme='purple'/>

                <StatCard title="Total Kids" value={stats.totalKids} icon={Users} theme='emerald'/>

                <StatCard title="Total Attendees" value={stats.totalAttendees} icon={Calendar} theme='amber'/>

            </div>


            {/* Sorting Toolbar */}
            <div className="card-table p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <ArrowUpDown size={18} className="text-blue-600" />
                    <span>Sort Global Directory By:</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100">
                        <option value="createdAt">Registration Time & Date</option>
                        <option value="responsiblePerson">Responsible Person (A-Z)</option>
                        <option value="parish">Parish Location (A-Z)</option>
                        <option value="location">Home Town / Location (A-Z)</option>
                    </select>

                    <button
                        onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors shrink-0">
                        {sortDirection.toUpperCase()}
                    </button>
                </div>
            </div>

            {/* Requested 8-Column Table Structured with Your Component Classes */}
            <div className="card-table">
                <div className="table-wrapper">
                    <table className="table">
                        <thead className="table-thead">
                            <tr>
                                <th className="table-th">No.</th>
                                <th className="table-th">Participant Name</th>
                                <th className="table-th">Spouse Name</th>
                                <th className="table-th">House Name</th>
                                <th className="table-th">Parish</th>
                                <th className="table-th">Home Town</th>
                                <th className="table-th">Registered By</th>
                                <th className="table-th">Time & Date</th>
                                <th className="table-th text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-tbody">
                            {participants.map((p, index) => (
                                <tr key={p.id} className="table-tr">
                                    <td className="table-td font-bold text-slate-400">#{index + 1}</td>
                                    <td className="table-td table-user-name">{p.fullName}</td>
                                    <td className="table-td text-slate-600 dark:text-slate-300">{p.spouseName || '—'}</td>
                                    <td className="table-td font-medium text-slate-800 dark:text-slate-200">{p.houseName || '—'}</td>
                                    <td className="table-td">
                                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium">
                                            {p.parish || 'General'}
                                        </span>
                                    </td>
                                    <td className="table-td text-slate-600 dark:text-slate-300">{p.homeTown || '—'}</td>
                                    <td className="table-td font-medium text-blue-600 dark:text-blue-400">{p.ResponsiblePersonName || 'Admin'}</td>
                                    <td className="table-td text-xs text-slate-500">{formatDate(p.createdAt)}</td>
                                    <td className="table-td text-right">
                                        <button 
                                            onClick={() => navigate(`/rp/participant/${p.id}`, { state: { fromGlobalRoster: true } })}
                                            className="btn-xs bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5">
                                            <Eye size={14} />
                                            <span>View</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {participants.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="p-8 text-center text-slate-400 italic">
                                        No registrations found in the global roster directory.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Quota-Safe Load More Pagination Footer */}
                {hasMore && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-700 text-center">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 shadow-sm inline-flex items-center gap-2">
                            {loadingMore ? <Spinner size="sm" /> : <ChevronRight size={16} />}
                            <span>Load More Records</span>
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
};