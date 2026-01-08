"use client"

import React from 'react'

export const ItineraryDaySkeleton: React.FC = () => (
  <div className="flex gap-4 animate-pulse">
    <div className="w-12 h-12 rounded-full bg-[#E5E7EB]" />
    <div className="flex-1 bg-white rounded-xl border border-[#E5E7EB] p-6">
      <div className="h-6 bg-[#E5E7EB] rounded w-1/4 mb-4" />
      <div className="h-4 bg-[#E5E7EB] rounded w-1/3 mb-4" />
      <div className="h-16 bg-[#F8FAFC] rounded" />
    </div>
  </div>
)
