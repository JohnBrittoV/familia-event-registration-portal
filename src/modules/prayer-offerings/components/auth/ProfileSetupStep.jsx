import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '../../../../components/ui/Button';
import { FloatingInput } from '../../../../components/ui/form/FloatingInput';
import candleIcon from '../../../../assets/icons/Candle.svg';

export const ProfileSetupStep = ({ mobile, onSubmit, onBack, isLoading, error: serverError }) => {
    
    const methods = useForm({
        defaultValues: {
            name: '',
            place: '', 
            realNameConfirmed: false
        },
        mode: 'onChange'
    });

    const { handleSubmit, register, watch,  formState: {errors, isValid}} = methods;
    const realNameConfirmed = watch('realNameConfirmed');
    
    const onFormSubmit = (data) => {
        const { realNameConfirmed, ...profileData} = data;
        onSubmit(profileData);
    }

   return (
    <div className="flex flex-col items-center justify-center 
                    min-h-screen bg-slate-50 dark:bg-slate-900 p-4 
                    font-sans transition-colors duration-200">

      <div className="text-center mb-8">
        <div className="bg-blue-600 text-white w-20 h-20 
                        rounded-xl flex items-center justify-center 
                        mx-auto mb-4 shadow-lg p-1">

           <img src={candleIcon} alt="candle" />
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

            <div className="space-y-1">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isLoading}
                  {...register("realNameConfirmed", {
                    required: "You must confirm that you have entered your real name."
                  })}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900"
                />
                <span className="text-sm text-slate-600 dark:text-slate-300 select-none">
                  I confirm this is my full name.
                </span>
              </label>
              {errors.realNameConfirmed && (
                <p className="text-red-500 text-xs mt-1 ml-7 font-medium">
                  {errors.realNameConfirmed.message}
                </p>
              )}
            </div>

            {serverError && <p className="text-red-500 text-sm font-medium">{serverError}</p>}

            <div className="pt-2 space-y-4">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disabled={!realNameConfirmed || !isValid}
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