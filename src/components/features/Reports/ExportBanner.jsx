import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const ExportBanner = ({ hasSubmissions, count }) => {
    if (!hasSubmissions) {
        return (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-3 text-amber-800 dark:text-amber-300 mb-6">
                <AlertCircle size={20} className="shrink-0 mt-0.5 text-amber-600" />
                <div className="text-xs sm:text-sm">
                    <p className="font-bold">No participants found in your submissions.</p>
                    <p className="mt-0.5 opacity-90">
                        You have not added any records yet. Add participants to your submissions in order to download report files containing your registered data.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 mb-6">
            <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
            <p className="text-xs sm:text-sm font-medium">
                Ready to export! You have <span className="font-bold">{count}</span> submission record(s) available for download.
            </p>
        </div>
    );
};