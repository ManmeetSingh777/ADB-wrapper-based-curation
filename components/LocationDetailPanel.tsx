import { LocationIntelligence } from '../lib/types';

interface LocationDetailPanelProps {
  location: LocationIntelligence | null;
  onClose: () => void;
  rawApiResponse?: string;
}

export default function LocationDetailPanel({ location, onClose, rawApiResponse }: LocationDetailPanelProps) {
  if (!location) return null;

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 z-50 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Location Detail</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Site Information */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Site Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Site ID:</span>
                <span className="text-sm font-medium text-gray-900">{location.site_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Location Name:</span>
                <span className="text-sm font-medium text-gray-900">{location.location_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Latitude:</span>
                <span className="text-sm font-medium text-gray-900">{location.latitude.toFixed(5)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Longitude:</span>
                <span className="text-sm font-medium text-gray-900">{location.longitude.toFixed(5)}</span>
              </div>
            </div>
          </div>

          {/* Audience Demographics */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Audience Demographics</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Age Range:</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {location.target_audience_demographics.age}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Gender:</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {location.target_audience_demographics.gender}
                </span>
              </div>
            </div>
          </div>

          {/* Daily Metrics */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Daily Metrics</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Daily Reach:</span>
                <span className="text-sm font-semibold text-gray-900">{formatNumber(location.estimated_daily_reach)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Daily Impressions:</span>
                <span className="text-sm font-semibold text-gray-900">{formatNumber(location.estimated_daily_impressions)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Dwell Time:</span>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                  {location.dwell_time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Income Group:</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  {location.income_group}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Frequency:</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                  {location.estimated_reach_frequency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monthly Impressions:</span>
                <span className="text-sm font-semibold text-gray-900">{formatNumber(location.monthly_impressions)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Population (1KM):</span>
                <span className="text-sm font-semibold text-gray-900">{formatNumber(location.population)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Traffic Type:</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                  {location.traffic_type}
                </span>
              </div>
            </div>
          </div>

          {/* Traffic Patterns */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Traffic Patterns</h4>
            <div className="text-sm text-gray-700">
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                {location.peak_traffic_hours}
              </span>
            </div>
          </div>

          {/* Location Types */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Location Types</h4>
            <div className="flex flex-wrap gap-2">
              {location.location_types.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* USP */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Unique Selling Point</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {location.unique_selling_point}
            </p>
          </div>

          {/* Description */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Full Description</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {location.description}
            </p>
          </div>

          {/* Raw API Response (Debug) */}
          {rawApiResponse && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Raw API Response (Debug)</h4>
              <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-x-auto">
                {rawApiResponse}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 