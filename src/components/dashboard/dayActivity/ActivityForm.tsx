"use client"

import React from 'react'
import { ACTIVITY_TYPE_GROUPS, ACTIVITY_TYPE_METADATA } from '@/constants/activityTypes'

interface ActivityFormData {
  activityType: string
  title: string
  description?: string
  location?: string
  startTime?: string
  endTime?: string
}

interface ActivityFormProps {
  formData: ActivityFormData
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onSubmit: (e: React.FormEvent) => void
  error: string | null
  loading: boolean
  buttonText?: string
  headerTitle?: string
  headerSubtitle?: string
  onClose?: () => void
}

export default function ActivityForm({
  formData,
  onInputChange,
  onSubmit,
  error,
  loading,
  buttonText = 'Add Activity',
  headerTitle = 'Add New Activity',
  headerSubtitle = 'Create activity for this day',
  onClose
}: ActivityFormProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-teal-500 px-6 sm:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">{headerTitle}</h1>
        <p className="text-indigo-100">{headerSubtitle}</p>
      </div>

      {/* Form Content */}
      <form onSubmit={onSubmit} className="px-6 sm:px-8 py-8 space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700 font-medium text-sm">{error}</p>
          </div>
        )}

        {/* Activity Type */}
        <div>
          <label htmlFor="activityType" className="block text-sm font-semibold text-gray-900 mb-2">
            Activity Type
          </label>
          <select
            id="activityType"
            name="activityType"
            value={formData.activityType}
            onChange={onInputChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
          >
            {/* Meals & Food */}
            <optgroup label="🍽️ Meals & Food">
              {ACTIVITY_TYPE_GROUPS.meals.types.map((type) => {
                const metadata = ACTIVITY_TYPE_METADATA[type];
                return (
                  <option key={type} value={type}>
                    {metadata.emoji} {metadata.label}
                  </option>
                );
              })}
            </optgroup>

            {/* Rest & Breaks */}
            <optgroup label="☕ Rest & Breaks">
              {ACTIVITY_TYPE_GROUPS.rest.types.map((type) => {
                const metadata = ACTIVITY_TYPE_METADATA[type];
                return (
                  <option key={type} value={type}>
                    {metadata.emoji} {metadata.label}
                  </option>
                );
              })}
            </optgroup>

            {/* Activities */}
            <optgroup label="🎯 Activities">
              {ACTIVITY_TYPE_GROUPS.activities.types.map((type) => {
                const metadata = ACTIVITY_TYPE_METADATA[type];
                return (
                  <option key={type} value={type}>
                    {metadata.emoji} {metadata.label}
                  </option>
                );
              })}
            </optgroup>

            {/* Logistics */}
            <optgroup label="🚀 Logistics">
              {ACTIVITY_TYPE_GROUPS.logistics.types.map((type) => {
                const metadata = ACTIVITY_TYPE_METADATA[type];
                return (
                  <option key={type} value={type}>
                    {metadata.emoji} {metadata.label}
                  </option>
                );
              })}
            </optgroup>

            {/* Other */}
            <optgroup label="📋 Other">
              {ACTIVITY_TYPE_GROUPS.other.types.map((type) => {
                const metadata = ACTIVITY_TYPE_METADATA[type];
                return (
                  <option key={type} value={type}>
                    {metadata.emoji} {metadata.label}
                  </option>
                );
              })}
            </optgroup>
          </select>
        </div>

        {/* Activity Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
            Activity Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            placeholder="e.g., Visit Eiffel Tower"
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onInputChange}
            placeholder="Describe the activity in detail..."
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-gray-900 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={onInputChange}
            placeholder="e.g., Champ de Mars, Paris"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startTime" className="block text-sm font-semibold text-gray-900 mb-2">
              Start Time
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={onInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-sm font-semibold text-gray-900 mb-2">
              End Time
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={onInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <span className="font-semibold">Tip:</span> You can edit activity details anytime after creating it.
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !formData.title.trim()}
            className="w-full bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-bold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {buttonText === 'Add Activity' ? 'Adding...' : 'Updating...'}
              </span>
            ) : (
              buttonText
            )}
          </button>
        </div>

        {/* Cancel Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  )
}
