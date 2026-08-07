import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export const UserAccessTable = ({ users, onToggleAccess, 
                                  onToggleRole, onDelete, 
                                  title = "Responsible Persons Access Management", 
                                  subtitle = "Manage portal access for users.",
                                  showApprovalButton = true
            }) => {

    const navigate = useNavigate();

    return (
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl 
                          shadow-sm border border-slate-200 
                          dark:border-slate-700 overflow-hidden">
            
            <div className="p-5 border-b border-slate-200 
                            dark:border-slate-700 flex justify-between">
                
                <div>
                    <h2 className="font-bold text-lg 
                               text-slate-900 dark:text-white">
                                {title}
                    </h2>

                    <p className="text-sm text-slate-500 
                                dark:text-slate-400">
                                    {subtitle}
                    </p>
                </div>
                
                <Button 
                    variant="iconOnly" 
                    onClick={() => navigate('/admin/responsible-persons')}
                    className="text-xs font-semibold px-4 py-2 rounded-xl"
                >
                    View All RPs &rarr;
                </Button>

            </div>
            
            <div className="overflow-x-auto">
                
                <table className="w-full text-left text-sm whitespace-nowrap">
                    
                    <thead className="bg-slate-50 dark:bg-slate-900/50
                                        border-b border-slate-200 dark:border-slate-700 
                                        text-slate-500 dark:text-slate-400 font-medium">
                        <tr>
                            <th className="px-6 py-4">User (Name & Email)</th>
                            <th className="px-6 py-4">Reg</th>
                            <th className="px-6 py-4 text-center">Account Status</th>
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
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 ring-2 ring-emerald-500/20">
                                            {u.photoURL || u.image ? (
                                                <img 
                                                    src={u.photoURL || u.image} 
                                                    alt={u.name || "User"} 
                                                    className="w-full h-full object-cover"
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <span>{u.name ? u.name.charAt(0).toUpperCase() : 'U'}</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                {u.name}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {u.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                                    {u.assignedCount ?? u.participantCount ?? 0}
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
                                <div className="flex items-center gap-2 min-w-32.5">
                                    {u.role !== 'owner' && (
                                    <>
                                        {/* Approve / Revoke button */}
                                        {showApprovalButton && (
                                        <button
                                            onClick={() => onToggleAccess(u.id, u.isApproved)}
                                            className={`
                                            w-full px-4 py-2 rounded-lg text-sm font-semibold
                                            transition-all duration-200 ease-in-out
                                            shadow-sm hover:shadow-md active:scale-[0.97]
                                            focus:outline-none focus:ring-2 focus:ring-offset-2
                                            ${
                                                u.isApproved
                                                ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200 focus:ring-amber-400 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700'
                                                : 'bg-emerald-600 text-white border border-emerald-700 hover:bg-emerald-700 focus:ring-emerald-500 dark:bg-emerald-700 dark:border-emerald-600'
                                            }
                                            `}
                                        >
                                            {u.isApproved ? 'Revoke' : 'Approve'}
                                        </button>
                                        )}

                                        {/* Make Admin / Dismiss Admin button */}
                                        <button
                                        onClick={() => onToggleRole(u.id, u.role)}
                                        className={`
                                            w-full px-4 py-2 rounded-lg text-sm font-semibold
                                            transition-all duration-200 ease-in-out
                                            shadow-sm hover:shadow-md active:scale-[0.97]
                                            focus:outline-none focus:ring-2 focus:ring-offset-2
                                            ${
                                            u.role === 'admin'
                                                ? 'bg-orange-100 text-orange-800 border border-orange-300 hover:bg-orange-200 focus:ring-orange-400 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700'
                                                : 'bg-indigo-600 text-white border border-indigo-700 hover:bg-indigo-700 focus:ring-indigo-500 dark:bg-indigo-700 dark:border-indigo-600'
                                            }
                                        `}
                                        >
                                        {u.role === 'admin' ? 'Dismiss Admin' : 'Make Admin'}
                                        </button>

                                        {/* Delete button */}
                                        <button
                                        onClick={() => onDelete(u.id)}
                                        className="
                                            w-full px-4 py-2 rounded-lg text-sm font-semibold
                                            bg-rose-50 text-rose-700 border border-rose-200
                                            hover:bg-rose-100 hover:border-rose-300 hover:shadow-md
                                            active:scale-[0.97]
                                            transition-all duration-200 ease-in-out
                                            focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2
                                            dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800
                                        "
                                        >
                                        Delete
                                        </button>
                                    </>
                                    )}
                                </div>
                                </td>
                            </tr>
                        ))}

                        {users.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 mb-1">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            No responsible persons found
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                                            There are currently no active responsible person accounts registered or pending in the system database.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>

            </div>
        </div>
    );
};