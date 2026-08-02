import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Greeting } from '../components/features/Greeting';
import { FileSpreadsheet, Calendar, Download } from 'lucide-react';

export const RPExport = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            
            <Greeting 
                name={user?.displayName} 
                role="Reports" 
                subtitle="Export your registration data and generate summary reports for your records." 
            />

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden p-6 md:p-8">
                
                <div className="flex items-center gap-3 mb-2">
                    <Download className="text-blue-600 dark:text-blue-400" size={24} />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Download Registration Data</h2>
                </div>
                
                <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm md:text-base">
                    Generate and download a spreadsheet containing all the details of the participants you have submitted to Familia'26.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Export Option 1 */}
                    <button className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left group">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <FileSpreadsheet size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">Full Export (CSV)</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Download all your historical records</p>
                        </div>
                    </button>

                    {/* Export Option 2 */}
                    <button className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all text-left group">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">Recent (Excel)</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Registrations from the last 30 days</p>
                        </div>
                    </button>

                </div>
            </div>

        </div>
    );
};