"use client"

import React from 'react'
import { AlertCircle } from 'lucide-react'

interface ItineraryErrorStateProps {
  message: string
  onRetry: () => void
}

export const ItineraryErrorState: React.FC<ItineraryErrorStateProps> = ({
  message,
  onRetry
}) => (
  <div className="bg-white rounded-xl border border-[#FCA5A5] p-8 text-center">
    <div className="flex justify-center mb-4">
      <div className="w-16 h-16 rounded-full bg-[#FEE2E2] flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-[#DC2626]" />
      </div>
    </div>
    <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Unable to Load Itinerary</h3>
    <p className="text-[#475569] mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1e3a8ae6] transition-colors"
    >
      Try Again
    </button>
  </div>
)
