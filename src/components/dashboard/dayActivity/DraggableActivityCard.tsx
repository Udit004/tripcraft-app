"use client"

import React, { useState } from 'react'
import { IActivity } from '@/types/activity'
import { GripVertical, Clock, MapPin, Trash2, Edit2 } from 'lucide-react'
import { formatTime } from '@/lib/utils'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog'
import EditActivityModal from './EditActivityModal'
import { getActivityTypeMetadata } from '@/constants/activityTypes'

interface ActivityFormData {
  activityType: string
  title: string
  description?: string
  location?: string
  startTime?: string
  endTime?: string
}

interface DraggableActivityCardProps {
  activity: IActivity
  index: number
  onEdit?: (activity: IActivity) => void
  onUpdate?: (id: string, data: ActivityFormData) => Promise<void>
  onDelete?: (activityId: string) => void | Promise<void>
  isDragging?: boolean
}

export default function DraggableActivityCard({ 
  activity, 
  index, 
  onEdit, 
  onUpdate,
  onDelete,
  isDragging 
}: DraggableActivityCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleEditClick = () => {
    setShowEditModal(true)
    onEdit?.(activity)
  }

  const handleConfirmDelete = async () => {
    if (!onDelete || !activity._id) return

    try {
      setIsDeleting(true)
      await onDelete(activity._id.toString())
      setShowDeleteConfirm(false)
    } catch (error) {
      console.error('Error deleting activity:', error)
      setIsDeleting(false)
    }
  }

  // Get activity type metadata
  const activityTypeMetadata = getActivityTypeMetadata(activity.activityType)
  
  return (
    <div 
      className={`bg-white border-2 border-gray-200 rounded-lg p-4 transition-all duration-200 ${
        isDragging ? 'shadow-2xl rotate-2 opacity-50' : 'shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div className="cursor-grab active:cursor-grabbing pt-1">
          <GripVertical className="w-5 h-5 text-gray-400 hover:text-gray-600" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </span>
              <h4 className="font-semibold text-gray-900 truncate">
                {activity.title}
              </h4>
              {/* Activity Type Badge */}
              {activityTypeMetadata && (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${activityTypeMetadata.colorClass}`}>
                  <span>{activityTypeMetadata.emoji}</span>
                  <span>{activityTypeMetadata.label}</span>
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {activity.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {activity.description}
            </p>
          )}

          {/* Details */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-500">
            {activity.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{activity.location}</span>
              </div>
            )}
            {activity.startTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  {formatTime(activity.startTime.toString())}
                  {activity.endTime && ` - ${formatTime(activity.endTime.toString())}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1">
          {onUpdate && (
            <button
              onClick={handleEditClick}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="Edit activity"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && activity._id && (
            <button
              onClick={handleDeleteClick}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete activity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        isLoading={isDeleting}
        title="Delete Activity"
        message="Are you sure you want to delete this activity?"
        itemName={activity.title}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Delete Activity"
        cancelText="Keep It"
      />

      {/* Edit Activity Modal */}
      <EditActivityModal
        isOpen={showEditModal}
        activity={activity as any}
        onClose={() => setShowEditModal(false)}
        onSubmit={onUpdate || (async () => {})}
      />
    </div>
  )
}
