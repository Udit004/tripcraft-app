'use client';

import { IUserResponse } from '@/types/user';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { colors } from '@/constants/colors';

interface ProfileDetailsCardProps {
  user: IUserResponse;
}

export const ProfileDetailsCard = ({ user }: ProfileDetailsCardProps) => {
  const fullName = user.firstName || user.lastName
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
    : user.username;

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: colors.textMain }}>
          Basic Information
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Full Name" value={fullName} />
            <InfoItem label="Username" value={`@${user.username}`} />
            <InfoItem label="Email" value={user.email} />
            <InfoItem label="Phone" value={user.phoneNumber || 'Not provided'} />
          </div>
          
          {user.bio && (
            <div className="pt-2">
              <p className="text-sm font-medium mb-1" style={{ color: colors.textMuted }}>
                Bio
              </p>
              <p className="text-gray-700 leading-relaxed">{user.bio}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Location Information */}
      {(user.city || user.country) && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: colors.textMain }}>
            📍 Location
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.city && <InfoItem label="City" value={user.city} />}
            {user.country && <InfoItem label="Country" value={user.country} />}
          </div>
        </Card>
      )}

      {/* Travel Preferences */}
      {(user.travelStyles?.length || user.budgetRange || user.interests?.length) && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4" style={{ color: colors.textMain }}>
            ✈️ Travel Preferences
          </h2>
          <div className="space-y-4">
            {/* Travel Styles */}
            {user.travelStyles && user.travelStyles.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: colors.textMuted }}>
                  Travel Styles
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.travelStyles.map((style) => (
                    <Badge
                      key={style}
                      style={{
                        backgroundColor: colors.primary,
                        color: '#FFFFFF',
                      }}
                      className="capitalize px-3 py-1"
                    >
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Budget Range */}
            {user.budgetRange && (
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: colors.textMuted }}>
                  Budget Range
                </p>
                <Badge
                  style={{
                    backgroundColor: colors.secondary,
                    color: '#FFFFFF',
                  }}
                  className="capitalize px-4 py-2 text-base"
                >
                  {user.budgetRange}
                </Badge>
              </div>
            )}

            {/* Interests */}
            {user.interests && user.interests.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: colors.textMuted }}>
                  Interests
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest) => (
                    <Badge
                      key={interest}
                      style={{
                        backgroundColor: colors.accent,
                        color: '#FFFFFF',
                      }}
                      className="px-3 py-1"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Accessibility Needs */}
            {user.accessibility && user.accessibility.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: colors.textMuted }}>
                  Accessibility Needs
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.accessibility.map((item) => (
                    <Badge
                      key={item}
                      variant="outline"
                      className="px-3 py-1"
                      style={{ borderColor: colors.primary, color: colors.primary }}
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* App Preferences */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4" style={{ color: colors.textMain }}>
          ⚙️ App Preferences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoItem
            label="Currency"
            value={getCurrencyLabel(user.currency || 'USD')}
          />
          <InfoItem
            label="Language"
            value={getLanguageLabel(user.language || 'en')}
          />
          <InfoItem
            label="Notifications"
            value={user.notifications ? 'Enabled' : 'Disabled'}
            badge={user.notifications}
          />
        </div>
      </Card>

      {/* Account Information */}
      <Card className="p-6 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4" style={{ color: colors.textMuted }}>
          Account Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            label="Member Since"
            value={new Date(user.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          />
          <InfoItem
            label="Last Updated"
            value={new Date(user.updatedAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          />
        </div>
      </Card>
    </div>
  );
};

// Helper component for displaying information items
const InfoItem = ({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: boolean;
}) => (
  <div>
    <p className="text-sm font-medium mb-1" style={{ color: colors.textMuted }}>
      {label}
    </p>
    {badge !== undefined ? (
      <Badge
        style={{
          backgroundColor: badge ? colors.secondary : colors.textMuted,
          color: '#FFFFFF',
        }}
        className="px-3 py-1"
      >
        {value}
      </Badge>
    ) : (
      <p className="text-gray-900 font-medium">{value}</p>
    )}
  </div>
);

// Helper functions for labels
const getCurrencyLabel = (code: string): string => {
  const currencies: Record<string, string> = {
    USD: 'USD - US Dollar',
    EUR: 'EUR - Euro',
    GBP: 'GBP - British Pound',
    JPY: 'JPY - Japanese Yen',
    AUD: 'AUD - Australian Dollar',
    CAD: 'CAD - Canadian Dollar',
    INR: 'INR - Indian Rupee',
  };
  return currencies[code] || code;
};

const getLanguageLabel = (code: string): string => {
  const languages: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ja: 'Japanese',
    zh: 'Chinese',
    hi: 'Hindi',
  };
  return languages[code] || code;
};
