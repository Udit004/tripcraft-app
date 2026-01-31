'use client';

import { useState } from 'react';
import { IUserResponse } from '@/types/user';
import { ProfileForm } from './ProfileForm';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProfileHeaderProps {
  user: IUserResponse;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const fullName = user.firstName || user.lastName
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
    : user.username;

  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={fullName}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {initials}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-1">{fullName}</h1>
          <p className="text-gray-600 mb-2">@{user.username}</p>
          
          {user.city && (
            <p className="text-sm text-gray-500 mb-3">
              📍 {user.city}
              {user.country && `, ${user.country}`}
            </p>
          )}

          {user.bio && (
            <p className="text-gray-700 mb-4 max-w-2xl">{user.bio}</p>
          )}

          {/* Travel Styles */}
          {user.travelStyles && user.travelStyles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {user.travelStyles.map((style) => (
                <Badge key={style} variant="secondary" className="capitalize">
                  {style}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
