import { useState, useCallback, useEffect } from 'react';

// Estado global para os toasts, permitindo que qualquer componente chame o hook e veja a mesma lista
let memoryState = [];
let listeners = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener(memoryState));
};

export const useToast = () => {
  const [toasts, setToasts] = useState(memoryState);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter(l => l !== setToasts);
    };
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    const newToast = { id, message, type, duration };
    memoryState = [...memoryState, newToast];
    notifyListeners();

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    memoryState = memoryState.filter(t => t.id !== id);
    notifyListeners();
  }, []);

  return { toasts, showToast, removeToast };
};
