import React from 'react';
import { FloatingInput } from '../../../../ui/form/FloatingInput';
import { FloatingTextarea } from '../../../../ui/form/FloatingTextarea';
import { validationRules } from '../../schema/RegistrationSchema';
import { FormRow } from '../../../../ui/form/FormRow';
import { FormSection } from '../../../../layout/FormSection';

export const Step2ContactDetails = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <FormSection 
                title="Parish & Location" 
                description="Enter the participant's home parish and town."
            >
                <FormRow>
                    <FloatingInput name="parish" label="Parish *" validation={validationRules.requiredText}/>
                    <FloatingInput name="homeTown" label="Home Town *" validation={validationRules.requiredText}/>
                </FormRow>
            </FormSection>

            <FormSection 
                title="Contact Information" 
                description="How can we reach the participant?"
            >
                {/* Textarea for Address */}
                <FloatingTextarea name="address" label="Full Address *" rows={3} validation={validationRules.address}/>
                
                <FormRow>
                    <FloatingInput name="phone1" type="tel" label="Phone Number 1 *" validation={validationRules.phone}/>
                    <FloatingInput name="phone2" type="tel" label="Phone Number 2 (Optional)" validation={validationRules.optionalPhone}/>
                </FormRow>
            </FormSection>

        </div>
    );
};