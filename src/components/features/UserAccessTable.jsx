import React from 'react';

export const UserAccessTable = ({ users, onToggleAccess, onToggleRole, onDelete }) => {
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
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 
                                      dark:divide-slate-700">
                        
                        {users.map((u) => (
                            <tr key={u.id} 
                                className="hover:bg-slate-50 
                                           dark:hover:bg-slate-800/50 
                                            transition-colors">

                                {/* User infor column */}
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-slate-900 
                                                    dark:text-slate-100">
                                        {u.name}
                                    </div>

                                    <div className="text-xs text-slate-500">
                                        {u.email}
                                    </div>
                                </td>

                                {/* User role column */}
                                <td className="px-6 py-4 text-slate-600
                                             dark:text-slate-400 capitalize">
                                    {u.role?.replace('_', ' ')}
                                </td>

                                 {/* Status column  */}
                                <td className="px-6 py-4 text-center">
                                    <span className={`w-24 inline-block px-3 py-1 text-xs 
                                                      font-bold rounded-full text-center ${
                                        u.isApproved 
                                        ? 'bg-emerald-100 text-emerald-700' 
                                        : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {u.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                </td>
                                
                               {/* Action Buttons column */}
                                <td className="px-6 py-4">
                                    <div className='flex items-center justify-center gap-2'>
                                    {u.role !== 'owner' && (
                                        <>
                                            {/* Approve/Revoke column */}
                                            <button 
                                                onClick={() => onToggleAccess(u.id, u.isApproved)}
                                                className={`w-24 text-center px-3 py-1.5 rounded-lg 
                                                            font-semibold text-xs 
                                                            transition-colors ${
                                                    u.isApproved 
                                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                            >
                                                {u.isApproved ? 'Revoke' : 'Approve'}
                                            </button>

                                            {/* Promotion/Demotion Column */}
                                            <button
                                                onClick={() => onToggleRole(u.id, u.role)}
                                                 className={`w-32 text-center px-3 py-1.5 rounded-lg 
                                                             font-semibold text-xs 
                                                             transition-colors ${
                                                    u.role === 'admin'
                                                    ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400'
                                                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400'
                                                }`}
                                                >
                                                    {u.role === 'admin' ? 'Dismiss Admin' : 'Make Admin'}
                                            </button>

                                            <button 
                                                onClick={() => onDelete(u.id)}
                                                className="w-20 text-center px-3 py-1.5 rounded-lg 
                                                           font-semibold text-xs bg-red-50 
                                                           text-red-600 hover:bg-red-100 
                                                           transition-colors">
                                                Delete
                                            </button>
                                        </>
                                    )}
                                    </div>
                                </td>
                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>
        </div>
    );
};