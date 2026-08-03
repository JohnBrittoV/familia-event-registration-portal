import React, { useState, useEffect} from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Greeting } from '../components/features/Greeting';
import { fetchSubmissionsByUser } from '../components/features/Registration/service/registrationQueryService';
import { deleteParticipantRegistration } from '../components/features/Registration/service/registrationService';
import { Spinner } from '../components/ui/Spinner';
import { Eye, FileText, Trash2, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';

export const RPMySubmissions = () => {

    const { user } = useAuth();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [targetSubmission, setTargetSubmission] = useState(null);
    const [confirmInput, setConfirmInput] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('');

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
        switch(status) {
            case 'Approved': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        }

    };

    // Format Firestore timestamp or date string safely
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        // Handle Firestore Timestamp
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return isNaN(date) ? 'N/A' : date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            
            <Greeting 
                name={user?.displayName} 
                role="My Submissions" 
                subtitle="Review the status and details of the participants you have registered." 
            />

            {/* Table Card Container */}
            <div className="card-table">
                
                <div className="card-header flex justify-between items-center">
                    <div>
                        <h2 className="card-header-title">Recent Registrations</h2>
                        <p className="card-header-subtitle">A list of all your submitted applications.</p>
                    </div>
                </div>

                {/* Content States */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Spinner size="lg" />
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500 font-medium">
                        {error}
                    </div>
                ) : submissions.length === 0 ? (
                    <div className="p-12 text-center space-y-3">
                        <FileText className="mx-auto h-12 w-12 text-slate-400" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">No submissions found</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">You haven't submitted any participant registrations yet.</p>
                    </div>
                ) : (
                    /* Scrollable Table Wrapper */
                    <div className="table-wrapper">
                        <table className="table">
                            <thead className="table-thead">
                                <tr>
                                    <th className="table-th text-center">No.</th>
                                    <th className="table-th text-center">Participant Name</th>
                                    <th className="table-th text-center">Spouse Name</th>
                                    <th className="table-th text-center">Kids</th>
                                    <th className="table-th text-center">House Name</th>
                                    <th className="table-th text-center">Parish</th>
                                    <th className="table-th text-center">Date Submitted</th>
                                    <th className="table-th text-center">Status</th>
                                    <th className="table-th text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-tbody">
                                {submissions.map((sub, index) => (
                                    <tr key={sub.id || index} className="table-tr">
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
                                            {sub.kidsCount ?? (Array.isArray(sub.children) ? sub.children.length : 0)}
                                        </td>
                                        <td className="table-td text-slate-600 dark:text-slate-300">
                                            {sub.houseName || 'N/A'}
                                        </td>
                                        <td className="table-td text-slate-600 dark:text-slate-300">
                                            {sub.parish || 'N/A'}
                                        </td>
                                        <td className="table-td text-slate-500 dark:text-slate-400">
                                            {formatDate(sub.createdAt || sub.date)}
                                        </td>
                                        <td className="table-td">
                                            <span className={`badge-status ${getStatusColor(sub.status || 'Pending')}`}>
                                                {sub.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="table-td text-right space-x-5">
                                            <button 
                                                onClick={() => navigate(`/rp/participant/${sub.id}`)}
                                                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors"
                                            >
                                                <Eye size={16} />
                                                <span>View Profile</span>
                                            </button>

                                            <button 
                                                onClick={() => openDeleteModal(sub)}
                                                className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 dark:text-red-400 font-medium text-sm transition-colors"
                                            >
                                                <Trash2 size={16} />
                                                <span>Delete</span>
                                            </button>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>

            {/* DELETE CONFIRMATION MODAL */}
            {isDeleteModalOpen && targetSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
                        
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
                                    This action is permanent and will remove the registration from the database. To confirm, type the participant's name: <strong className="text-slate-900 dark:text-white">{targetSubmission.participantName || targetSubmission.name}</strong>
                                </p>

                                <div>
                                    <input 
                                        type="text"
                                        value={confirmInput}
                                        onChange={(e) => setConfirmInput(e.target.value)}
                                        placeholder="Enter participant name..."
                                        required
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white text-sm"
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isDeleting}
                                        className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50 text-sm"
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