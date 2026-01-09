"use client"

import React, { useState, useEffect } from 'react'
import { IActivity } from '@/types/activity'
import DraggableActivityCard from './DraggableActivityCard'
import CreateActivityModal from './CreateActivityModal'
import { Plus, Calendar, AlertTriangle } from 'lucide-react'
import { hasOrderTimeMismatch } from '@/utility/activityTimeOrder'
import { GradientButton } from '@/components/ui/GradientButton'

interface ActivityListWithDnDProps {
  tripId: string
  dayId: string
  initialActivities?: IActivity[]
  onActivityAdd?: (data: any) => Promise<void>
  onActivityEdit?: (activity: IActivity) => void
  onActivityUpdate?: (id: string, data: any) => Promise<void>
  onActivityDelete?: (activityId: string) => Promise<void>
  onReorder?: (activities: IActivity[]) => Promise<void>
}

export default function ActivityListWithDnD({
  tripId,
  dayId,
  initialActivities = [],
  onActivityAdd,
  onActivityEdit,
  onActivityUpdate,
  onActivityDelete,
  onReorder,
}: ActivityListWithDnDProps) {
  const [activities, setActivities] = useState<IActivity[]>(initialActivities)
  const [showModal, setShowModal] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [hasWarning, setHasWarning] = useState(false)

  useEffect(() => {
    setActivities(initialActivities)
  }, [initialActivities])

  // Recalculate warning whenever activities change
  useEffect(() => {
    setHasWarning(hasOrderTimeMismatch(activities))
  }, [activities])

  const handleAddActivity = async (data: any) => {
    if (onActivityAdd) {
      await onActivityAdd(data)
      setShowModal(false)
    }
  }

  const handleDeleteActivity = async (activityId: string) => {
    if (onActivityDelete) {
      await onActivityDelete(activityId)
    }
  }

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newActivities = [...activities]
    const [draggedActivity] = newActivities.splice(draggedIndex, 1)
    newActivities.splice(dropIndex, 0, draggedActivity)

    setActivities(newActivities)
    setDraggedIndex(null)
    setDragOverIndex(null)

    // Call reorder callback
    if (onReorder) {
      await onReorder(newActivities)
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Activities ({activities.length})
        </h3>
        <GradientButton
          variant="primary"
          size="md"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-4 h-4" />
          Add Activity
        </GradientButton>
      </div>

    

      {/* Time-Order Mismatch Warning */}
      {hasWarning && activities.length > 1 && (
        <div className="mb-4 flex items-center gap-3 rounded-md border border-yellow-400 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 shadow-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>
            <span className="font-semibold">Time sequence mismatch:</span> Activity order doesn&apos;t match the scheduled time sequence. Review timings to avoid confusion.
          </span>
        </div>
      )}

      {/* Activities List */}
      {activities.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No Activities Yet</h4>
          <p className="text-gray-600 mb-4">Start planning your day by adding activities</p>
          <GradientButton
            variant="primary"
            size="md"
            onClick={() => setShowModal(true)}
          >
            Add Your First Activity
          </GradientButton>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div
              key={activity._id?.toString() || index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, index)}
              className={`transition-all duration-200 ${
                dragOverIndex === index && draggedIndex !== index
                  ? 'border-t-4 border-indigo-500 pt-3'
                  : ''
              }`}
            >
              <DraggableActivityCard
                activity={activity}
                index={index}
                onEdit={onActivityEdit}
                onUpdate={onActivityUpdate}
                onDelete={handleDeleteActivity}
                isDragging={draggedIndex === index}
              />
            </div>
          ))}
        </div>
      )}

      {/* Drag Instructions */}
      {activities.length > 1 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <span className="font-semibold">Tip:</span> Drag and drop activities to change their order
          </p>
        </div>
      )}

      {/* Activity Modal */}
      <CreateActivityModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddActivity}
      />
    </div>
  )
}
