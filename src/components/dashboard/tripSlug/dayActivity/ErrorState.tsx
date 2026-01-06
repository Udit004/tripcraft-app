// components/itinerary/ErrorState.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Alert variant="destructive" className="border-red-300">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="mt-2">
          {message}
        </AlertDescription>
      </Alert>
      
      {onRetry && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={onRetry}
            className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};