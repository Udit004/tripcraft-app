"use client"

import React, { useState, useEffect } from 'react'
import ActivityForm from './ActivityForm'
import { extractTimeFromISO } from '@/lib/utils'

interface Activity {
  _id: string
  activityType: string
  title: string
  description?: string
  location?: string
  startTime?: string
  endTime?: string
}

interface ActivityFormData {
  activityType: string
  title: string
  description?: string
  location?: string
  startTime?: string
  endTime?: string
}

interface EditActivityModalProps {
  isOpen: boolean
  activity: Activity | null
  onClose: () => void
  onSubmit: (id: string, data: ActivityFormData) => Promise<void>
}

export default function EditActivityModal({ isOpen, activity, onClose, onSubmit }: EditActivityModalProps) {
  const [formData, setFormData] = useState<ActivityFormData>({
    activityType: 'sightseeing',
    title: '',
    description: '',
    location: '',
    startTime: '',
    endTime: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pre-populate form when activity changes
  useEffect(() => {
    if (activity) {
      setFormData({
        activityType: activity.activityType || 'sightseeing',
        title: activity.title || '',
        description: activity.description || '',
        location: activity.location || '',
        startTime: activity.startTime ? extractTimeFromISO(activity.startTime) : '',
        endTime: activity.endTime ? extractTimeFromISO(activity.endTime) : '',
      })
      setError(null)
    }
  }, [activity, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !activity) return

    setIsSubmitting(true)
    setError(null)
    try {
      await onSubmit(activity._id, formData)
      onClose()
    } catch (err) {
      console.error('Error updating activity:', err)
      setError(err instanceof Error ? err.message : 'Failed to update activity')
      setIsSubmitting(false)
    }
  }

  if (!isOpen || !activity) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center pt-20 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <ActivityForm
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          error={error}
          loading={isSubmitting}
          buttonText="Update Activity"
          headerTitle="Edit Activity"
          headerSubtitle="Update activity details"
          onClose={onClose}
        />
      </div>
    </div>
  )
}
