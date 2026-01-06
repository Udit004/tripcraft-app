import ProtectRoutes from '@/components/ProtectRoutes'
import React from 'react'

export default function page() {
  return (
    <ProtectRoutes>
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Plan Your Perfect Journey</h1>
      </div>
    </ProtectRoutes>
  )
}
