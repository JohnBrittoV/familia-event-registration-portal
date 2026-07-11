import React, { useState, useEffect } from 'react';
import { fetchPaginatedRegistrations } from '../../../components/features/Registration/service/registrationQueryService';
import { Spinner } from '../../../components/ui/Spinner';
import { format } from 'date-fns';

export const AdminParticipantsList = () => {
    const [registrations, setRegistrations] = useState([]);
    const [lastDoc, setLastDoc] = useState(null);
    const [hasNext, setHasNext] = useState(true);
    const [loading, setLoading] = useState(false);

    const loadData = async (isNext = false) => {
        setLoading(true);
        try {
            const data = await fetchPaginatedRegistrations(isNext ? lastDoc : null);
            
            if (isNext) {
                setRegistrations(prev => [...prev, ...data.result]);
            } else {
                setRegistrations(data.result);
            }
            
            setLastDoc(data.lastDoc);
            // If the result is less than 10, we know there are no more pages
            setHasNext(data.result.length === 10);
        } catch (error) {
            console.error("Failed to load participants", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(false);
    }, []);

    return (
        <div className="card-table">
            <div className="card-header">
                <h2 className="card-header-title">All Participants</h2>
                <p className="card-header-subtitle">Manage and view complete registration details.</p>
            </div>

            <div className="table-wrapper">
                <table className="table">
                    <thead className="table-thead">
                        <tr>
                            <th className="table-th">Full Name</th>
                            <th className="table-th">Adults</th>
                            <th className="table-th">Kids</th>
                            <th className="table-th">Registered By</th>
                            <th className="table-th">Date</th>
                        </tr>
                    </thead>
                    <tbody className="table-tbody">
                        {registrations.map((reg) => (
                            <tr key={reg.id} className="table-tr">
                                <td className="table-td">
                                    <div className="table-user-name">
                                        {reg.firstName} {reg.lastName}
                                    </div>
                                </td>
                                <td className="table-td text-slate-600 dark:text-slate-400">
                                    {reg.calculatedStats?.adults || 0}
                                </td>
                                <td className="table-td text-slate-600 dark:text-slate-400">
                                    {reg.calculatedStats?.kids || 0}
                                </td>
                                <td className="table-td text-slate-500 dark:text-slate-400 text-xs">
                                    {reg.registeredBy || 'N/A'}
                                </td>
                                <td className="table-td text-slate-500 dark:text-slate-400 text-xs">
                                    {reg.createdAt ? format(new Date(reg.createdAt.seconds * 1000), 'PP p') : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Pagination Controls */}
                {hasNext && (
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-center">
                        <button 
                            onClick={() => loadData(true)}
                            disabled={loading}
                            className="btn-xs px-6 py-2 bg-[#3B6AB0] text-white hover:bg-[#2E5591] rounded-full disabled:opacity-70"
                        >
                            {loading ? 'Loading...' : 'Load More Registrations'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};