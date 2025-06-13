import { LocationIntelligence } from '../lib/types';

interface IntelligenceTableProps {
  data: LocationIntelligence[];
  onRowClick?: (location: LocationIntelligence) => void;
}

export default function IntelligenceTable({ data, onRowClick }: IntelligenceTableProps) {
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="w-full bg-white">
      <h2 className="text-2xl font-medium text-gray-900 mb-6 text-center">
        Billboard Intelligence Report
      </h2>
      
      <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
        <table className="w-full table-fixed bg-white">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-sm font-medium text-gray-700">
              <th className="w-[5%] px-3 py-4 text-center border-r border-gray-200">Site ID</th>
              <th className="w-[7%] px-3 py-4 text-left border-r border-gray-200">Location Name</th>
              <th className="w-[3%] px-3 py-4 text-center border-r border-gray-200">Lat</th>
              <th className="w-[3%] px-3 py-4 text-center border-r border-gray-200">Lon</th>
              <th className="w-[4%] px-3 py-4 text-center border-r border-gray-200">Age</th>
              <th className="w-[7%] px-3 py-4 text-right border-r border-gray-200">Daily Reach</th>
              <th className="w-[7%] px-3 py-4 text-right border-r border-gray-200">Daily Impressions</th>
              <th className="w-[5%] px-3 py-4 text-center border-r border-gray-200">Dwell Time</th>
              <th className="w-[5%] px-3 py-4 text-center border-r border-gray-200">Income</th>
              <th className="w-[4%] px-3 py-4 text-center border-r border-gray-200">Frequency</th>
              <th className="w-[7%] px-3 py-4 text-right border-r border-gray-200">Monthly Impressions</th>
              <th className="w-[5%] px-3 py-4 text-right border-r border-gray-200">Population</th>
              <th className="w-[8%] px-3 py-4 text-left border-r border-gray-200">USP</th>
              <th className="w-[5%] px-3 py-4 text-center border-r border-gray-200">Peak Traffic</th>
              <th className="w-[7%] px-3 py-4 text-center border-r border-gray-200">Location Types</th>
              <th className="w-[5%] px-3 py-4 text-center border-r border-gray-200">Traffic Type</th>
              <th className="w-[8%] px-3 py-4 text-left">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr 
                key={item.site_id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onRowClick?.(item)}
              >
                <td className="px-3 py-4 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                  {item.site_id}
                </td>
                <td className="px-3 py-4 text-left text-sm text-gray-900 border-r border-gray-200">
                  <div className="font-medium">{item.location_name}</div>
                </td>
                <td className="px-3 py-4 text-center text-sm text-gray-700 border-r border-gray-200">
                  {item.latitude.toFixed(4)}
                </td>
                <td className="px-3 py-4 text-center text-sm text-gray-700 border-r border-gray-200">
                  {item.longitude.toFixed(4)}
                </td>
                <td className="px-3 py-4 text-center text-sm text-gray-900 border-r border-gray-200">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {item.target_audience_demographics.age}
                  </span>
                </td>
                <td className="px-3 py-4 text-right text-sm font-semibold text-gray-900 border-r border-gray-200">
                  {formatNumber(item.estimated_daily_reach)}
                </td>
                <td className="px-3 py-4 text-right text-sm font-semibold text-gray-900 border-r border-gray-200">
                  {formatNumber(item.estimated_daily_impressions)}
                </td>
                <td className="px-3 py-4 text-center text-sm text-gray-900 border-r border-gray-200">
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                    {item.dwell_time}
                  </span>
                </td>
                <td className="px-3 py-4 text-center text-sm text-gray-900 border-r border-gray-200">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {item.income_group}
                  </span>
                </td>
                <td className="px-3 py-4 text-center text-sm text-gray-900 border-r border-gray-200">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    {item.estimated_reach_frequency}
                  </span>
                </td>
                <td className="px-3 py-4 text-right text-sm font-semibold text-gray-900 border-r border-gray-200">
                  {formatNumber(item.monthly_impressions)}
                </td>
                <td className="px-3 py-4 text-right text-sm font-semibold text-gray-900 border-r border-gray-200">
                  {formatNumber(item.population)}
                </td>
                <td className="px-3 py-4 text-left text-sm text-gray-700 border-r border-gray-200">
                  <div 
                    title={item.unique_selling_point}
                    className="overflow-hidden"
                  >
                    {truncateText(item.unique_selling_point)}
                  </div>
                </td>
                <td className="px-3 py-4 text-center text-sm text-gray-700 border-r border-gray-200">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                    {item.peak_traffic_hours}
                  </span>
                </td>
                <td className="px-3 py-4 text-center text-sm border-r border-gray-200">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {item.location_types.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-4 text-center text-sm text-gray-900 border-r border-gray-200">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                    {item.traffic_type}
                  </span>
                </td>
                <td className="px-3 py-4 text-left text-sm text-gray-700">
                  <div 
                    title={item.description}
                    className="overflow-hidden"
                  >
                    {truncateText(item.description)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No intelligence data available. Submit a research request to see results.
        </div>
      )}
    </div>
  );
} 