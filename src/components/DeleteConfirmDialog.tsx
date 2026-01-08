'use client';

import React from 'react';
import { Trash2, AlertCircle } from 'lucide-react';

interface DeleteConfirmDialogProps {
  title: string;
  message: string;
  itemName?: string;
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function DeleteConfirmDialog({
  title,
  message,
  itemName,
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error during delete confirmation:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
        {/* Icon and Header */}
        <div className="flex flex-col items-center pt-8 px-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center">{title}</h2>
        </div>

        {/* Message */}
        <div className="px-6 py-4 text-center">
          <p className="text-gray-600 mb-2">{message}</p>
          {itemName && (
            <p className="text-sm font-semibold text-gray-900 bg-gray-100 rounded-lg py-2 px-3 inline-block">
              {itemName}
            </p>
          )}
        </div>

        {/* Warning Text */}
        <div className="px-6 py-3">
          <div className="flex items-start gap-2 bg-red-50 rounded-lg p-3 border border-red-200">
            <Trash2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">This action cannot be undone.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 px-6 pb-6 pt-4 border-t border-gray-200">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
