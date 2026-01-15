'use client';

import { useState } from 'react';
import { useActivityPool } from '@/components/pool/hooks/useActivityPool';
import DraggablePoolActivityCard from '@/components/pool/DraggablePoolActivityCard';
import AddToDayModal from '@/components/pool/AddToDayModal';
import { IActivityResponse } from '@/types/activity';
import { Heart, Loader2 } from 'lucide-react';
import ProtectRoutes from '@/components/ProtectRoutes';
import { buttonGradients } from '@/constants/colors';
import { DragProvider } from '@/context/DragContext';

export default function ActivityPoolPage() {
    const { activities, loading, error, removeFromPool, moveToDay, refreshPool } = useActivityPool();
    const [selectedActivity, setSelectedActivity] = useState<IActivityResponse | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddToDay = (activity: IActivityResponse) => {
        setSelectedActivity(activity);
        setIsModalOpen(true);
    };

    const handleConfirmAddToDay = async (
        activityId: string,
        tripId: string,
        dayId: string
    ): Promise<boolean> => {
        try {
            const success = await moveToDay(activityId, tripId, dayId);
            if (success) {
                refreshPool();
            }
            return success;
        } catch (error) {
            return false;
        }
    };

    return (
        <ProtectRoutes>
            <DragProvider>
                <div className="min-h-screen bg-white py-8 px-4">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <header className="text-start mb-12 ">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{
                                background: `linear-gradient(to right, ${buttonGradients.primary.from}, ${buttonGradients.primary.to})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>
                                Activity Pool
                            </h1>
                            <p className="text-lg max-w-2xl" style={{ color: '#6B7280' }}>
                                Your saved activities ready to be added to trips
                            </p>
                            {activities.length > 0 && (
                                <div className="mt-4 text-sm" style={{ color: '#6B7280' }}>
                                    {activities.length} {activities.length === 1 ? 'activity' : 'activities'} saved
                                </div>
                            )}
                        </header>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-center justify-center py-20">
                                <div className="text-center">
                                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                                    <p className="text-gray-600">Loading your saved activities...</p>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !loading && (
                            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">⚠️</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Oops! Something went wrong
                                </h3>
                                <p className="text-gray-600 mb-4">{error}</p>
                                <button
                                    onClick={refreshPool}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && !error && activities.length === 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Heart className="h-10 w-10 text-purple-600" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                                    Your Activity Pool is Empty
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Start exploring destinations and add activities to your pool.
                                    You can then easily add them to your trip itineraries later!
                                </p>
                                <a
                                    href="/explore"
                                    className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                                >
                                    Explore Activities
                                </a>
                            </div>
                        )}

                        {/* Activities Grid */}
                        {!loading && !error && activities.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activities.map((activity) => (
                                    <DraggablePoolActivityCard
                                        key={activity._id.toString()}
                                        activity={activity}
                                        onRemove={removeFromPool}
                                        onAddToDay={handleAddToDay}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Add to Day Modal */}
                    {selectedActivity && (
                        <AddToDayModal
                            activity={selectedActivity}
                            isOpen={isModalOpen}
                            onClose={() => {
                                setIsModalOpen(false);
                                setSelectedActivity(null);
                            }}
                            onConfirm={handleConfirmAddToDay}
                        />
                    )}
                </div>
            </DragProvider>
        </ProtectRoutes>
    );
}
