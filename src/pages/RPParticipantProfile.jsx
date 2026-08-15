import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { doc, getDoc, updateDoc, runTransaction, increment } from 'firebase/firestore';
import { useAccommodations } from '../components/features/Accommodation/Hooks/useAccommodations';
import { updateParticipantRegistration } from '../components/features/Registration/service/registrationService';
import { validationRules } from '../components/features/Registration/schema/RegistrationSchema';
import { db } from '../config/firebase.config';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, MapPin, CheckSquare, Plus, Trash2, Edit3, X, 
         Save, TriangleAlertIcon, Info, AlertCircle, Building2, BedDouble } from 'lucide-react';

export const RPParticipantProfile = () => {
    const { id } = useParams();
    const { user, dbUser } = useAuth();
    const { blocks, loading: accommodationLoading } = useAccommodations();

    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    
    const [isEditingAccommodation, setIsEditingAccommodation] = useState(false);
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);

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
            prayerRequest: '',
            advancePaid: false,
            advanceAmount: '', 
            accommodation: {
                blockId: '',
                blockName: '',
                roomType: ''
            }
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

                    const sanitizedData = {
                        ...data,
                        accommodation: {
                            blockId: data.accommodation?.blockId || '',
                            blockName: data.accommodation?.blockName || '',
                            roomType: data.accommodation?.roomType || ''
                        } 
                    };

                    setOriginalData(sanitizedData);
                    reset(sanitizedData);
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

    const loggedInUserId = user?.uid;
    const profileOwnerId = originalData?.registeredBy;

    const isAdmin = dbUser?.role === 'admin' || dbUser?.role === 'owner';
    const isCreator = loggedInUserId && profileOwnerId && loggedInUserId === profileOwnerId;
    
    const isReadOnly = !isAdmin && !isCreator;

    const watchedChildren = useWatch({
        control,
        name: "children"
    });

    // Watch fields for live attendance & live statistics calculation
    const watchedSelf = watch("attendees.self");
    const watchedSpouse = watch("attendees.spouse");
    const spouseName = watch("spouseName");
    const fullName = watch("fullName");
    const isAdvancePaid = watch("advancePaid");

    // Accommodation watchers
    const selectedBlockId = watch('accommodation.blockId');
    const selectedRoomType = watch('accommodation.roomType');
    const currentBlock = blocks.find(b => b.id === selectedBlockId);

    // Handle block selection change
    const handleBlockSelect = (block) => {
        if (isReadOnly) return;
        setValue('accommodation.blockId', block.id, { shouldDirty: true });
        setValue('accommodation.blockName', block.blockName, { shouldDirty: true });
        setValue('accommodation.roomType', '', { shouldDirty: true }); // Reset room type when block changes
    };

    // Handle room type selection change
    const handleRoomSelect = (roomType, remaining) => {
        if (isReadOnly) return;
        if (remaining <= 0) return;
        setValue('accommodation.roomType', roomType, { shouldDirty: true });
    };

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

    // Validation constants
    const isAdultsValid = calculatedStats.adults >= 2;
    const isAccommodationValid = Boolean(selectedBlockId && selectedRoomType);

    // Handle Form Update Submission
    const onSubmit = async (formData) => {
        if (isReadOnly) return;

        setAttemptedSubmit(true);
        if (!isAdultsValid || !isAccommodationValid) {
            return;
        }

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
            reset(updatedFullData);

            setIsEditingAccommodation(false);
            setAttemptedSubmit(false);
            alert("Participant profile updated successfully!");
        } catch (error) {
            console.error("Error updating document:", error);
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

    const originalAcc = originalData?.accommodation || {};
    const hasAssignedRoom = Boolean(originalAcc.blockName && originalAcc.roomType);

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

            {isReadOnly ? (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center gap-3 text-amber-800 dark:text-amber-300 text-sm font-medium">
                    <TriangleAlertIcon className="shrink-0 w-5 h-5"/>
                    <p>
                        <span className='font-bold'>Read-Only Mode :</span> <span className='font-normal'>You can view this participant's details from the Global Event Directory, but you cannot edit them because this family was registered by another Responsible Person.</span>
                    </p>
                </div>
            ) : (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-center gap-3 text-blue-800 dark:text-blue-300 text-sm font-medium">
                    <Info className='shrink-0 w-5 h-5'/>
                    <p>
                        <span className='font-bold'>Editable Profile :</span> <span className='font-normal'>Because you originally registered this participant (or hold administrator privileges), you have full access to update or correct these details.</span>
                    </p>
                </div>
            )}

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
                            <input {...register("fullName", validationRules.name)} disabled={isReadOnly} autoCapitalize='characters' className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100" />

                            {errors.fullName && (
                                <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.fullName.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Date of Birth</label>
                            <input type="date" {...register("dob", validationRules.dob)} disabled={isReadOnly} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100" />
                            
                            {errors.dob && (
                                <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.dob.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Spouse Name</label>
                            <input {...register("spouseName", validationRules.name)} autoCapitalize='characters' disabled={isReadOnly} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100" />
                            
                            {errors.spouseName && (
                                <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.spouseName.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Spouse DOB</label>
                            <input type="date" {...register("spouseDob", validationRules.optionalDate)} disabled={isReadOnly} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100" />
                        
                            {errors.spouseDob && (
                                <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.spouseDob.message}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Wedding Anniversary</label>
                            <input type="date" {...register("weddingAnniversary", validationRules.weddingDate)} disabled={isReadOnly} className="w-full md:w-1/2 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100" />
                        
                            {errors.weddingAnniversary && (
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.weddingAnniversary.message}</p>
                            )}
                        </div>

                        {/* Dynamic Children Section */}
                        <div className="md:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Children Details</label>
                                {!isReadOnly && (
                                    <button type="button" onClick={() => append({ name: '', age: '', isAttending: false })} className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                                        <Plus size={14}/> Add Child
                                    </button>
                                )}
                            </div>
                            <div className="space-y-3">
                                {childFields.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-3">
                                        <input {...register(`children.${index}.name`, validationRules.childName)} autoCapitalize='characters'  disabled={isReadOnly} placeholder="Child's Name" className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
                                        
                                        {errors.children?.[index]?.name && (
                                            <p className="text-xs text-red-500 mt-1">{errors.children[index].name.message}</p>
                                        )}

                                        <input type="number" {...register(`children.${index}.age`, validationRules.childAge)} disabled={isReadOnly} placeholder="Age" className="w-40 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
                                        
                                        {errors.children?.[index]?.age && (
                                            <p className="text-xs text-red-500 mt-1">{errors.children[index].age.message}</p>
                                        )}
                                        {!isReadOnly && (
                                            <button type="button" onClick={() => remove(index)} className="p-2.5 text-red-500 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        )}
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
                            <input {...register("houseName", validationRules.requiredText)} autoCapitalize='characters' disabled={isReadOnly} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />

                            {errors.houseName && <p className="text-xs text-red-500 mt-1">{errors.houseName.message}</p>}
                        </div>
                        
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Place / Hometown</label>
                            <input {...register("homeTown", validationRules.requiredText)} autoCapitalize='characters' disabled={isReadOnly} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
                            
                            {errors.homeTown && <p className="text-xs text-red-500 mt-1">{errors.homeTown.message}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Parish</label>
                            <input {...register("parish", validationRules.requiredText)} autoCapitalize='characters' disabled={isReadOnly} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
                            
                            {errors.parish && <p className="text-xs text-red-500 mt-1">{errors.parish.message}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Address</label>
                            <textarea {...register("address", validationRules.address)} autoCapitalize='characters' disabled={isReadOnly} rows="2" className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
                        
                            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
                        </div>
                        
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Primary Phone</label>
                            <input {...register("phone1", validationRules.phone)} disabled={isReadOnly} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />

                            {errors.phone1 && <p className="text-xs text-red-500 mt-1">{errors.phone1.message}</p>}
                        </div>
                        
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">WhatsApp / Alt Phone</label>
                            <input {...register("phone2", validationRules.optionalPhone)} disabled={isReadOnly} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-800 dark:text-slate-100" />
                        
                            {errors.phone2 && <p className="text-xs text-red-500 mt-1">{errors.phone2.message}</p>}
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
                                <input type="checkbox" {...register("attendees.self")} disabled={isReadOnly} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mr-4 cursor-pointer" />
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white text-sm">{fullName || 'Primary Participant'}</p>
                                    <p className="text-xs text-slate-500">Participant</p>
                                </div>
                            </label>

                            {/* Spouse Card */}
                            {spouseName?.trim() && (
                                <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${watchedSpouse ? 'border-blue-500 bg-blue-50/50 dark:bg-slate-800 dark:border-blue-500' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}>
                                    <input type="checkbox" {...register("attendees.spouse")} disabled={isReadOnly} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mr-4 cursor-pointer" />
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{spouseName}</p>
                                        <p className="text-xs text-slate-500">Spouse</p>
                                    </div>
                                </label>
                            )}

                            {/* Children Cards */}
                            {childFields.map((field, index) => (
                                <label key={field.id} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${watch(`children.${index}.isAttending`) ? 'border-blue-500 bg-blue-50/50 dark:bg-slate-800 dark:border-blue-500' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}>
                                    <input type="checkbox" {...register(`children.${index}.isAttending`)} disabled={isReadOnly} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mr-4 cursor-pointer" />
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{watch(`children.${index}.name`) || `Child ${index + 1}`}</p>
                                        <p className="text-xs text-slate-500">Child</p>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {/* Inline Error Message for Adult Participation Rule */}
                        {attemptedSubmit && !isAdultsValid && (
                            <p className="text-xs font-medium text-red-500 mt-3 animate-in fade-in duration-200">
                                Two adults must be selected to proceed with the family registration.
                            </p>
                        )}

                        {/* --- ADVANCE PAYMENT SECTION --- */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden p-6 space-y-4">
                           <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Advance Payment details</label>

                            {/* Checkbox Card */}
                            <label className={`flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 transition-colors ${isReadOnly ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                <input 
                                    type="checkbox" 
                                    {...register("advancePaid")} 
                                    disabled={isReadOnly}
                                    className="w-5 h-5 text-emerald-500 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer disabled:cursor-not-allowed" 
                                />
                                <span className="font-semibold text-slate-900 dark:text-white">Advance Payment Collected</span>
                            </label>

                            {/* Conditionally Rendered Amount Input with Smooth Reveal */}
                            {isAdvancePaid && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                                        Advance Amount Collected *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-semibold text-sm">
                                            ₹
                                        </span>
                                        <input 
                                            type="number"
                                            step="0.01"
                                            disabled={isReadOnly}
                                            placeholder="Enter amount"
                                            {...register("advanceAmount", { 
                                                required: isAdvancePaid ? "Advance amount is required" : false,
                                                min: { value: 1, message: "Amount must be greater than 0" }
                                            })}
                                            className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                    {errors.advanceAmount && (
                                        <p className="text-xs text-red-500 mt-1">{errors.advanceAmount.message}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="pt-4 border rounded-2xl border-slate-200 dark:border-slate-700 mt-5 p-6 space-y-4">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Special Prayer Requests</label>
                            <textarea {...register("prayerRequest")} autoCapitalize='characters' disabled={isReadOnly} rows="3" className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100" />
                        </div>
                    </div>
                </div>

                {/* STEP 4: ACCOMMODATION ALLOTMENT */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h2 className="font-bold text-lg text-slate-900 dark:text-white">4. Accommodation Allotment</h2>
                        </div>
                        {!isReadOnly && hasAssignedRoom && !isEditingAccommodation && (
                            <button 
                                type="button" 
                                onClick={() => setIsEditingAccommodation(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg text-xs font-bold transition-colors"
                            >
                                <Edit3 size={14} /> Change Room
                            </button>
                        )}
                    </div>
                    
                    <div className="p-6 space-y-4">
                        {/* VIEW MODE: If room assigned and NOT editing */}
                        {hasAssignedRoom && !isEditingAccommodation ? (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                                        <BedDouble size={22} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase">Currently Allotted Room</p>
                                        <p className="font-bold text-slate-900 dark:text-white text-base">
                                            {originalAcc.blockName} <span className="text-blue-600 dark:text-blue-400 font-normal">({originalAcc.roomType})</span>
                                        </p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">
                                    Confirmed Accommodation
                                </span>
                            </div>
                        ) : !hasAssignedRoom && !isEditingAccommodation && !isReadOnly ? (
                            <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
                                <p className="text-sm text-slate-500">No room currently allotted for this participant family.</p>
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditingAccommodation(true)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                                >
                                    Select Room Allotment
                                </button>
                            </div>
                        ) : null}

                        {/* EDIT MODE: Revealed Selection Grid */}
                        {(isEditingAccommodation || !hasAssignedRoom) && (
                            <div className="space-y-4 animate-in fade-in duration-200">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Select a block and room category below:</p>
                                    {hasAssignedRoom && (
                                        <button 
                                            type="button" 
                                            onClick={() => setIsEditingAccommodation(false)}
                                            className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                                        >
                                            <X size={14} /> Cancel Editing
                                        </button>
                                    )}
                                </div>

                                {accommodationLoading ? (
                                    <p className="text-xs text-slate-400 py-4">Loading accommodation blocks...</p>
                                ) : blocks.length === 0 ? (
                                    <p className="text-xs text-slate-400 py-4">No accommodation blocks configured by admin yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {/* 1. Block Selection Cards */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Select Block</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {blocks.map((block) => {
                                                    const isSelected = selectedBlockId === block.id;
                                                    return (
                                                        <div
                                                            key={block.id}
                                                            onClick={() => !isReadOnly && handleBlockSelect(block)}
                                                            className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                                                                isReadOnly ? 'cursor-default opacity-80' : 'cursor-pointer'
                                                            } ${
                                                                isSelected 
                                                                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-sm' 
                                                                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                                            }`}
                                                        >
                                                            <span className={`font-semibold text-sm ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'}`}>
                                                                {block.blockName}
                                                            </span>
                                                            <BedDouble size={18} className={isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* 2. Room Type Selector (Appears only when a block is chosen) */}
                                        {currentBlock && (
                                            <div className="animate-in fade-in duration-200 pt-2">
                                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Select Room Category</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {(currentBlock.roomTypes || []).map((room, idx) => {
                                                        const remaining = Number(room.remainingRooms) ?? Number(room.totalRooms);
                                                        const isFullyOccupied = remaining === 0;
                                                        const isSelected = selectedRoomType === room.type;

                                                        const isDorm = room.type.toLowerCase().includes('dormitory');
                                                        const unitLabel = isDorm ? 'Beds' : 'Rooms';

                                                        return (
                                                            <div
                                                                key={idx}
                                                                onClick={() => !isReadOnly && !isFullyOccupied && handleRoomSelect(room.type, remaining)}
                                                                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                                                                    isReadOnly ? 'cursor-default' : 'cursor-pointer'
                                                                } ${
                                                                    isFullyOccupied 
                                                                        ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800' 
                                                                        : isSelected 
                                                                            ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-sm' 
                                                                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                                                }`}
                                                            >
                                                                <div>
                                                                    <p className={`font-semibold text-sm ${isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-200'}`}>
                                                                        {room.type}
                                                                    </p>
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                                        {isFullyOccupied ? 'Fully Occupied' : `${remaining} ${unitLabel} Available`}
                                                                    </p>
                                                                </div>
                                                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                                    isFullyOccupied 
                                                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                                                                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                                }`}>
                                                                    {isFullyOccupied ? 'Full' : `${remaining} Left`}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Inline Error Message for Accommodation Rule */}
                    {attemptedSubmit && !isAccommodationValid && (
                        <p className="text-xs font-medium text-red-500 mt-3 animate-in fade-in duration-200">
                            Please select both an accommodation block and a room type to complete your booking.
                        </p>
                    )}

                {/* STICKY ACTION BAR - ONLY SHOWS WHEN 'isDirty' IS TRUE */}
                { !isReadOnly && (
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
                )}

            </form>
        </div>
    );
}