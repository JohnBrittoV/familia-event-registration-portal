import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "../../../ui/Button";

export const RegistrationNavigation = ({ currentStep, onPrev, onNext, isValid }) => {

    const baseBtn = "flex-1 inline-flex items-center justify-center gap-1 sm:gap-2 font-semibold py-3 px-2 sm:px-8 rounded-full shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 text-sm sm:text-base text-center leading-tight";
    const primaryBtn = `${baseBtn} bg-blue-600 hover:bg-blue-700 text-white`;
    const secondaryBtn = `${baseBtn} bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white`;

    return(

        <div className="flex flex-row w-full gap-3 sm:gap-4 pt-6 border-t border-slate-100 dark:border-slate-700 mt-8">

                <Button
                    type="button"
                    variant="secondary"
                    onClick={onPrev}
                    disabled={currentStep === 1}
                    className={`${secondaryBtn} ${currentStep === 1 ? 'invisible' : ''}`}>
                    
                    <ChevronLeft size={18} className="mr-0 sm:mr-1 shrink-0"/> Back
                </Button>

                { currentStep < 3 ? (
                    <Button type='button' onClick={onNext} className={primaryBtn}>
                       <span>Next</span>  
                       <ChevronRight size={18} className="ml-0 sm:ml-1 shrink-0"/>
                    </Button>
                ) : (
                    <Button type="submit" disabled={!isValid} className={primaryBtn}>
                        Confirm
                    </Button>
                )}

        </div>
    );
};
