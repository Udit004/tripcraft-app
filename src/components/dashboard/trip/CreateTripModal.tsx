"use client"

import React, { useState } from 'react'
import { ICreateTripRequest } from '@/types/trip'
import { createTrip } from '@/services'
import { useRouter } from 'next/navigation'
import TripForm from './TripForm'
import { toast } from '@/lib/toast'

export default function CreateTripModal() {
    const router = useRouter();
    const [tripDetails, setTripDetails] = useState<ICreateTripRequest>({
        tripName: '',
        tripDescription: '',
        destination: '',
        startDate: new Date(),
        endDate: new Date(),
    })
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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
            const newTrip = await createTrip(tripDetails);
            toast.success('Trip created successfully!');
            router.push(`/dashboard/${newTrip?._id}`);
            setTripDetails({
                tripName: '',
                tripDescription: '',
                destination: '',
                startDate: new Date(),
                endDate: new Date(),
            });
            console.log('Trip created successfully:', newTrip);
        } catch (err) {
            const errorMsg = 'Failed to create trip. Please try again.';
            setError(errorMsg);
            toast.error(errorMsg);
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
            buttonText="Create Trip"
            headerTitle="Create New Trip"
            headerSubtitle="Plan your next adventure"
        />
    )
}
