"use client"

import React, { useState } from 'react'
import ActivityForm from './ActivityForm'

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
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    setIsSubmitting(true)
    setError(null)
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
    } catch (err) {
      console.error('Error submitting activity:', err)
      setError(err instanceof Error ? err.message : 'Failed to add activity')
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="mb-6">
      <ActivityForm
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        error={error}
        loading={isSubmitting}
        buttonText="Add Activity"
        headerTitle="Add New Activity"
        headerSubtitle="Create activity for this day"
        onClose={onCancel}
      />
    </div>
  )
}
