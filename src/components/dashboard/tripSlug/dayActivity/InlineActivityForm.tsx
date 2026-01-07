"use client"

import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'

interface ActivityFormData {
  activityType: string
  title: string
  description?: string
  location?: string
  startTime?: string
  endTime?: string
}

interface InlineActivityFormProps {
  onSubmit: (data: ActivityFormData) => Promise<void>
  onCancel?: () => void
  isOpen: boolean
}

export default function InlineActivityForm({ onSubmit, onCancel, isOpen }: InlineActivityFormProps) {
  const [formData, setFormData] = useState<ActivityFormData>({
    activityType: 'sightseeing',
    title: '',
    description: '',
    location: '',
    startTime: '',
    endTime: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      // Reset form
      setFormData({
        activityType: 'sightseeing',
        title: '',
        description: '',
        location: '',
        startTime: '',
        endTime: '',
      })
    } catch (error) {
      console.error('Error submitting activity:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-200 rounded-lg p-4 mb-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Title */}
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" />
            Add New Activity
          </h4>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Activity Type */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">Activity Type</label>
          <select
            name="activityType"
            value={formData.activityType}
            onChange={handleChange as any}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="sightseeing">🗺️ Sightseeing</option>
            <option value="dining">🍽️ Dining</option>
            <option value="transportation">🚗 Transportation</option>
            <option value="accommodation">🏨 Accommodation</option>
          </select>
        </div>

        {/* Activity Title */}
        <div>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Activity title *"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description (optional)"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          />
        </div>

        {/* Location */}
        <div>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !formData.title.trim()}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-indigo-700 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? 'Adding...' : 'Add Activity'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
