export const mapFirestoreError = (error) => {
    console.error('Firestore Transaction Failed:', error);

    switch (error.code) {
        case 'permission-denied':
            return 'You do not have the required permissions to register participants.Please ensure you are logged in as a Responsible Person.';

        case 'unavailable':
            return 'Network error. Please check your internet connection and try again.';

        case 'resource-exhausted':
            return 'The registration server is currently too busy. Please wait a moment and try again.';

        default:
            if (error.message && error.message.includes('isOpen flag')) {
                return 'Registration is currently closed for this event.'
            }

            return "unexpected error occurred while saving the registration. Please review the details and try again."

    }
}