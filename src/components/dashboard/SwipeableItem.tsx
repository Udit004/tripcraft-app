'use client';

import { useEffect, useRef, useState } from 'react';
import { Pencil, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SwipeableItemProps {
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

const SWIPE_THRESHOLD = 60;
const ACTION_BUTTON_WIDTH = 140;

export default function SwipeableItem({
  children,
  onEdit,
  onDelete,
  disabled = false,
}: SwipeableItemProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showDesktopMenu, setShowDesktopMenu] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const isTouchRef = useRef(false);

  // Check if device supports touch
  const isTouchDevice = typeof window !== 'undefined' && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  // Handle start (touch or mouse)
  const handleStart = (clientX: number, isTouch: boolean) => {
    if (disabled) return;
    
    isTouchRef.current = isTouch;
    startXRef.current = clientX;
    currentXRef.current = translateX;
    setIsDragging(true);
  };

  // Handle move (touch or mouse)
  const handleMove = (clientX: number) => {
    if (!isDragging || disabled) return;

    const deltaX = clientX - startXRef.current;
    const newTranslateX = currentXRef.current + deltaX;

    // Only allow swiping left (negative values)
    if (newTranslateX <= 0 && newTranslateX >= -ACTION_BUTTON_WIDTH) {
      setTranslateX(newTranslateX);
    }
  };

  // Handle end (touch or mouse)
  const handleEnd = () => {
    if (!isDragging || disabled) return;

    setIsDragging(false);

    // Snap logic
    if (translateX <= -SWIPE_THRESHOLD) {
      // Snap open
      setTranslateX(-ACTION_BUTTON_WIDTH);
      setIsOpen(true);
    } else {
      // Snap closed
      setTranslateX(0);
      setIsOpen(false);
    }
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX, true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Mouse event handlers (for desktop touch simulation and mobile screen mode)
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setTranslateX(0);
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Mouse move/up listeners for swipe on all devices
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Action handlers
  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
      setTranslateX(0);
      setIsOpen(false);
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete();
      setTranslateX(0);
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ 
        userSelect: isDragging ? 'none' : 'auto',
        WebkitUserSelect: isDragging ? 'none' : 'auto',
      }}
    >
      {/* Swipeable content */}
      <div
        className={`relative z-10 bg-white ${
          isDragging ? '' : 'transition-transform duration-300 ease-out'
        }`}
        style={{
          transform: `translateX(${translateX}px)`,
          cursor: disabled ? 'default' : isDragging ? 'grabbing' : 'grab',
          touchAction: 'pan-y', // Allow vertical scrolling but capture horizontal swipes
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {children}
      </div>

      {/* Action buttons (revealed on swipe) - only on touch devices */}
      {isTouchDevice && (
        <div
          className="absolute top-0 right-0 bottom-0 flex items-center gap-2 pr-4"
          style={{ width: `${ACTION_BUTTON_WIDTH}px` }}
        >
          {onEdit && (
            <button
              onClick={handleEditClick}
              disabled={disabled}
              className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed shadow-md"
              aria-label="Edit"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              disabled={disabled}
              className="flex items-center justify-center w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed shadow-md"
              aria-label="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Desktop fallback - action menu button (always show on desktop) */}
      {!isTouchDevice && (onEdit || onDelete) && (
        <div className="absolute top-2 right-2 z-20">
          <div className="relative">
            <button
              onClick={() => setShowDesktopMenu(!showDesktopMenu)}
              disabled={disabled}
              className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Actions"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {showDesktopMenu && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setShowDesktopMenu(false)}
                />
                <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px] z-30">
                  {onEdit && (
                    <button
                      onClick={() => {
                        handleEditClick();
                        setShowDesktopMenu(false);
                      }}
                      disabled={disabled}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        handleDeleteClick();
                        setShowDesktopMenu(false);
                      }}
                      disabled={disabled}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
