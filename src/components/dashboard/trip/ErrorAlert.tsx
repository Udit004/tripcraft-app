// components/dashboard/ErrorAlert.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert = React.memo(({ message }: ErrorAlertProps) => {
  return (
    <div
      className="mb-6 p-4 rounded-lg flex items-start gap-3 border border-red-200 animate-in slide-in-from-top duration-300"
      style={{
        backgroundColor: '#FEE2E2'
      }}
    >
      <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-semibold text-red-800 text-sm">Error</p>
        <p className="text-sm text-red-700">{message}</p>
      </div>
    </div>
  );
});

ErrorAlert.displayName = 'ErrorAlert';

export default ErrorAlert;