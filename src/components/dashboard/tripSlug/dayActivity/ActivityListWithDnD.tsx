"use client"

import React, { useState, useEffect } from 'react'
import { IActivity } from '@/types/activity'
import DraggableActivityCard from './DraggableActivityCard'
import InlineActivityForm from './InlineActivityForm'
import { Plus, Calendar } from 'lucide-react'

interface ActivityListWithDnDProps {
  tripId: string
  dayId: string
  initialActivities?: IActivity[]
  onActivityAdd?: (data: any) => Promise<void>
  onActivityEdit?: (activity: IActivity) => void
  onActivityDelete?: (activityId: string) => Promise<void>
  onReorder?: (activities: IActivity[]) => Promise<void>
}

export default function ActivityListWithDnD({
  tripId,
  dayId,
  initialActivities = [],
  onActivityAdd,
  onActivityEdit,
  onActivityDelete,
  onReorder,
}: ActivityListWithDnDProps) {
  const [activities, setActivities] = useState<IActivity[]>(initialActivities)
  const [showForm, setShowForm] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  useEffect(() => {
    setActivities(initialActivities)
  }, [initialActivities])

  const handleAddActivity = async (data: any) => {
    if (onActivityAdd) {
      await onActivityAdd(data)
      setShowForm(false)
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
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Activity
          </button>
        )}
      </div>

      {/* Inline Form */}
      <InlineActivityForm
        isOpen={showForm}
        onSubmit={handleAddActivity}
        onCancel={() => setShowForm(false)}
      />

      {/* Activities List */}
      {activities.length === 0 && !showForm ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No Activities Yet</h4>
          <p className="text-gray-600 mb-4">Start planning your day by adding activities</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Add Your First Activity
          </button>
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
    </div>
  )
}
