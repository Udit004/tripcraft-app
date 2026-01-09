"use client"

import React, { useState, useEffect } from 'react'
import { ICreateTripRequest } from '@/types/trip'
import { useRouter } from 'next/navigation'
import TripForm from './TripForm'

interface EditTripModalProps {
    tripId: string
    initialTripData: ICreateTripRequest
    onUpdateTrip?: (tripId: string, tripData: ICreateTripRequest) => Promise<any>
    onClose?: () => void
    onSuccess?: () => void
}

export default function EditTripModal({
    tripId,
    initialTripData,
    onUpdateTrip,
    onClose,
    onSuccess
}: EditTripModalProps) {
    const router = useRouter();
    const [tripDetails, setTripDetails] = useState<ICreateTripRequest>(initialTripData)
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setTripDetails(initialTripData);
    }, [initialTripData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTripDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTripDetails(prevDetails => ({
            ...prevDetails,
            [name]: new Date(value),
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const updatedTrip = await onUpdateTrip?.(tripId, tripDetails);
            onSuccess?.();
            router.refresh();
            console.log('Trip updated successfully:', updatedTrip);
        } catch (err) {
            const errorMsg = 'Failed to update trip. Please try again.';
            setError(errorMsg);
            console.error(err);
        } finally {
            setLoading(false);
        }   
    }

    return (
        <TripForm
            tripDetails={tripDetails}
            onInputChange={handleInputChange}
            onDateChange={handleDateChange}
            onSubmit={handleSubmit}
            error={error}
            loading={loading}
            buttonText="Update Trip"
            headerTitle="Edit Trip Details"
            headerSubtitle="Modify your trip information"
            onClose={onClose}
        />
    )
}
