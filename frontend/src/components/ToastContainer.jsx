import React from 'react';
import { useToast } from '../hooks/useToast';
import { X, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-start gap-3 p-4 rounded-xl border shadow-lg bg-white dark:bg-gray-800 animate-in slide-in-from-right-5 fade-in duration-300",
            toast.type === 'success' ? 'border-green-200 dark:border-green-900' :
            toast.type === 'error' ? 'border-red-200 dark:border-red-900' :
            'border-blue-200 dark:border-blue-900'
          )}
        >
          <div className="mt-0.5 shrink-0">
            {icons[toast.type] || icons.info}
          </div>
          <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-100">
            {toast.message}
          </p>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
