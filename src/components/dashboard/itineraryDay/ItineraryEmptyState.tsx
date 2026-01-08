"use client"

import React from 'react'
import { Calendar } from 'lucide-react'

interface ItineraryEmptyStateProps {
  onAddDay?: () => void
}

export const ItineraryEmptyState: React.FC<ItineraryEmptyStateProps> = ({
  onAddDay
}) => (
  <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
    <div className="flex justify-center mb-4">
      <div className="w-20 h-20 rounded-full bg-[#F8FAFC] flex items-center justify-center">
        <Calendar className="w-10 h-10 text-[#0EA5A4]" />
      </div>
    </div>
    <h3 className="text-xl font-semibold text-[#0F172A] mb-2">No Itinerary Yet</h3>
    <p className="text-[#475569] max-w-md mx-auto mb-6">
      Your trip itinerary is empty. Start planning your adventure by adding days and activities.
    </p>
    <button
      onClick={onAddDay}
      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
    >
      <Calendar className="w-5 h-5" />
      Add First Day
    </button>
  </div>
)
