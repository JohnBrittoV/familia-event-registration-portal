import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Greeting } from '../components/features/Greeting';

// Temporary mock data for the global list
const mockGlobalRoster = [
    { id: "REG-001", name: "John Doe Family", parish: "St. Mary's Cathedral", members: 4, registeredBy: "Self", status: "Approved" },
    { id: "REG-002", name: "Jane Smith", parish: "Christ the King", members: 1, registeredBy: "Alice Johnson (RP)", status: "Approved" },
    { id: "REG-003", name: "Michael Johnson", parish: "Holy Cross", members: 2, registeredBy: "Self", status: "Approved" },
    { id: "REG-004", name: "The Thomas Family", parish: "St. Jude's", members: 5, registeredBy: "John Britto (RP)", status: "Approved" },
];

export const RPGlobalRoster = () => {
    const { user } = useAuth();

    // Helper function for badges (simplified since global rosters usually only show approved/finalized attendees)
    const getStatusColor = (status) => {
        return status === 'Approved' 
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            
            <Greeting 
                name={user?.displayName} 
                role="Global Roster" 
                subtitle="A complete directory of all approved participants attending Familia'26." 
            />

            {/* Table Card Container */}
            <div className="card-table">
                
                <div className="card-header flex justify-between items-center">
                    <div>
                        <h2 className="card-header-title">Event Directory</h2>
                        <p className="card-header-subtitle">Search and view all registered attendees.</p>
                    </div>
                </div>

                {/* Scrollable Table Wrapper */}
                <div className="table-wrapper">
                    <table className="table">
                        <thead className="table-thead">
                            <tr>
                                <th className="table-th">Reg ID</th>
                                <th className="table-th">Participant/Family Name</th>
                                <th className="table-th">Parish / Zone</th>
                                <th className="table-th">Members</th>
                                <th className="table-th">Registered By</th>
                                <th className="table-th">Status</th>
                            </tr>
                        </thead>
                        <tbody className="table-tbody">
                            {mockGlobalRoster.map((participant) => (
                                <tr key={participant.id} className="table-tr">
                                    <td className="table-td font-medium text-slate-900 dark:text-slate-100">
                                        {participant.id}
                                    </td>
                                    <td className="table-td table-user-name">
                                        {participant.name}
                                    </td>
                                    <td className="table-td text-slate-600 dark:text-slate-300">
                                        {participant.parish}
                                    </td>
                                    <td className="table-td text-slate-500 dark:text-slate-400">
                                        {participant.members}
                                    </td>
                                    <td className="table-td text-slate-500 dark:text-slate-400">
                                        {participant.registeredBy}
                                    </td>
                                    <td className="table-td">
                                        <span className={`badge-status ${getStatusColor(participant.status)}`}>
                                            {participant.status}
                                        </span>
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