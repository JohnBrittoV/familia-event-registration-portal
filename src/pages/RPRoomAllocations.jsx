import React, {useState, useEffect} from 'react';
import { useAuth } from '../context/AuthContext';
import { useAccommodations } from '../components/features/Accommodation/Hooks/useAccommodations';
import { collection, query, where, getDocs, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { Spinner } from '../components/ui/Spinner';
import { Building2, BedDouble, Users, Filter, ShieldAlert, ChevronDown,Edit2, X, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const RPRoomAllocations = () => {

    const { user, dbUser } = useAuth();
    const { blocks, loading: accommodationLoading } = useAccommodations();
    const { showToast } = useToast();
    
    const [allocations, setAllocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBlockFilter, setSelectedBlockFilter] = useState('ALL');
    const [expandedBlocks, setExpandedBlocks] = useState({});

    // Edit Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingAllocation, setEditingAllocation] = useState(null);
    const [editBlockId, setEditBlockId] = useState('');
    const [editRoomType, setEditRoomType] = useState('');
    const [editRoomNumber, setEditRoomNumber] = useState('');
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

    const isAdmin = dbUser?.role === 'admin' || dbUser?.role === 'owner';

    const fetchAllocations = async () => {
        if (!user?.uid) return;
        try {
            setLoading(true);
            const regRef = collection(db, "registrations");
            const q = isAdmin 
                ? query(regRef) 
                : query(regRef, where("registeredBy", "==", user.uid));
            
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
            setAllocations(data);
        } catch (err) {
            console.error("Failed to load room allocations:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllocations();
    }, [user, isAdmin]);

    // Toggle expansion state for a specific block
    const toggleBlockExpand = (blockId) => {
        setExpandedBlocks(prev => ({
            ...prev,
            [blockId]: !prev[blockId]
        }));
    };

    // Open edit modal for a family allocation row
    const handleOpenEditModal = (item) => {
        setEditingAllocation(item);
        const acc = item.accommodation || {};
        const blockId = acc.blockId || (blocks.length > 0 ? blocks[0].id : '');
        setEditBlockId(blockId);

        const targetBlock = blocks.find(b => b.id === blockId);
        const roomType = acc.roomType || (targetBlock?.roomTypes?.[0]?.type || '');
        setEditRoomType(roomType);

        setEditRoomNumber(acc.roomNumber || '');       
        setIsEditModalOpen(true);
    };

    const handleEditBlockChange = (newBlockId) => {
        setEditBlockId(newBlockId);
        const targetBlock = blocks.find(b => b.id === newBlockId);
        if (targetBlock && targetBlock.roomTypes && targetBlock.roomTypes.length > 0) {
            setEditRoomType(targetBlock.roomTypes[0].type);
        } else {
            setEditRoomType('');
        }
        setEditRoomNumber('');
    };

    // Handle transaction-safe room reallocation & financial update
    const handleSaveAllocationEdit = async (e) => {
        e.preventDefault();
        if (!editingAllocation || !editBlockId || !editRoomType || !editRoomNumber) {
            alert("Please provide a block, category, and room number.");
            return;
        }

        setIsSubmittingEdit(true);
        try {
            const regId = editingAllocation.id;
            const oldAcc = editingAllocation.accommodation || {};
            const oldBlockId = oldAcc.blockId;
            const oldRoomType = oldAcc.roomType;
            const oldRoomNumber = oldAcc.roomNumber;

            await runTransaction(db, async (transaction) => {
                const regRef = doc(db, "registrations", regId);
                const regSnap = await transaction.get(regRef);
                if (!regSnap.exists()) throw new Error("Registration record not found.");

                // 1. Handle New Block reference
                const newBlockRef = doc(db, "accommodations", editBlockId);
                const newBlockSnap = await transaction.get(newBlockRef);
                if (!newBlockSnap.exists()) throw new Error("Selected accommodation block not found.");

                const newBlockData = newBlockSnap.data();
                const newRoomTypes = newBlockData.roomTypes || [];
                const newTypeIndex = newRoomTypes.findIndex(rt => rt.type === editRoomType);
                if (newTypeIndex === -1) throw new Error("Selected room category not found in block.");

                // Verify the new room is vacant (unless it's the exact same room already assigned)
                const isSameRoom = (oldBlockId === editBlockId && oldRoomNumber === editRoomNumber);
                const targetCatRooms = newRoomTypes[newTypeIndex].rooms || [];
                const targetRoomIndex = targetCatRooms.findIndex(r => r.roomNumber === editRoomNumber);

                if (targetRoomIndex === -1) throw new Error(`Room number ${editRoomNumber} does not exist.`);
                if (!isSameRoom && targetCatRooms[targetRoomIndex].isOccupied) {
                    throw new Error(`Room ${editRoomNumber} is already occupied.`);
                }

                // 2. If changing rooms or blocks, release the old room first
                if (oldBlockId && oldRoomNumber && !isSameRoom) {
                    const oldBlockRef = doc(db, "accommodations", oldBlockId);
                    const oldBlockSnap = await transaction.get(oldBlockRef);
                    
                    if (oldBlockSnap.exists()) {
                        const oldBlockData = oldBlockSnap.data();
                        const oldRoomTypes = oldBlockData.roomTypes || [];
                        const oldTypeIndex = oldRoomTypes.findIndex(rt => rt.type === oldRoomType);

                        if (oldTypeIndex !== -1) {
                            const oldCat = oldRoomTypes[oldTypeIndex];
                            const oldRoomsArr = oldCat.rooms || [];
                            const oldRoomIdx = oldRoomsArr.findIndex(r => r.roomNumber === oldRoomNumber);

                            if (oldRoomIdx !== -1) {
                                oldRoomsArr[oldRoomIdx] = { ...oldRoomsArr[oldRoomIdx], isOccupied: false, occupiedBy: null };
                                const occCount = oldRoomsArr.filter(r => r.isOccupied).length;
                                oldRoomTypes[oldTypeIndex] = {
                                    ...oldCat,
                                    remainingRooms: Math.max(0, oldCat.totalRooms - occCount),
                                    rooms: oldRoomsArr
                                };
                                transaction.update(oldBlockRef, { roomTypes: oldRoomTypes, updatedAt: serverTimestamp() });
                            }
                        }
                    }
                }

                // 3. Lock new room if not same room
                if (!isSameRoom) {
                    targetCatRooms[targetRoomIndex] = {
                        ...targetCatRooms[targetRoomIndex],
                        isOccupied: true,
                        occupiedBy: regId
                    };
                }

                const newOccCount = targetCatRooms.filter(r => r.isOccupied).length;
                newRoomTypes[newTypeIndex] = {
                    ...newRoomTypes[newTypeIndex],
                    remainingRooms: Math.max(0, newRoomTypes[newTypeIndex].totalRooms - newOccCount),
                    rooms: targetCatRooms
                };

                transaction.update(newBlockRef, { roomTypes: newRoomTypes, updatedAt: serverTimestamp() });

                // 5. Update Registration Document
                transaction.update(regRef, {
                    registrationStatus: "Approved",
                    accommodation: {
                        blockId: editBlockId,
                        blockName: newBlockData.blockName,
                        roomType: editRoomType,
                        roomNumber: editRoomNumber
                    },
                    updatedAt: serverTimestamp()
                });
            });

            showToast("Room allocation updated successfully!", "success");
            setIsEditModalOpen(false);
            setIsSubmittingEdit(false);
            fetchAllocations();
            refreshBlocks();
        } catch (err) {
            console.error("Failed to update allocation:", err);
            setIsSubmittingEdit(false);
            alert(err.message || "Failed to update room allocation.");
        }
    };

    // Filter allocations by selected block
    const filteredAllocations = allocations.filter(item => {
        if (selectedBlockFilter === 'ALL') return true;
        return item.accommodation?.blockId === selectedBlockFilter;
    });

    const editBlockObj = blocks.find(b => b.id === editBlockId);
    const editCategoryObj = editBlockObj?.roomTypes?.find(rt => rt.type === editRoomType);
    const editAvailableRooms = editCategoryObj?.rooms || [];

    if (loading || accommodationLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Spinner size="lg" />
            </div>
        );
    }

  return (
        <div className="max-w-7xl mx-auto space-y-8 pb-24 animate-in fade-in duration-300">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Room Allocations Overview</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Manage lodging locations, live room capacities, and specific room assignments.
                </p>
            </div>

            {/* Section 1: Accommodation Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blocks.map((block) => {
                    const blockRooms = block.roomTypes || [];
                    const isExpanded = Boolean(expandedBlocks[block.id]);
                    const totalRoomsCount = blockRooms.reduce((sum, r) => sum + (Number(r.totalRooms) || 0), 0);
                    const remainingRoomsCount = blockRooms.reduce((sum, r) => sum + ((Number(r.remainingRooms) ?? Number(r.totalRooms)) || 0), 0);

                    return (
                        <div key={block.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4 transition-all">
                            <div onClick={() => toggleBlockExpand(block.id)} className="cursor-pointer select-none group">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                                        <Building2 size={20} />
                                    </div>
                                    <button type="button" className="p-1.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 rounded-lg">
                                        <ChevronDown size={18} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
                                    </button>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {block.blockName}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {isExpanded ? 'Click to collapse details' : `${remainingRoomsCount} of ${totalRoomsCount} rooms left • Click to expand`}
                                </p>
                            </div>

                            {isExpanded && (
                                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700 animate-in fade-in duration-200">
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
                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                                        <div className={`h-full transition-all duration-500 ${occupancyRate > 85 ? 'bg-red-500' : occupancyRate > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${occupancyRate}%` }} />
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

            {/* Section 2: Logistical Room Directory */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-5 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <BedDouble className="w-5 h-5 text-blue-600" />
                        <h2 className="font-bold text-lg text-slate-900 dark:text-white">Registered Families Room Directory</h2>
                    </div>
                    
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
                                <th className="p-4">Allotted Block & Room</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                            {filteredAllocations.length > 0 ? (
                                filteredAllocations.map((item, index) => {
                                    const acc = item.accommodation || {};
                                    const hasRoom = Boolean(acc.blockName && acc.roomNumber);

                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <td className="p-4 font-bold text-slate-400 text-xs">{index + 1}</td>
                                            <td className="p-4 font-semibold text-slate-900 dark:text-white">
                                                {item.fullName || 'Unnamed Family'}
                                                <p className="text-xs font-normal text-slate-400">{item.houseName}, {item.homeTown} • {item.phone1}</p>
                                            </td>
                                            <td className="p-4 text-slate-800 dark:text-slate-200">
                                                {acc.blockName && acc.roomNumber ? (
                                                    <div>
                                                        <span className="font-semibold">{acc.blockName}</span>
                                                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{acc.roomType} — Room #{acc.roomNumber}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 italic">Not Assigned</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {hasRoom ? (
                                                    <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">
                                                        Allocated
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full">
                                                        Pending Room
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => handleOpenEditModal(item)}
                                                    className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 rounded-xl transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                                                    title="Change Room Allocation"
                                                >
                                                    <Edit2 size={14} />
                                                    <span>Change Room</span>
                                                </button>
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

            {/* ROOM RE-ALLOCATION MODAL */}
            {isEditModalOpen && editingAllocation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 relative border border-slate-200 dark:border-slate-800 my-8">
                        <button 
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-6 text-blue-600 dark:text-blue-400">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                                <Edit2 size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Re-allocate Room</h3>
                                <p className="text-xs text-slate-500">{editingAllocation.fullName}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSaveAllocationEdit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                    Accommodation Block
                                </label>
                                <select 
                                    value={editBlockId}
                                    onChange={(e) => handleEditBlockChange(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 font-medium"
                                    required
                                >
                                    {blocks.map(b => (
                                        <option key={b.id} value={b.id}>{b.blockName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                        Room Category
                                    </label>
                                    <select 
                                        value={editRoomType}
                                        onChange={(e) => {
                                            setEditRoomType(e.target.value);
                                            setEditRoomNumber('');
                                        }}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 font-medium"
                                        required
                                    >
                                        {editBlockObj?.roomTypes?.map((rt, idx) => (
                                            <option key={idx} value={rt.type}>{rt.type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                        Room Number
                                    </label>
                                    <select 
                                        value={editRoomNumber}
                                        onChange={(e) => setEditRoomNumber(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 font-semibold text-blue-600 dark:text-blue-400"
                                        required
                                    >
                                        <option value="">Select Room...</option>
                                        {editAvailableRooms.map((room, idx) => (
                                            <option key={idx} value={room.roomNumber} disabled={room.isOccupied && room.roomNumber !== editingAllocation.accommodation?.roomNumber}>
                                                Room {room.roomNumber} {room.isOccupied && room.roomNumber !== editingAllocation.accommodation?.roomNumber ? '(Occupied)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingEdit}
                                    className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 text-sm"
                                >
                                    {isSubmittingEdit ? 'Re-allocating...' : 'Save Room'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

}