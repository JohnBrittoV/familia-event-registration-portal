import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { doc, getDoc, updateDoc, runTransaction, increment } from 'firebase/firestore';
import { updateParticipantRegistration } from '../components/features/Registration/service/registrationService';
import { db } from '../config/firebase.config';
import { ArrowLeft, User, MapPin, CheckSquare, Plus, Trash2, Save } from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';

export const RPParticipantProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [fetchError, setFetchError] = useState(null);

    // Initialize React Hook Form
    const { register, control, handleSubmit, reset, watch, setValue, formState: { isDirty, errors } } = useForm({
        defaultValues: {
            fullName: '',
            dob: '',
            spouseName: '',
            spouseDob: '',
            weddingAnniversary: '',
            children: [],
            houseName: '',
            homeTown: '',
            parish: '',
            address: '',
            phone1: '',
            phone2: '',
            attendees: { self: true, spouse: false },
            prayerRequest: ''
        }
    });

    const { fields: childFields, append, remove } = useFieldArray({
        control,
        name: "children"
    });

    // Fetch participant data on mount
    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const docRef = doc(db, "registrations", id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();

                    if (data.children && Array.isArray(data.children)) {
                        data.children = data.children.map(child => ({
                            ...child,
                            isAttending: true 
                        }));
                    }

                    setOriginalData(data);
                    // Reset form fields with fetched data
                    reset(data);
                } else {
                    setFetchError("Participant record could not be found.");
                }
            } catch (err) {
                console.error("Error loading profile:", err);
                setFetchError("Failed to fetch participant details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) loadProfile();
    }, [id, reset]);

    const watchedChildren = useWatch({
        control,
        name: "children"
    });

    // Watch fields for live attendance & live statistics calculation
    const watchedSelf = watch("attendees.self");
    const watchedSpouse = watch("attendees.spouse");
    const spouseName = watch("spouseName");
    const fullName = watch("fullName");

    // Real-time calculation of attending adults and kids
    const calculatedStats = React.useMemo(() => {
        let adults = 0;
        let kids = 0;

        if (watchedSelf) adults += 1;
        if (watchedSpouse && spouseName?.trim()) adults += 1;

        if (watchedChildren && Array.isArray(watchedChildren)) {
            watchedChildren.forEach(child => {
                if (child?.isAttending && child?.name?.trim()) {
                    kids += 1;
                }
            });
        }

        return {
            adults,
            kids,
            total: adults + kids
        };
    }, [watchedSelf, watchedSpouse, watchedChildren, spouseName]);

    // Handle Form Update Submission
    const onSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            // Call our transactional service which handles deltas automatically
            await updateParticipantRegistration(id, formData, calculatedStats, originalData);
            
            // Attach the newly calculated stats to the payload
            const updatedFullData = {
                ...originalData,
                ...formData,
                calculatedStats,
                updatedAt: new Date()
            };

            setOriginalData(updatedFullData);

            // Reset form dirty state with new data to hide sticky bar
            reset(updatedFullData);
            alert("Participant profile updated successfully!");
        } catch (err) {
            console.error("Error updating document:", err);
            alert("Failed to update profile changes.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Spinner size="lg" />
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-slate-800 rounded-xl text-center shadow-sm">
                <p className="text-red-500 font-medium mb-4">{fetchError}</p>
                <button onClick={() => navigate(-1)} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg text-sm font-semibold">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-in fade-in duration-300">
            
            {/* Header Area */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm hover:bg-slate-50 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Participant Profile</h1>
                        <p className="text-sm text-slate-500">Registered by: <span className="font-semibold">{originalData?.ResponsiblePersonName || 'Admin'}</span></p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* STEP 1: PERSONAL INFO BIODATA */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <h2 className="font-bold text-lg text-slate-900 dark:text-white">1. Personal Information</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</label>
                            <input {...register("fullName")} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Date of Birth</label>
                            <input type="date" {...register("dob")} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Spouse Name</label>
                            <input {...register("spouseName")} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Spouse DOB</label>
                            <input type="date" {...register("spouseDob")} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Wedding Anniversary</label>
                            <input type="date" {...register("weddingAnniversary")} className="w-full md:w-1/2 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100" />
                        </div>

                        {/* Dynamic Children Section */}
                        <div className="md:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Children Details</label>
                                <button type="button" onClick={() => append({ name: '', age: '', isAttending: true })} className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                                    <Plus size={14}/> Add Child
                                </button>
                            </div>
                            <div className="space-y-3">
                                {childFields.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-3">
                                        <input {...register(`children.${index}.name`)} placeholder="Child's Name" className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
                                        <input type="number" {...register(`children.${index}.age`)} placeholder="Age" className="w-40 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
                                        <button type="button" onClick={() => remove(index)} className="p-2.5 text-red-500 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                {childFields.length === 0 && <p className="text-sm text-slate-400 italic">No children added.</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* STEP 2: CONTACT DETAILS */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                        <h2 className="font-bold text-lg text-slate-900 dark:text-white">2. Contact Details</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">House Name</label>
                            <input {...register("houseName")} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Place / Hometown</label>
                            <input {...register("homeTown")} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Parish</label>
                            <input {...register("parish")} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Address</label>
                            <textarea {...register("address")} rows="2" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Primary Phone</label>
                            <input {...register("phone1")} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">WhatsApp / Alt Phone</label>
                            <input {...register("phone2")} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
                        </div>
                    </div>
                </div>

                {/* STEP 3: PARTICIPATION INFO */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                        <CheckSquare className="w-5 h-5 text-purple-600" />
                        <h2 className="font-bold text-lg text-slate-900 dark:text-white">3. Event Participation</h2>
                    </div>
                    
                    <div className="p-6">
                        {/* Live Stats Banner */}
                        <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl text-center border border-slate-100 dark:border-slate-800">
                                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{calculatedStats.adults}</p>
                                <p className="text-xs font-semibold text-slate-500 uppercase">Adults</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl text-center border border-slate-100 dark:border-slate-800">
                                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{calculatedStats.kids}</p>
                                <p className="text-xs font-semibold text-slate-500 uppercase">Kids</p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl text-center border border-blue-100 dark:border-blue-800/50">
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{calculatedStats.total}</p>
                                <p className="text-xs font-semibold text-blue-600 dark:text-blue-500 uppercase">Total</p>
                            </div>
                        </div>

                        <p className="text-sm text-slate-500 mb-4">Select the family members who will be attending Familia'26.</p>
                        
                        {/* Member Selection Cards */}
                        <div className="space-y-3 mb-6">
                            {/* Participant Card */}
                            <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${watchedSelf ? 'border-blue-500 bg-blue-50/50 dark:bg-slate-800 dark:border-blue-500' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}>
                                <input type="checkbox" {...register("attendees.self")} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mr-4 cursor-pointer" />
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white text-sm">{fullName || 'Primary Participant'}</p>
                                    <p className="text-xs text-slate-500">Participant</p>
                                </div>
                            </label>

                            {/* Spouse Card */}
                            {spouseName?.trim() && (
                                <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${watchedSpouse ? 'border-blue-500 bg-blue-50/50 dark:bg-slate-800 dark:border-blue-500' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}>
                                    <input type="checkbox" {...register("attendees.spouse")} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mr-4 cursor-pointer" />
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{spouseName}</p>
                                        <p className="text-xs text-slate-500">Spouse</p>
                                    </div>
                                </label>
                            )}

                            {/* Children Cards */}
                            {childFields.map((field, index) => (
                                <label key={field.id} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${watch(`children.${index}.isAttending`) ? 'border-blue-500 bg-blue-50/50 dark:bg-slate-800 dark:border-blue-500' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}>
                                    <input type="checkbox" {...register(`children.${index}.isAttending`)} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mr-4 cursor-pointer" />
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{watch(`children.${index}.name`) || `Child ${index + 1}`}</p>
                                        <p className="text-xs text-slate-500">Child</p>
                                    </div>
                                </label>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Special Prayer Requests</label>
                            <textarea {...register("prayerRequest")} rows="3" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100" />
                        </div>
                    </div>
                </div>

                {/* STICKY ACTION BAR - ONLY SHOWS WHEN 'isDirty' IS TRUE */}
                <div className={`fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-transform duration-300 z-40 ${isDirty ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Unsaved changes detected</p>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => reset(originalData)} className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                Discard
                            </button>
                            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm">
                                {isSubmitting ? <Spinner size="sm" /> : <Save size={16} />} Update Changes
                            </button>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}