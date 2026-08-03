import React, { useState, useEffect} from 'react';
import { useAuth } from '../context/AuthContext';
import { Greeting } from '../components/features/Greeting';
import { fetchSubmissionsByUser } from '../components/features/Registration/service/registrationQueryService';
import { Spinner } from '../components/ui/Spinner';
import { Eye, FileText } from 'lucide-react';

export const RPMySubmissions = () => {

    const { user } = useAuth();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch submissions from Firestore on load or when user changes
    useEffect(() => {
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

        loadSubmissions();
    }, [user]);

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
                                    <th className="table-th">No.</th>
                                    <th className="table-th">Participant Name</th>
                                    <th className="table-th">Spouse Name</th>
                                    <th className="table-th">No. of Kids</th>
                                    <th className="table-th">House Name</th>
                                    <th className="table-th">Parish</th>
                                    <th className="table-th">Date Submitted</th>
                                    <th className="table-th">Status</th>
                                    <th className="table-th text-right">Actions</th>
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
                                        <td className="table-td text-slate-600 dark:text-slate-300">
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
                                        <td className="table-td text-right">
                                            <button 
                                                onClick={() => {
                                                    // Placeholder for viewing details modal or profile view route
                                                    console.log("View profile for ID:", sub.id);
                                                }}
                                                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors"
                                            >
                                                <Eye size={16} />
                                                <span>View Profile</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </div>
    );
};