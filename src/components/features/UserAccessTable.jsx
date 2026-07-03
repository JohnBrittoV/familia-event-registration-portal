import React from 'react';

export const UserAccessTable = ({ users, onToggleAccess, onDelete }) => {
    return (
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl 
                          shadow-sm border border-slate-200 
                          dark:border-slate-700 overflow-hidden">
            
            <div className="p-5 border-b border-slate-200 
                            dark:border-slate-700">

                <h2 className="font-bold text-lg 
                               text-slate-900 dark:text-white">
                                User Access Management
                </h2>

                <p className="text-sm text-slate-500 
                              dark:text-slate-400">
                                Manage portal access for responsible persons.
                </p>

            </div>
            
            <div className="overflow-x-auto">
                
                <table className="w-full text-left text-sm whitespace-nowrap">
                    
                    <thead className="bg-slate-50 dark:bg-slate-900/50 
                                        border-b border-slate-200 dark:border-slate-700 
                                        text-slate-500 dark:text-slate-400 font-medium">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 
                                      dark:divide-slate-700">
                        
                        {users.map((u) => (
                            <tr key={u.id} 
                                className="hover:bg-slate-50 
                                           dark:hover:bg-slate-800/50 
                                            transition-colors">

                                <td className="px-6 py-4">
                                    <div className="font-semibold text-slate-900 
                                                    dark:text-slate-100">
                                        {u.name}
                                    </div>

                                    <div className="text-xs text-slate-500">
                                        {u.email}
                                    </div>
                                </td>
                                
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 text-xs 
                                                      font-bold rounded-full ${
                                        u.isApproved 
                                        ? 'bg-emerald-100 text-emerald-700' 
                                        : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {u.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                </td>
                                
                                <td className="px-6 py-4 text-right space-x-2">
                                    {u.role !== 'admin' && (
                                        <>
                                            <button 
                                                onClick={() => onToggleAccess(u.id, u.isApproved)}
                                                className={`px-3 py-1.5 rounded-lg 
                                                            font-semibold text-xs 
                                                            transition-colors ${
                                                    u.isApproved 
                                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                            >
                                                {u.isApproved ? 'Revoke' : 'Approve'}
                                            </button>

                                            <button 
                                                onClick={() => onDelete(u.id)}
                                                className="px-3 py-1.5 rounded-lg 
                                                           font-semibold text-xs bg-red-50 
                                                           text-red-600 hover:bg-red-100 
                                                           transition-colors">
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>
        </div>
    );
};