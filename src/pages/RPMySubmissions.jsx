import React, { useState, useEffect} from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Greeting } from '../components/features/Greeting';
import { fetchSubmissionsByUser } from '../components/features/Registration/service/registrationQueryService';
import { deleteParticipantRegistration, approveAndAllocateRegistration } from '../components/features/Registration/service/registrationService';
import { useAccommodations } from '../components/features/Accommodation/Hooks/useAccommodations';
import { Spinner } from '../components/ui/Spinner';
import { Eye, FileText, Trash2, AlertTriangle, CheckCircle2, X,
         HouseHeart, Users, Baby, Calendar1, CheckSquare, BedDouble,
 } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { StatCard } from '../components/ui/StatCard';
import { db } from '../config/firebase.config';
import { useRPStats } from '../hooks/useRPStats';

export const RPMySubmissions = () => {

    const { user } = useAuth();
    const { stats} = useRPStats(user?.uid);
    const { blocks, loading: accommodationLoading } = useAccommodations();
    const navigate = useNavigate();

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Approve & allocate Modal States
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [targetSubmission, setTargetSubmission] = useState(null);
    const [confirmInput, setConfirmInput] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('');

    // Approve & Allocate Modal States
    const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
    const [allocationTarget, setAllocationTarget] = useState(null);
    const [selectedBlockId, setSelectedBlockId] = useState('');
    const [selectedRoomType, setSelectedRoomType] = useState('');
    const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
    const [dueFeeCollected, setDueFeeCollected] = useState('');
    const [isAllocating, setIsAllocating] = useState(false);
    const [allocateSuccessMessage, setAllocateSuccessMessage] = useState('');

    // Fetch submissions from Firestore on load or when user changes
    const loadSubmissions = async () => {
            if (!user?.uid) return;
            try {
                setLoading(true);
                const data = await fetchSubmissionsByUser(user.uid);
                setSubmissions(data);
            } catch (err) {
                console.error("Failed to load submissions:", err);
                setError("Failed to load your submissions. Please try again later.");
            } finally {
                setLoading(false);
            }
    };

    useEffect(() => {
        loadSubmissions();
    }, [user]);

    // Handle opening delete modal
    const openDeleteModal = (sub) => {
        setTargetSubmission(sub);
        setConfirmInput('');
        setDeleteSuccessMessage('');
        setIsDeleteModalOpen(true);
    };

    // Handle opening Approve & Allocate modal
    const openAllocateModal = (sub) => {
        setAllocationTarget(sub);
        setAllocateSuccessMessage('');
        
        // Default to initial preferences if available, or first available block
        const initialBlock = sub.accommodation?.blockId || (blocks.length > 0 ? blocks[0].id : '');
        setSelectedBlockId(initialBlock);

        const targetBlockObj = blocks.find(b => b.id === initialBlock);
        const initialType = sub.accommodation?.roomType || (targetBlockObj?.roomTypes?.[0]?.type || '');
        setSelectedRoomType(initialType);
        setSelectedRoomNumber('');

        setDueFeeCollected('');
        setIsAllocateModalOpen(true);
    };

    // Update Room Type and Room Number defaults when block changes
    const handleBlockChange = (blockId) => {
        setSelectedBlockId(blockId);
        const blockObj = blocks.find(b => b.id === blockId);
        if (blockObj && blockObj.roomTypes && blockObj.roomTypes.length > 0) {
            setSelectedRoomType(blockObj.roomTypes[0].type);
        } else {
            setSelectedRoomType('');
        }
        setSelectedRoomNumber('');
    };

    // Handle execution of Approve & Allocate
    const handleAllocateSubmit = async (e) => {
        e.preventDefault();
        if (!allocationTarget || !selectedBlockId || !selectedRoomType || !selectedRoomNumber) {
            alert("Please select a block, room category, and specific room number.");
            return;
        }

        setIsAllocating(true);
        try {
            const totalFee = Number(allocationTarget.regFee || allocationTarget.financials?.totalFee|| allocationTarget.totalFee || 2000);
            const advancePaid = Number(allocationTarget.advanceAmount || allocationTarget.advancePaid || allocationTarget.financials?.advancePaid || 0);

            const result = await approveAndAllocateRegistration(allocationTarget.id, {
                blockId: selectedBlockId,
                roomType: selectedRoomType,
                roomNumber: selectedRoomNumber,
                dueFeeCollected: Number(dueFeeCollected) || 0,
                totalFee: totalFee,
                advancePaid: advancePaid
            });

            if (result.success) {
                setAllocateSuccessMessage("Registration approved and room successfully locked!");
                setTimeout(() => {
                    setIsAllocateModalOpen(false);
                    setIsAllocating(false);
                    loadSubmissions();
                }, 1500);
            } else {
                alert(result.error || "Failed to allocate room. It may have just been booked.");
                setIsAllocating(false);
            }
        } catch (err) {
            console.error("Allocation error:", err);
            setIsAllocating(false);
            alert("An error occurred during room allocation.");
        }
    };

    // Handle execution of deletion using the transaction service
    const handleDeleteConfirm = async (e) => {
        e.preventDefault();
        if (!targetSubmission) return;

        const participantName = targetSubmission.fullName || targetSubmission.participantName || targetSubmission.name || '';
        
        // Validation check: require entering the exact participant name
        if (confirmInput.trim().toLowerCase() !== participantName.trim().toLowerCase()) {
            alert("The name entered does not match the participant name.");
            return;
        }

        setIsDeleting(true);
        try {
            // Call the transaction service to delete record AND decrement stats
            await deleteParticipantRegistration(targetSubmission.id);
            
            setDeleteSuccessMessage("Participant registration successfully deleted from database.");

            setSubmissions(prev => prev.filter(sub => sub.id !== targetSubmission.id));
            
            // Refresh local list after a brief delay so user sees success message inside modal
            setTimeout(() => {
                setIsDeleteModalOpen(false);
                setIsDeleting(false);
                loadSubmissions(); // Reload table data
            }, 1800);

        } catch (err) {
            console.error("Error deleting document:", err);
            setIsDeleting(false);
            alert("Failed to delete participant. Please check your permissions.");
        }
    };

    // Helper function to colorize badges based on status
    const getStatusColor = (status) => {
        const normalized = (status || '').toLowerCase();
        if (normalized === 'approved') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
        if (normalized === 'pending') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    };

    // Format Firestore timestamp or date string safely
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        // Handle Firestore Timestamp
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return isNaN(date) ? 'N/A' : date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Find current block and category objects for room dropdown filtering
    const currentBlockObj = blocks.find(b => b.id === selectedBlockId);
    const currentCategoryObj = currentBlockObj?.roomTypes?.find(rt => rt.type === selectedRoomType);
    const availableRooms = currentCategoryObj?.rooms?.filter(r => !r.isOccupied) || [];

     if (loading) {
            return (
                <div className="flex justify-center items-center min-h-[60vh]">
                    <Spinner size="lg" />
                </div>
            );
        }

    return (
       <div className="max-w-7xl mx-auto space-y-8 pb-24">
            
            <Greeting 
                name={user?.displayName} 
                role="My Submissions" 
                subtitle="Review the status and details of the participants you have registered." 
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard title="Total Families" value={stats.totalFamilies} icon={HouseHeart} theme="blue" />
                <StatCard title="Total Adults" value={stats.totalAdults} icon={Users} theme="purple" />
                <StatCard title="Total Kids" value={stats.totalKids} icon={Baby} theme="emerald" />
                <StatCard title="Total Attendees" value={stats.totalAttendees} icon={Calendar1} theme="amber" />
            </div>

            {/* Table Card Container */}
            <div className="card-table">
                <div className="card-header flex justify-between items-center">
                    <div>
                        <h2 className="card-header-title">Recent Registrations</h2>
                        <p className="card-header-subtitle">A list of all your submitted applications.</p>
                    </div>
                </div>

                {error ? (
                    <div className="p-8 text-center text-red-500 font-medium">{error}</div>
                ) : submissions.length === 0 ? (
                    <div className="p-12 text-center space-y-3">
                        <FileText className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">No submissions found</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">You haven't submitted any participant registrations yet.</p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="table">
                            <thead className="table-thead">
                                <tr>
                                    <th className="table-th text-center">NO.</th>
                                    <th className="table-th text-center">PARTICIPANT</th>
                                    <th className="table-th text-center">SPOUSE</th>
                                    <th className="table-th text-center">HOUSE NAME</th>
                                    <th className="table-th text-center">STATUS</th>
                                    <th className="table-th text-center">ACTIONS</th>
                                    <th className="table-th text-center">REG.DATE</th>
                                </tr>
                            </thead>
                            <tbody className="table-tbody">
                                {submissions.map((sub, index) => {
                                    const isPending = (sub.registrationStatus || '').toLowerCase() === 'pending';

                                    return (
                                        <tr key={sub.id || index} className="table-tr text-center">
                                            <td className="table-td font-medium text-slate-900 dark:text-slate-100">
                                                {index + 1}
                                            </td>
                                            <td className="table-td table-user-name font-semibold text-slate-900 dark:text-white">
                                                {sub.fullName || 'N/A'}
                                            </td>
                                            <td className="table-td font-semibold text-slate-900 dark:text-white">
                                                {sub.spouseName || '—'}
                                            </td>
                                            <td className="table-td text-slate-600 dark:text-slate-300">
                                                {sub.houseName || 'N/A'}
                                            </td>
                                            <td className="table-td">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(sub.registrationStatus)}`}>
                                                    {sub.registrationStatus}
                                                </span>
                                            </td>
                                            <td className="table-td space-x-3">
                                                {isPending && (
                                                    <button 
                                                        onClick={() => openAllocateModal(sub)}
                                                        className="btn-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-300 inline-flex items-center gap-1.5"
                                                    >
                                                        <CheckSquare size={16} />
                                                        <span>Approve & Allocate</span>
                                                    </button>
                                                )}

                                                <button 
                                                    onClick={() => navigate(`/rp/participant/${sub.id}`)}
                                                    className="btn-xs bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5"
                                                >
                                                    <Eye size={16} />
                                                    <span>Profile</span>
                                                </button>

                                                <button 
                                                    onClick={() => openDeleteModal(sub)}
                                                    className="btn-xs bg-slate-100 dark:bg-slate-700 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5"
                                                >
                                                    <Trash2 size={16} />
                                                    <span>Delete</span>
                                                </button>
                                            </td>
                                            <td className="table-td text-slate-500 dark:text-slate-400">
                                                {formatDate(sub.createdAt || sub.date)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* APPROVE & ALLOCATE MODAL */}
            {isAllocateModalOpen && allocationTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 relative border border-slate-200 dark:border-slate-800 my-8">
                        <button 
                            onClick={() => setIsAllocateModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-6 text-blue-600 dark:text-blue-400">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                                <BedDouble size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Counter Check-in & Allotment</h3>
                                <p className="text-xs text-slate-500">Verify identity, enter actual counter collection, and lock room.</p>
                            </div>
                        </div>

                        {allocateSuccessMessage ? (
                            <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center">
                                <CheckCircle2 className="text-emerald-500 w-12 h-12 animate-bounce" />
                                <p className="text-emerald-700 dark:text-emerald-300 font-semibold">{allocateSuccessMessage}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleAllocateSubmit} className="space-y-5">
                                
                                {/* 1. Participant Bio Section (Read-only verification) */}
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                                        {allocationTarget.fullName || 'N/A'} <span className="font-bold"> - {allocationTarget.spouseName || 'Single/No Spouse'}</span>
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-300">House: <strong>{allocationTarget.houseName || 'N/A'}</strong> | Town: <strong>{allocationTarget.homeTown || 'N/A'}</strong></p>
                                    <p className="text-slate-600 dark:text-slate-300">Phone: <strong>{allocationTarget.phone1 || 'N/A'}</strong></p>
                                </div>

                                {/* 2. Financial Settlement Section (Fetched from DB) */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase">Total Registration Fee </span>
                                        <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                                            ₹ {Number(allocationTarget.regFee || allocationTarget.financials?.totalFee || allocationTarget.totalFee || 2000)}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Advance Paid</span>
                                        <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                                            ₹ {Number(allocationTarget.advanceAmount || allocationTarget.financials?.advancePaid || allocationTarget.advancePaid || 0)}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                        Amount Collected at Counter (₹)
                                    </label>
                                    <input 
                                        type="number"
                                        min="0"
                                        value={dueFeeCollected}
                                        onChange={(e) => setDueFeeCollected(e.target.value)}
                                        placeholder="Enter received amount"
                                        required
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 font-semibold"
                                    />
                                    <p className="text-[11px] text-slate-400 mt-1">Type the custom amount given by the participant (can be partial, exact, or excess).</p>
                                </div>

                                {/* 3. Dynamic Room Allotment Section */}
                                <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                            Accommodation Block
                                        </label>
                                        <select 
                                            value={selectedBlockId}
                                            onChange={(e) => handleBlockChange(e.target.value)}
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
                                                value={selectedRoomType}
                                                onChange={(e) => {
                                                    setSelectedRoomType(e.target.value);
                                                    setSelectedRoomNumber('');
                                                }}
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 font-medium"
                                                required
                                            >
                                                {currentBlockObj?.roomTypes?.map((rt, idx) => (
                                                    <option key={idx} value={rt.type}>{rt.type} ({rt.remainingRooms} left)</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                                                Vacant Room Number
                                            </label>
                                            <select 
                                                value={selectedRoomNumber}
                                                onChange={(e) => setSelectedRoomNumber(e.target.value)}
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 font-semibold text-blue-600 dark:text-blue-400"
                                                required
                                            >
                                                <option value="">Select Room Number...</option>
                                                {availableRooms.map((room, idx) => (
                                                    <option key={idx} value={room.roomNumber}>Room {room.roomNumber}</option>
                                                ))}
                                            </select>
                                            {availableRooms.length === 0 && (
                                                <p className="text-[11px] text-red-500 mt-1">No vacant rooms available in this category.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setIsAllocateModalOpen(false)}
                                        className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isAllocating || availableRooms.length === 0}
                                        className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 text-sm"
                                    >
                                        {isAllocating ? 'Locking Room...' : 'Confirm & Check-in'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {isDeleteModalOpen && targetSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative border border-slate-200 dark:border-slate-700">
                        <button 
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-400">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Confirm Deletion</h3>
                        </div>

                        {deleteSuccessMessage ? (
                            <div className="flex flex-col items-center justify-center py-6 space-y-3 text-center">
                                <CheckCircle2 className="text-emerald-500 w-12 h-12 animate-bounce" />
                                <p className="text-emerald-700 dark:text-emerald-300 font-semibold">{deleteSuccessMessage}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleDeleteConfirm} className="space-y-4">
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    This action is permanent and will remove the registration from the database. To confirm, type the participant's name: <strong className="text-slate-900 dark:text-white">{targetSubmission.participantName || targetSubmission.fullName}</strong>
                                </p>
                                <input 
                                    type="text"
                                    value={confirmInput}
                                    onChange={(e) => setConfirmInput(e.target.value)}
                                    placeholder="Enter participant name..."
                                    required
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white text-sm"
                                />
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isDeleting}
                                        className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-sm disabled:opacity-50 text-sm"
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div> 
    );
};