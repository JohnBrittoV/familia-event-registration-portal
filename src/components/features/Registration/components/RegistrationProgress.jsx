import React from "react";
import { ChevronRight } from "lucide-react";

export const RegistrationProgress = ({ currentStep }) => {

    return(

        <div className="mb-8 border-b border-slate-100 
                      dark:border-slate-700 pb-6">

            <div className="flex items-center 
                            justify-between text-sm 
                            font-medium">

                <span className={currentStep >= 1 ? "text-blue-600 font-bold" : "text-slate-400"}>
                    1. Personal Info
                </span>

                <ChevronRight size={16} className="text-slate-300 mx-2" />

                <span className={currentStep >= 2 ? "text-blue-600 font-bold" : "text-slate-400"}>
                    2. Contact Details
                </span>

                <ChevronRight size={16} className="text-slate-300 mx-2" />

                <span className={currentStep === 3 ? "text-blue-600 font-bold" : "text-slate-400"}>
                    3. Participation
                </span>

            </div>
        </div>

    );
};