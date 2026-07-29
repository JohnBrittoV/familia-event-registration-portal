import React, { createContext, useContext, useState, useCallback, Children } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Global Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex 
                      flex-col gap-3">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`flex items-center gap-3 px-4 py-3 
                        rounded-xl shadow-lg border animate-in 
                        slide-in-from-right-8 fade-in duration-300 ${
              toast.type === 'success' 
                ? 'bg-white dark:bg-slate-800 border-green-200 dark:border-green-900/30' 
                : 'bg-white dark:bg-slate-800 border-red-200 dark:border-red-900/30'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <p className="text-sm font-semibold 
                          text-slate-800 dark:text-slate-200">
              {toast.message}
            </p>
            <button 
              onClick={() => removeToast(toast.id)} 
              className="ml-4 text-slate-400 hover:text-slate-600 
                         dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );

}