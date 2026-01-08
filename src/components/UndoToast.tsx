"use client"

import { useState, useEffect } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { undoDeletion } from '@/services/tripService';
import { toast } from '@/lib/toast';

interface UndoToastProps {
  message: string;
  deletionLogId: string;
  onUndo?: () => void;
  onExpire?: () => void;
  undoWindowSeconds?: number;
}

export default function UndoToast({
  message,
  deletionLogId,
  onUndo,
  onExpire,
  undoWindowSeconds = 10,
}: UndoToastProps) {
  const [timeLeft, setTimeLeft] = useState(undoWindowSeconds);
  const [isUndoing, setIsUndoing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isDismissed, onExpire]);

  const handleUndo = async () => {
    if (isUndoing || timeLeft === 0) return;
    
    setIsUndoing(true);
    try {
      const success = await undoDeletion(deletionLogId);
      
      if (success) {
        toast.success('Item restored successfully!');
        setIsDismissed(true);
        onUndo?.();
      } else {
        toast.error('Failed to restore item');
      }
    } catch (error) {
      toast.error('Failed to restore item');
      console.error('Undo error:', error);
    } finally {
      setIsUndoing(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <div className="flex items-center justify-between gap-4 bg-white rounded-lg shadow-xl p-4 border-l-4 border-amber-500 min-w-96 animate-in slide-in-from-bottom-5">
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">{message}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / undoWindowSeconds) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600 tabular-nums min-w-[3ch]">
            {timeLeft}s
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleUndo}
          disabled={isUndoing || timeLeft === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          {isUndoing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Undoing...
            </>
          ) : (
            <>
              <RotateCcw className="w-4 h-4" />
              Undo
            </>
          )}
        </button>
        <button
          onClick={handleDismiss}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
