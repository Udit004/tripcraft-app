'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IActivityResponse } from '@/types/activity';

interface DragState {
  draggedActivity: IActivityResponse | null;
  dragSource: 'pool' | 'day' | null;
  dragOverDayId: string | null;
  isDragging: boolean;
}

interface DragContextValue extends DragState {
  setDraggedActivity: (activity: IActivityResponse | null, source: 'pool' | 'day' | null) => void;
  setDragOverDayId: (dayId: string | null) => void;
  clearDragState: () => void;
}

const DragContext = createContext<DragContextValue | undefined>(undefined);

export const DragProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dragState, setDragState] = useState<DragState>({
    draggedActivity: null,
    dragSource: null,
    dragOverDayId: null,
    isDragging: false,
  });

  const setDraggedActivity = (activity: IActivityResponse | null, source: 'pool' | 'day' | null) => {
    setDragState((prev) => ({
      ...prev,
      draggedActivity: activity,
      dragSource: source,
      isDragging: activity !== null,
    }));
  };

  const setDragOverDayId = (dayId: string | null) => {
    setDragState((prev) => ({
      ...prev,
      dragOverDayId: dayId,
    }));
  };

  const clearDragState = () => {
    setDragState({
      draggedActivity: null,
      dragSource: null,
      dragOverDayId: null,
      isDragging: false,
    });
  };

  return (
    <DragContext.Provider
      value={{
        ...dragState,
        setDraggedActivity,
        setDragOverDayId,
        clearDragState,
      }}
    >
      {children}
    </DragContext.Provider>
  );
};

export const useDrag = () => {
  const context = useContext(DragContext);
  if (context === undefined) {
    throw new Error('useDrag must be used within a DragProvider');
  }
  return context;
};
