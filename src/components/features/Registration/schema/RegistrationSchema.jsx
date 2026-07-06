
export const validationRules = {
    
    name: {
        required: 'This field is required',
        pattern: {
            value: /^[A-Za-z\s]+$/,
            message: "Only letters and spaces are allowed"
        }
    }, 

    phone: {
        required: 'Phone number is required',
        pattern: {
            value: /^[0-9]{10}$/,
            message: "Must be exactly 10 digits"
        }
    },

    optionalPhone: {
        pattern: {
            value: /^[0-9]{10}$/,
            message: "Must be exactly 10 digits"
        }
    },

    requiredText: {
        required: "This field is required"
    },

    childName: {
        required: "Child's name is required",
        pattern: {
            value: /^[A-Za-z\s]+$/,
            message: "Only letters and spaces are allowed"
        }
    },
    childAge: {
        required: "Age is required",
        min: {
            value: 0,
            message: "Age cannot be negative"
        },
        max: {
            value: 20, // A reasonable safeguard
            message: "Please enter a valid age"
        }
    },

    requiredDate: {
        required: 'This date is required'
    },

    dob: {
        required: 'Date of birth is required',
        validate: (value) => {
            const selectedDate = new Date (value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
           
            // check future date
            if (selectedDate > today) {
                return "Date cannot be in the future";
            }

            // calculate age
            let age = today.getFullYear() - selectedDate.getFullYear();
            const monthDiff = today.getMonth() - selectedDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
                age--;
            }

            if (age < 18) {
                return "Age must be at least 18 years";
            }

            return true;
        }
    },

    optionalDate: {
        validate: (value) => {
            if(!value) return true;
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            
            // check future date
            if (selectedDate > today) {
                return "Date cannot be in the future";
            }

            // calculate age
            let age = today.getFullYear() - selectedDate.getFullYear();
            const monthDiff = today.getMonth() - selectedDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
                age--;
            }

            if (age < 18) {
                return "Age must be at least 18 years";
            }

            return true;
        }
    },

    weddingDate: {
        required: 'Wedding Date is required',
        validate: (value) => {
            const selectedDate = new Date (value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate <= today || 'Date cannot be in the future';
        }
    },

    address: {
        required: 'Address is required'
    }


}
