import { useAuth } from '../context/AuthContext';

export const downloadCSV = (submissions, selectedFields, responsiblePersonName = 'Responsible Person', fileName = 'familia26_export.csv') => {
    if (!submissions || submissions.length === 0) return;

    // Filter fields to export
    const headers = Object.keys(selectedFields).filter(key => selectedFields[key]);
    
    // Create CSV rows
    const csvRows = [];

    // Human-readable headers mapping
    const headerLabels = {
        fullName: "Full Name",
        spouseName: "Spouse Name",
        houseName: "House Name",
        homeTown: "Home Town",
        parish: "Parish",
        phone1: "Mobile Number",
        totalMembers: "Total Members",
        advanceAmount: "Advance Amount",
        weddingAnniversary: "Wedding Anniversary",
        createdAt: "Registration Date"
    };

    csvRows.push(`"Familia'26 Participants - ${responsiblePersonName}"`);
    csvRows.push(''); // Empty separator row
    csvRows.push(headers.map(h => headerLabels[h] || h).join(','));

    for (const sub of submissions) {
        const values = headers.map(header => {
            let val = '';
            
            if (header === 'totalMembers') {
                val = sub.calculatedStats?.total ?? 0;
            } else if (header === 'weddingAnniversary') {
                // Format YYYY-MM-DD to DD/MM/YYYY if available
                const rawDate = sub[header];
                if (rawDate && rawDate.includes('-')) {
                    const [yyyy, mm, dd] = rawDate.split('-');
                    val = `${dd}/${mm}/${yyyy}`;
                } else {
                    val = rawDate || '';
                }
            } else if (header === 'createdAt') {
                // Handle Firestore Timestamp or standard date string
                const timestamp = sub[header];
                if (timestamp && typeof timestamp.toDate === 'function') {
                    val = timestamp.toDate().toLocaleDateString('en-GB'); // dd/mm/yyyy format
                } else if (timestamp) {
                    val = new Date(timestamp).toLocaleDateString('en-GB');
                } else {
                    val = '';
                }
            } else {
                val = sub[header] !== undefined && sub[header] !== null ? sub[header] : '';
            }

            const escaped = String(val).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};