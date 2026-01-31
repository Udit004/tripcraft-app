'use client';

import { useState } from 'react';
import { useUpdateProfile } from '../hooks/useProfile';
import { IUserResponse, IProfileUpdateRequest, TravelStyle, BudgetRange } from '@/types/user';
import { Card } from '@/components/ui/card';
import { GradientButton } from '@/components/ui/GradientButton';
import { colors } from '@/constants/colors';

interface ProfileFormProps {
  user: IUserResponse;
}

const travelStyleOptions: TravelStyle[] = [
  'adventure',
  'leisure',
  'cultural',
  'budget',
  'luxury',
  'solo',
  'family',
  'business',
];

const budgetRangeOptions: BudgetRange[] = ['budget', 'moderate', 'comfort', 'luxury'];

const popularInterests = [
  'Hiking',
  'Museums',
  'Food Tours',
  'Photography',
  'Beach',
  'Mountains',
  'History',
  'Wildlife',
  'Shopping',
  'Nightlife',
  'Art',
  'Architecture',
];

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [formData, setFormData] = useState<IProfileUpdateRequest>({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    bio: user.bio || '',
    phoneNumber: user.phoneNumber || '',
    city: user.city || '',
    country: user.country || '',
    travelStyles: user.travelStyles || [],
    budgetRange: user.budgetRange,
    interests: user.interests || [],
    accessibility: user.accessibility || [],
    currency: user.currency || 'USD',
    language: user.language || 'en',
    notifications: user.notifications ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const toggleTravelStyle = (style: TravelStyle) => {
    setFormData((prev) => ({
      ...prev,
      travelStyles: prev.travelStyles?.includes(style)
        ? prev.travelStyles.filter((s) => s !== style)
        : [...(prev.travelStyles || []), style],
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests?.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...(prev.interests || []), interest],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Rahul"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Sharma"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={3}
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Travel enthusiast from India, love exploring new places and cultures..."
          />
          <p className="text-xs text-gray-500 mt-1">{formData.bio?.length || 0}/500</p>
        </div>
      </Card>

      {/* Location */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mumbai"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="India"
            />
          </div>
        </div>
      </Card>

      {/* Travel Preferences */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Travel Preferences</h2>
        
        {/* Travel Styles */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Travel Styles</label>
          <div className="flex flex-wrap gap-2">
            {travelStyleOptions.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => toggleTravelStyle(style)}
                style={{
                  backgroundColor: formData.travelStyles?.includes(style) ? colors.primary : '#E5E7EB',
                  color: formData.travelStyles?.includes(style) ? '#FFFFFF' : colors.textMuted,
                }}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors hover:opacity-90"
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Budget Range</label>
          <div className="flex flex-wrap gap-2">
            {budgetRangeOptions.map((budget) => (
              <button
                key={budget}
                type="button"
                onClick={() => setFormData({ ...formData, budgetRange: budget })}
                style={{
                  backgroundColor: formData.budgetRange === budget ? colors.secondary : '#E5E7EB',
                  color: formData.budgetRange === budget ? '#FFFFFF' : colors.textMuted,
                }}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors hover:opacity-90"
              >
                {budget.charAt(0).toUpperCase() + budget.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium mb-2">Interests</label>
          <div className="flex flex-wrap gap-2">
            {popularInterests.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                style={{
                  backgroundColor: formData.interests?.includes(interest) ? colors.accent : '#E5E7EB',
                  color: formData.interests?.includes(interest) ? '#FFFFFF' : colors.textMuted,
                }}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors hover:opacity-90"
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">App Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="INR">INR - Indian Rupee</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="ja">Japanese</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.notifications}
              onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium">Enable notifications</span>
          </label>
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <GradientButton
          type="submit"
          disabled={isPending}
          className="px-8 py-3"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </GradientButton>
      </div>
    </form>
  );
};
