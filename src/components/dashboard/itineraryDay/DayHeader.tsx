import React from 'react';
import { DayWarning } from '@/utility/dayWarnings';
import { Calendar, AlertTriangle, Info } from 'lucide-react';
import { format } from 'date-fns';

interface DayHeaderProps {
  dayNumber: number;
  date: string;
  warnings: DayWarning[];
}

// warning card component
export default function DayHeader({ dayNumber, date, warnings }: DayHeaderProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Day {dayNumber}
      </h2>
      <div className="flex items-center gap-4 text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <span className="font-medium">
            {format(new Date(date), 'EEEE, MMMM d, yyyy')}
          </span>
        </div>
      </div>

      {/* Warnings Section */}
      {warnings.length > 0 && (
        <div className="space-y-2 mt-4">
          {warnings.map((warning) => (
            <div
              key={warning.id}
              className={`flex items-start gap-3 p-3 rounded-lg ${
                warning.severity === 'warning'
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-blue-50 border border-blue-200'
              }`}
            >
              {warning.severity === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              )}
              <p
                className={`text-sm font-medium ${
                  warning.severity === 'warning'
                    ? 'text-yellow-800'
                    : 'text-blue-800'
                }`}
              >
                {warning.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
