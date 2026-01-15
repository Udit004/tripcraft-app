'use client';

import { useState, useEffect } from 'react';
import { IActivityResponse } from '@/types/activity';
import { ITripResponse } from '@/types/trip';
import { IItineraryDayResponse } from '@/types/itineraryDay';
import { getTrips, getItineraryDays } from '@/services/tripService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Calendar, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { colors } from '@/constants/colors';
import { GradientButton } from '../ui/GradientButton';
import { buttonGradients } from '@/constants/colors';

interface AddToDayModalProps {
  activity: IActivityResponse;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (activityId: string, tripId: string, dayId: string) => Promise<boolean>;
}

export default function AddToDayModal({ activity, isOpen, onClose, onConfirm }: AddToDayModalProps) {
  const [trips, setTrips] = useState<ITripResponse[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<ITripResponse | null>(null);
  const [days, setDays] = useState<IItineraryDayResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTrips();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedTrip) {
      loadDays(selectedTrip._id.toString());
    }
  }, [selectedTrip]);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const data = await getTrips();
      setTrips(data);
    } catch (error) {
      console.error('Error loading trips:', error);
      toast.error('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const loadDays = async (tripId: string) => {
    try {
      setLoading(true);
      const data = await getItineraryDays(tripId);
      setDays(data);
    } catch (error) {
      console.error('Error loading days:', error);
      toast.error('Failed to load itinerary days');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToDay = async (dayId: string) => {
    if (!selectedTrip) return;

    try {
      setIsAdding(true);
      const success = await onConfirm(
        activity._id.toString(),
        selectedTrip._id.toString(),
        dayId
      );
      
      if (success) {
        toast.success('Activity added to itinerary day!');
        onClose();
      }
    } catch (error) {
      console.error('Error adding to day:', error);
      toast.error('Failed to add activity to day');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <CardHeader className="border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl md:text-3xl font-bold" style={{
              background: `linear-gradient(to right, ${buttonGradients.primary.from}, ${buttonGradients.primary.to})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Add to Itinerary Day
            </CardTitle>
            <GradientButton
              variant="delete"
              size="sm"
              onClick={onClose}
              className="h-10"
            >
              <X className="h-4 w-4" />
            </GradientButton>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Select a trip and day to add &ldquo;{activity.title}&rdquo;
          </p>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-1 md:p-2 mx-4">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : !selectedTrip ? (
            // Trip Selection
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Select a Trip
              </h3>
              {trips.length === 0 ? (
                <p className="text-center font-semibold py-8 text-muted-foreground">
                  No trips found. Create a trip first.
                </p>
              ) : (
                <div className="grid gap-2 cursor-pointer">
                  {trips.map((trip) => (
                    <button
                      key={trip._id.toString()}
                      onClick={() => setSelectedTrip(trip)}
                      className="text-left p-4 border-2 rounded-lg hover:border-blue-500 transition-colors"
                      style={{ borderColor: colors.border }}
                    >
                      <div className="flex items-center justify-between cursor-pointer">
                        <div>
                          <h4 className="font-semibold">{trip.tripName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {trip.destination}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Day Selection
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className='cursor-pointer'
                  onClick={() => {
                    setSelectedTrip(null);
                    setDays([]);
                  }}
                >
                  ← Back to Trips
                </Button>
              </div>
              
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Select a Day
              </h3>
              {days.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No itinerary days found for this trip.
                </p>
              ) : (
                <div className="grid gap-2">
                  {days.map((day) => (
                    <button
                      key={day._id?.toString() || Math.random()}
                      onClick={() => handleAddToDay(day._id?.toString() || '')}
                      disabled={isAdding || !day._id}
                      className="text-left p-4 border-2 rounded-lg hover:border-gray-500 transition-colors cursor-pointer disabled:opacity-50"
                      style={{ borderColor: colors.border }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            Day {day.dayNumber}
                            {day.dayName && ` - ${day.dayName}`}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(day.date), 'EEEE, MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
