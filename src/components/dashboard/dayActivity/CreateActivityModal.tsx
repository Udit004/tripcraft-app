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

interface CreateActivityModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ActivityFormData) => Promise<void>
}

export default function CreateActivityModal({ isOpen, onClose, onSubmit }: CreateActivityModalProps) {
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit(formData)
      // Reset form after successful submission
      setFormData({
        activityType: 'sightseeing',
        title: '',
        description: '',
        location: '',
        startTime: '',
        endTime: '',
      })
      onClose()
    } catch (err) {
      console.error('Failed to create activity:', err)
      setError('Failed to create activity. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      activityType: 'sightseeing',
      title: '',
      description: '',
      location: '',
      startTime: '',
      endTime: '',
    })
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <ActivityForm
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          error={error}
          loading={isSubmitting}
          buttonText="Add Activity"
          headerTitle="Add New Activity"
          headerSubtitle="Fill in the details for your activity"
          onClose={handleClose}
        />
      </div>
    </div>
  )
}
