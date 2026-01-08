"use client"

import { useState } from 'react'
import { IItineraryDayResponse } from '@/types/itineraryDay'

interface UseItineraryModalsReturn {
  openModal: boolean
  editingDay: IItineraryDayResponse | null
  editingTrip: boolean
  setOpenModal: (open: boolean) => void
  setEditingDay: (day: IItineraryDayResponse | null) => void
  setEditingTrip: (open: boolean) => void
}

export const useItineraryModals = (): UseItineraryModalsReturn => {
  const [openModal, setOpenModal] = useState(false)
  const [editingDay, setEditingDay] = useState<IItineraryDayResponse | null>(null)
  const [editingTrip, setEditingTrip] = useState(false)

  return {
    openModal,
    editingDay,
    editingTrip,
    setOpenModal,
    setEditingDay,
    setEditingTrip
  }
}
