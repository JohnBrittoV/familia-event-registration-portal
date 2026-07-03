import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { fetchAllUsers, toggleUserApproval } from '../services/AuthService';
import { Spinner } from '../components/ui/Spinner';

export const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const  loadUsers = async () => {
            try {
                const data = await fetchAllUsers();
                setUsers(data);
            } catch (error) {
                console.error("Failed to load users", error);
            }
            finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    // Handle the User Access
    const handleToggleAccess = async (userId, currentStatus) => {
        try {
            const newStatus = await toggleUserApproval(userId, currentStatus);

            setUsers(users.map(user =>
                user.id === userId ? { ...user, isApproved: newStatus } : user
            ))

        } catch (error) {
            alert("Failed to update user status");
        }
    };

    return(
        <AdminLayout>
            <div className='p-6 md:p-10 max-w-6xl mx-auto'>
                <div className='mb-8'>

                    <h1 className="text-2xl sm:text-3xl font-bold 
                                   text-slate-900 dark:text-white">User Access Management</h1>

                    <p className="text-slate-600 dark:text-slate-400 
                                    mt-1">
                        Review and approve responsible persons for the registration portal.</p>
                </div>

                {loading ? (
                    <Spinner size='lg'/>
                ) : (
                    <div className='bg-white dark:bg-slate-800 
                                    rounded-2xl shadow-sm border 
                                    border-slate-200 dark:border-slate-700 
                                    overflow-hidden'>

                        <div className='overflow-x-auto'>
                            
                            <table className='className="w-full text-left 
                                              text-sm whitespace-nowrap'>
                                
                                <thead className="bg-slate-50 dark:bg-slate-900/50 
                                                    border-b border-slate-200 
                                                    dark:border-slate-700 text-slate-500 
                                                    dark:text-slate-400 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                                    
                                </thead>

                                <tbody className='divide-y divide-slate-100
                                                dark:divide-slate-700'>
                                    
                                    { users.map((u) => (

                                        <tr key={u.id} 
                                            className='hover:bg-slate-50 
                                                       dark:hover:bg-slate-800/50 
                                                       transition-colors'>

                                            <td className='px-6 py-4 font-semibold 
                                                           text-slate-900 
                                                           dark:text-slate-100'>
                                                {u.name}
                                            </td>

                                            <td className='px-6 py-4 
                                                           text-slate-600 
                                                           dark:text-slate-400'>
                                                {u.email}
                                            </td>

                                            <td className="px-6 py-4 text-slate-600
                                                           dark:text-slate-400 capitalize">
                                                {u.role.replace('_', ' ')}
                                            </td>

                                            <td className='px-6 py-4'>
                                                <span className={`px-3 py-1 text-xs font-bold 
                                                                  rounded-full ${u.isApproved 
                                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'  
                                                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' }  `}>
                                                    
                                                    {u.isApproved ? 'Approved' : 'Pending'}

                                                </span>
                                            </td>
                                            
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleToggleAccess(u.id, u.isApproved)}
                                                    // Hide the button if trying to revoke another Admin
                                                    className={`px-4 py-2 rounded-lg font-semibold 
                                                                text-xs transition-colors ${
                                                        u.role === 'admin' ? 'hidden' : 
                                                        u.isApproved 
                                                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
                                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                                    }`}
                                                >
                                                    {u.isApproved ? 'Revoke Access' : 'Approve User'}
                                                </button>
                                            </td>

                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>

                    </div>
                )
            
            }
            </div>
        </AdminLayout>
    )
}