import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Greeting } from '../components/features/Greeting';
import { ExportBanner } from '../components/features/Reports/ExportBanner';
import { FieldSelector } from '../components/features/Reports/FieldSelector';
import { downloadCSV } from '../services/exportService';
import { FileSpreadsheet, Download, Loader2 } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.config';

export const RPExport = () => {
    const { user, dbUser } = useAuth();
    const [userSubmissions, setUserSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Field selection including new details
    const [selectedFields, setSelectedFields] = useState({
        fullName: true,
        spouseName: true,
        houseName: true,
        homeTown: true,
        parish: true,
        phone1: true,
        totalMembers: true,
        advanceAmount: false,
        weddingAnniversary: false,
        createdAt: true
    });

    useEffect(() => {
        const fetchUserRegistrations = async () => {
            if (!user?.uid) {
                setLoading(false);
                return;
            }

            try {
                const q = query(
                    collection(db, "registrations"),
                    where("registeredBy", "==", user.uid)
                );
                const querySnapshot = await getDocs(q);
                const docs = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUserSubmissions(docs);
            } catch (err) {
                console.error("Error fetching user submissions for export:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRegistrations();
    }, [user?.uid]);

    const handleExport = () => {
        if (userSubmissions.length === 0) return;

        // Resolve the Responsible Person's name from user data
        const responsiblePersonName = dbUser?.fullName || user?.displayName || 'Responsible Person';

        downloadCSV(
            userSubmissions, 
            selectedFields, 
            responsiblePersonName, 
            `familia26_submissions_${user?.uid || 'export'}.csv`
        );
    };

    const hasSubmissions = userSubmissions.length > 0;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-24">
            
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
                
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm md:text-base">
                    Download a spreadsheet of your submitted Familia'26 participants.
                </p>

                {loading ? (
                    <div className="flex items-center justify-center py-8 text-slate-500 gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        <span className="text-sm">Loading your submissions...</span>
                    </div>
                ) : (
                    <>
                        <ExportBanner hasSubmissions={hasSubmissions} count={userSubmissions.length} />
                        <FieldSelector selectedFields={selectedFields} onChange={setSelectedFields} />

                        <button 
                            onClick={handleExport}
                            disabled={!hasSubmissions}
                            className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm transition-colors shadow-sm">
                            <FileSpreadsheet size={18} /> Download Selected CSV Report
                        </button>
                    </>
                )}

            </div>

        </div>
    );
}