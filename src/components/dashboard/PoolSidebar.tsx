'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { colors } from '@/constants/colors';
import { useActivityPool } from '@/components/pool/hooks/useActivityPool';
import DraggablePoolActivityCard from '@/components/pool/DraggablePoolActivityCard';
import AddToDayModal from '@/components/pool/AddToDayModal';
import { IActivityResponse } from '@/types/activity';
import { Button } from '@/components/ui/button';
import { GradientButton } from '../ui/GradientButton';

interface PoolSidebarProps {
  tripId: string;
  onActivityMoved?: () => void;
}

export default function PoolSidebar({ tripId, onActivityMoved }: PoolSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<IActivityResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { activities, loading, error, removeFromPool, moveToDay, refreshPool } = useActivityPool();

  // Detect mobile/touch devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleRemove = async (activityId: string) => {
    const success = await removeFromPool(activityId);
    return success;
  };

  const handleAddToDay = (activity: IActivityResponse) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (activityId: string, tripIdParam: string, dayId: string): Promise<boolean> => {
    const success = await moveToDay(activityId, tripIdParam, dayId);
    if (success) {
      setIsModalOpen(false);
      setSelectedActivity(null);
      onActivityMoved?.();
    }
    return success;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-gradient-to-br from-[#1E3A8A] to-[#0EA5A4] text-white p-3 rounded-l-lg shadow-lg hover:shadow-xl transition-all z-40 cursor-pointer"
        aria-label="Open activity pool"
      >
        <Package className="h-5 w-5" />
        {activities.length > 0 && (
          <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {activities.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 right-0 h-screen
          w-full sm:w-80 lg:w-96
          bg-white border-l shadow-2xl lg:shadow-none
          transition-transform duration-300 ease-in-out
          z-50 lg:z-auto
          flex flex-col
          ${isMobile && !isOpen ? 'translate-x-full' : 'translate-x-0'}
        `}
        style={{ borderColor: colors.border }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0" style={{ borderColor: colors.border }}>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" style={{ color: colors.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: colors.textMain }}>
              Activity Pool
            </h2>
            {activities.length > 0 && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {activities.length}
              </span>
            )}
          </div>
          <GradientButton
            variant='delete'
            size='sm'
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close sidebar"
            title="Close activity pool"
          >
            <X className="h-5 w-5" style={{ color: colors.textMuted }} />
          </GradientButton>
        </div>

        {/* Info Banner for Desktop */}
        {!isMobile && (
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-200 flex-shrink-0">
            <p className="text-xs text-blue-800">
              <strong>💡 Tip:</strong> Drag activities onto day cards to add them to your itinerary
            </p>
          </div>
        )}

        {/* Info Banner for Mobile */}
        {isMobile && (
          <div className="px-4 py-3 bg-amber-50 border-b border-amber-200 flex-shrink-0">
            <p className="text-xs text-amber-800">
              <strong>📱 Mobile:</strong> Tap "Add to Day" button on activities to add them
            </p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-40 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-red-600 mb-2">Failed to load activities</p>
              <Button onClick={refreshPool} size="sm">
                Try Again
              </Button>
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 mb-3" style={{ color: colors.textMuted }} />
              <h3 className="font-semibold mb-1" style={{ color: colors.textMain }}>
                No activities saved
              </h3>
              <p className="text-sm mb-4" style={{ color: colors.textMuted }}>
                Explore and save activities to add them to your trips
              </p>
              <a
                href="/explore"
                className="px-4 py-2 bg-gradient-to-br from-[#1E3A8A] to-[#0EA5A4] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-shadow"
              >
                Explore Activities
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <DraggablePoolActivityCard
                  key={activity._id.toString()}
                  activity={activity}
                  onRemove={handleRemove}
                  onAddToDay={handleAddToDay}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer - Activity Count */}
        {activities.length > 0 && (
          <div className="p-4 border-t bg-gray-50 flex-shrink-0" style={{ borderColor: colors.border }}>
            <p className="text-xs text-center" style={{ color: colors.textMuted }}>
              {activities.length} {activities.length === 1 ? 'activity' : 'activities'} ready to add
            </p>
          </div>
        )}
      </aside>

      {/* Modal for adding to day (fallback for button clicks) */}
      {selectedActivity && (
        <AddToDayModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedActivity(null);
          }}
          activity={selectedActivity}
          onConfirm={handleModalSubmit}
        />
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
