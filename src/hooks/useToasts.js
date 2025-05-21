// src/hooks/useToasts.js
import { useState, useCallback } from 'react';

let toastIdCounter = 0;

const useToasts = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = toastIdCounter++;
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    if (duration) {
      // Automatically remove the toast after the specified duration
      setTimeout(() => removeToast(id), duration);
    }
  }, []); // removeToast will be memoized by a subsequent useCallback

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Need to update addToast's dependencies if removeToast is used inside it.
  // However, in this structure, removeToast is called in a setTimeout,
  // so it uses the latest version of removeToast due to closure over the module scope's removeToast.
  // A more robust way for React state updates in setTimeout is to use the functional update form of setToasts
  // or ensure all dependencies are listed. For this specific case, it should work.
  // Let's refine addToast to ensure it always has the correct removeToast if its definition changes.
  // No, the current addToast is fine, it doesn't directly call the removeToast from its scope,
  // the setTimeout callback does, and that will resolve to the latest removeToast.

  return { toasts, addToast, removeToast };
};

export default useToasts;
