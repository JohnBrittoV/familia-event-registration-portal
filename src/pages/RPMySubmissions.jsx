import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Greeting } from '../components/features/Greeting';

// Temporary mock data for UI testing
const mockSubmissions = [
    { id: "REG-001", name: "John Doe Family", date: "Oct 12, 2025", members: 4, amount: "₹2000", status: "Approved" },
    { id: "REG-002", name: "Jane Smith", date: "Oct 14, 2025", members: 1, amount: "₹500", status: "Pending" },
    { id: "REG-003", name: "Michael Johnson", date: "Oct 15, 2025", members: 2, amount: "₹1000", status: "Approved" },
];

export const RPMySubmissions = () => {

    const { user } = useAuth();

    // Helper function to colorize badges based on status
    const getStatusColor = (status) => {
        switch(status) {
            case 'Approved': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        }

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

                {/* Scrollable Table Wrapper */}
                <div className="table-wrapper">
                    <table className="table">
                        <thead className="table-thead">
                            <tr>
                                <th className="table-th">Reg ID</th>
                                <th className="table-th">Participant/Family Name</th>
                                <th className="table-th">Date Submitted</th>
                                <th className="table-th">Members</th>
                                <th className="table-th">Amount</th>
                                <th className="table-th">Status</th>
                                <th className="table-th text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-tbody">
                            {mockSubmissions.map((sub) => (
                                <tr key={sub.id} className="table-tr">
                                    <td className="table-td font-medium text-slate-900 dark:text-slate-100">
                                        {sub.id}
                                    </td>
                                    <td className="table-td table-user-name">
                                        {sub.name}
                                    </td>
                                    <td className="table-td text-slate-500 dark:text-slate-400">
                                        {sub.date}
                                    </td>
                                    <td className="table-td text-slate-600 dark:text-slate-300">
                                        {sub.members}
                                    </td>
                                    <td className="table-td font-medium text-slate-700 dark:text-slate-300">
                                        {sub.amount}
                                    </td>
                                    <td className="table-td">
                                        <span className={`badge-status ${getStatusColor(sub.status)}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="table-td text-right">
                                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );   

};