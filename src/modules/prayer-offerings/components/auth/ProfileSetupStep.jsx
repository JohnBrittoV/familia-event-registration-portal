import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '../../../../components/ui/Button';
import { FloatingInput } from '../../../../components/ui/form/FloatingInput';

export const ProfileSetupStep = ({ mobile, onSubmit, onBack, isLoading, error: serverError }) => {
    
    const methods = useForm({
        defaultValues: {
            name: '',
            place: ''
        },
        mode: 'onChange'
    });

    const { handleSubmit, register, formState: {errors}} = methods;
    const onFormSubmit = (data) => {
        onSubmit(data);
    }

   return (
    <div className="flex flex-col items-center justify-center 
                    min-h-screen bg-slate-50 dark:bg-slate-900 p-4 
                    font-sans transition-colors duration-200">

      <div className="text-center mb-8">
        <div className="bg-blue-600 text-white w-12 h-12 
                        rounded-xl flex items-center justify-center 
                        mx-auto mb-4 shadow-lg">

           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
           </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 
                       dark:text-white mb-2">Familia'26 Intercession</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Just a few details to set up your profile</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl 
                        shadow-sm w-full max-w-md border 
                        border-slate-100 dark:border-slate-700">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            
            {/* Disabled display for Mobile using FloatingInput */}
            <FloatingInput
              name="mobileDisplay"
              label="Mobile"
              value={`+91 ${mobile}`}
              disabled={true}
              className="peer block w-full appearance-none rounded-xl 
                         border-2 border-slate-200 dark:border-slate-700 
                         bg-slate-50 dark:bg-slate-900/50 px-4 pb-2.5 pt-5 
                         text-sm text-slate-500 cursor-not-allowed 
                         focus:outline-none focus:ring-0"
            />

            <FloatingInput
              name="name"
              label="Name"
              disabled={isLoading}
              validation={{ required: "Name is required" }}
            />

            <FloatingInput
              name="place"
              label="Place"
              disabled={isLoading}
              validation={{ required: "Place is required" }}
            />

            {serverError && <p className="text-red-500 text-sm font-medium">{serverError}</p>}

            <div className="pt-2 space-y-4">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full rounded-xl"
              >
                Join & Start Praying
              </Button>

              <button
                type="button"
                onClick={onBack}
                disabled={isLoading}
                className="w-full text-slate-500 dark:text-slate-400 
                           text-sm hover:text-slate-700 
                           dark:hover:text-slate-200 transition-colors"
              >
                &lt; Use a different number
              </button>
            </div>
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