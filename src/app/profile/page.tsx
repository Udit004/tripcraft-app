'use client';

import { useState } from 'react';
import { useProfile } from '@/feature/profile/hooks/useProfile';
import { ProfileHeader } from '@/feature/profile/components/ProfileHeader';
import { ProfileForm } from '@/feature/profile/components/ProfileForm';
import { ProfileDetailsCard } from '@/feature/profile/components/ProfileDetailsCard';
import ProtectRoutes from '@/components/ProtectRoutes';
import { GradientButton } from '@/components/ui/GradientButton';

const ProfilePage = () => {
  const { data: user, isLoading, error } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Profile</h2>
            <p className="text-red-600">
              {error instanceof Error ? error.message : 'Failed to load profile'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectRoutes>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Page Title with Edit Toggle */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">
                {isEditing ? 'Edit your profile and preferences' : 'View your account and travel preferences'}
              </p>
            </div>
            <GradientButton
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2"
            >
              {isEditing ? '👁️ View Profile' : '✏️ Edit Profile'}
            </GradientButton>
          </div>

          {/* Profile Header */}
          <ProfileHeader user={user} />

          {/* Conditional Rendering: View or Edit */}
          {isEditing ? (
            <ProfileForm user={user} />
          ) : (
            <ProfileDetailsCard user={user} />
          )}
        </div>
      </div>
    </ProtectRoutes>
  );
};

export default ProfilePage;
