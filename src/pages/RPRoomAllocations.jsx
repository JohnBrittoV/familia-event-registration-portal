import React, {useState, useEffect} from 'react';
import { useAuth } from '../context/AuthContext';
import { useAccommodations } from '../components/features/Accommodation/Hooks/useAccommodations';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { Spinner } from '../components/ui/Spinner';
import { Building2, BedDouble, Users, Filter, ShieldAlert, ChevronDown } from 'lucide-react';

export const RPRoomAllocations = () => {

    const { user, dbUser } = useAuth();
    const { blocks, loading: accommodationLoading } = useAccommodations();
    
    const [allocations, setAllocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBlockFilter, setSelectedBlockFilter] = useState('ALL');
    const [expandedBlocks, setExpandedBlocks] = useState({});
    const isAdmin = dbUser?.role === 'admin' || dbUser?.role === 'owner';

    useEffect(() => {
        const fetchAllocations = async () => {
            if (!user?.uid) return;
            try {
                setLoading(true);
                const regRef = collection(db, "registrations");
                
                // If not admin, restrict to own submissions unless global permissions apply
                const q = isAdmin 
                    ? query(regRef) 
                    : query(regRef, where("registeredBy", "==", user.uid));
                
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAllocations(data);
            } catch (err) {
                console.error("Failed to load room allocations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllocations();
    }, [user, isAdmin]);

    // Toggle expansion state for a specific block
    const toggleBlockExpand = (blockId) => {
        setExpandedBlocks(prev => ({
            ...prev,
            [blockId]: !prev[blockId]
        }));
    };

    // Filter allocations by selected block
    const filteredAllocations = allocations.filter(item => {
        if (selectedBlockFilter === 'ALL') return true;
        return item.accommodation?.blockId === selectedBlockFilter;
    });

    if (loading || accommodationLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Spinner size="lg" />
            </div>
        );
    }

  return (
        <div className="max-w-6xl mx-auto space-y-8 pb-24 animate-in fade-in duration-300">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Room Allocations Overview</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Manage and inspect accommodation details and participant bookings assigned under your account.
                </p>
            </div>

            {/* Section 1: Collapsible Accommodation Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blocks.map((block) => {
                    const blockRooms = block.roomTypes || [];
                    const isExpanded = Boolean(expandedBlocks[block.id]);

                    // Calculate quick summary metrics for the collapsed view
                    const totalRoomsCount = blockRooms.reduce((sum, r) => sum + (Number(r.totalRooms) || 0), 0);
                    const remainingRoomsCount = blockRooms.reduce((sum, r) => sum + ((Number(r.remainingRooms) ?? Number(r.totalRooms)) || 0), 0);

                    return (
                        <div key={block.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4 transition-all">
                            {/* Card Header & Clickable Accordion Trigger */}
                            <div 
                                onClick={() => toggleBlockExpand(block.id)} 
                                className="cursor-pointer select-none group"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                                        <Building2 size={20} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                                            Block
                                        </span>
                                        <button 
                                            type="button" 
                                            className="p-1.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                                            aria-label="Toggle details"
                                        >
                                            <ChevronDown 
                                                size={18} 
                                                className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} 
                                            />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {block.blockName}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {isExpanded ? 'Click to collapse details' : `${remainingRoomsCount} of ${totalRoomsCount} rooms left • Click to expand`}
                                </p>
                            </div>

                            {/* Collapsible Room Types Breakdown */}
                            {isExpanded && (
                                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {blockRooms.length > 0 ? (
                                        blockRooms.map((room, idx) => {
                                            const total = Number(room.totalRooms) || 0;
                                            const remaining = Number(room.remainingRooms) ?? total;
                                            const occupied = total - remaining;
                                            const occupancyRate = total > 0 ? Math.min(Math.round((occupied / total) * 100), 100) : 0;

                                            return (
                                                <div key={idx} className="space-y-1.5 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{room.type}</span>
                                                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                                                            <strong className="text-blue-600 dark:text-blue-400">{remaining}</strong> left of {total}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Progress Bar */}
                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full transition-all duration-500 ${
                                                                occupancyRate > 85 ? 'bg-red-500' : occupancyRate > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                                                            }`}
                                                            style={{ width: `${occupancyRate}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
                                                        <span>{occupied} Occupied</span>
                                                        <span>{occupancyRate}% Filled</span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-xs text-slate-400 italic py-2">No room categories configured.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Section 2: Participant Room Allocations List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-5 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <BedDouble className="w-5 h-5 text-blue-600" />
                        <h2 className="font-bold text-lg text-slate-900 dark:text-white">Registered Families Room Directory</h2>
                    </div>
                    
                    {/* Block Filter Dropdown */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter size={16} className="text-slate-400 shrink-0" />
                        <select 
                            value={selectedBlockFilter}
                            onChange={(e) => setSelectedBlockFilter(e.target.value)}
                            className="w-full sm:w-auto p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none"
                        >
                            <option value="ALL">All Blocks ({allocations.length})</option>
                            {blocks.map(b => (
                                <option key={b.id} value={b.id}>{b.blockName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-900/30">
                                <th className="p-4 w-12">#</th>
                                <th className="p-4">Participant Family</th>
                                <th className="p-4">Contact</th>
                                <th className="p-4">Allotted Block</th>
                                <th className="p-4">Room Category</th>
                                <th className="p-4">Registered By</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                            {filteredAllocations.length > 0 ? (
                                filteredAllocations.map((item, index) => {
                                    const acc = item.accommodation || {};
                                    const hasRoom = Boolean(acc.blockName && acc.roomType);

                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="p-4 font-bold text-slate-400 text-xs">
                                                {index + 1}
                                            </td>
                                            <td className="p-4 font-semibold text-slate-900 dark:text-white">
                                                {item.fullName || 'Unnamed Family'}
                                                <p className="text-xs font-normal text-slate-400">{item.houseName}, {item.homeTown}</p>
                                            </td>
                                            <td className="p-4 text-slate-600 dark:text-slate-300">
                                                {item.phone1 || 'N/A'}
                                            </td>
                                            <td className="p-4 text-slate-800 dark:text-slate-200 font-medium">
                                                {acc.blockName || <span className="text-slate-400 italic">Not Assigned</span>}
                                            </td>
                                            <td className="p-4 text-slate-800 dark:text-slate-200">
                                                {acc.roomType || <span className="text-slate-400 italic">N/A</span>}
                                            </td>
                                            <td className="p-4 text-blue-600 dark:text-blue-400 font-medium">
                                                {item.ResponsiblePersonName || 'Admin'}
                                            </td>
                                            <td className="p-4">
                                                {hasRoom ? (
                                                    <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">
                                                        Booked
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full">
                                                        Pending Room
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-slate-400 italic">
                                        No room allocations found matching your filter criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

}