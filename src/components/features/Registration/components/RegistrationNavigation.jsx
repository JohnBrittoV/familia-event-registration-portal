import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "../../../ui/Button";

export const RegistrationNavigation = ({ currentStep, onPrev, onNext, isValid }) => {

    return(

        <div className="flex items-center justify-between
                        pt-6 border-t border-slate-100 
                        dark:border-slate-700 mt-8">

                <Button
                    type="button"
                    variant="secondary"
                    onClick={onPrev}
                    disabled={currentStep === 1}
                    className={currentStep === 1 ?  'invisible' : ''}>
                    
                    <ChevronLeft size={18} className="mr-1"/> Back
                </Button>

                { currentStep < 3 ? (
                    <Button type='button' onClick={onNext}>
                        Next Step <ChevronRight size={18} className="ml-1"/>
                    </Button>
                ) : (
                    <Button type="submit" disabled={!isValid}>
                        Confirm Registration
                    </Button>
                )}

        </div>
    );
};
