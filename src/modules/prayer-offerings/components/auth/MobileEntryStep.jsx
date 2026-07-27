import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '../../../../components/ui/Button';
import { FloatingInput } from '../../../../components/ui/form/FloatingInput'

export const MobileEntryStep = ({ onSubmit, isLoading, error: serverError }) => {
    
    const methods = useForm({
        defaultValues: {mobile: ''},
        mode: 'onChange'
    });
    
    const { handleSubmit } = methods;

    const onFormSubmit = (data) => {
        onSubmit(data.mobile);
    }

    return (
    <div className="flex flex-col items-center justify-center 
                    min-h-screen bg-slate-50 dark:bg-slate-900 
                    p-4 font-sans transition-colors duration-200">

      <div className="text-center mb-8">
        <div className="bg-blue-600 text-white w-12 h-12 
                        rounded-xl flex items-center justify-center 
                        mx-auto mb-4 shadow-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" 
               viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">

            <path strokeLinecap="round" strokeLinejoin="round" 
                  strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>

        </div>
        <h1 className="text-2xl font-bold text-slate-900 
                       dark:text-white mb-2">Familia'26 Intercession</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
            Enter your mobile to continue & pray
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 
                      rounded-2xl shadow-sm w-full 
                      max-w-md border border-slate-100 
                      dark:border-slate-700">

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="mb-6 flex gap-3 items-start">
              {/* +91 Prefix Box */}
              <div className="bg-slate-50 dark:bg-slate-900 
                                border-2 border-slate-200 
                                dark:border-slate-700 text-slate-600 
                                dark:text-slate-300 rounded-xl px-5 py-3 
                                flex items-center justify-center font-medium 
                                mt-px">
                +91
              </div>
              
              {/* Reused FloatingInput */}
              <div className="flex-1">
                <FloatingInput
                  name="mobile"
                  label="Mobile Number"
                  type="tel"
                  maxLength="10"
                  disabled={isLoading}
                  validation={{
                    required: "Mobile number is required",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Must be exactly 10 digits"
                    }
                  }}
                />
              </div>
            </div>

            {serverError && (
              <p className="text-red-500 text-sm mt-2 mb-4 font-medium">{serverError}</p>
            )}

            {/* Reused Button Component */}
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full rounded-xl"
            >
              Continue
            </Button>
          </form>
        </FormProvider>
      </div>

      <Link to="/" className="mt-8 text-slate-500 dark:text-slate-400 
                              text-sm hover:text-slate-700 dark:hover:text-slate-200 
                              flex items-center gap-2 transition-colors">
        <span>←</span> Return Home
      </Link>
    </div>
  );

}