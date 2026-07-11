import React, { useState, useEffect } from 'react';
import { fetchLatestRegistrations } from '../../components/features/Registration/service/registrationQueryService';
import { Spinner } from '../ui/Spinner';
import { format } from 'date-fns';

export const RecentParticipantsTable = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchLatestRegistrations(5);

            const sortedData = data.sort((a, b) => {
                
                if(a.createdAt && b.createdAt) {
                    return b.createdAt.seconds - a.createdAt.seconds;
                }

                return 0;
            })
            
            setRegistrations(data);
            setLoading(false);
        };
        loadData();
    }, []);

    return (
        <div className="card-table">
            <div className="card-header">
                <h2 className="card-header-title">Recent Registrations</h2>
                <p className="card-header-subtitle">The latest 5 people registered for Familia'26.</p>
            </div>

            <div className="table-wrapper">
                {loading ? (
                    <div className="p-12 flex justify-center"><Spinner /></div>
                ) : (
                    <table className="table">
                        <thead className="table-thead">
                            <tr>
                                <th className="table-th">Participant Name</th>
                                <th className='table-th'>Spouse Name</th>
                                <th className="table-th">Adults</th>
                                <th className="table-th">Kids</th>
                                <th className="table-th">Responsible Person</th>
                                <th className="table-th">Date & time</th>
                            </tr>
                        </thead>
                        <tbody className="table-tbody">
                            {registrations.map((reg) => (
                                <tr key={reg.id} className="table-tr">
                                    <td className="table-td">
                                        <div className="table-user-name">
                                            {reg.fullName}
                                        </div>
                                    </td>
                                     <td className="table-td">
                                        <div className="table-user-name">
                                            {reg.spouseName}
                                        </div>
                                    </td>
                                    <td className="table-td text-slate-600 dark:text-slate-400">
                                        {reg.calculatedStats?.adults || 0}
                                    </td>
                                    <td className="table-td text-slate-600 dark:text-slate-400">
                                        {reg.calculatedStats?.kids || 0}
                                    </td>
                                    <td className="table-td text-slate-600 dark:text-slate-400">
                                        {reg.ResponsiblePersonName}
                                    </td>
                                    <td className="table-td text-slate-500 dark:text-slate-400 text-xs">
                                        {reg.createdAt ? format(new Date(reg.createdAt.seconds * 1000), 'PP p') : 'Just now'}
                                    </td>
                                </tr>
                            ))}
                            {registrations.length === 0 && (
                                <tr><td colSpan="4" className="p-8 text-center text-slate-500">No registrations yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};