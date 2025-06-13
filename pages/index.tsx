import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { DEFAULT_SYSTEM_PROMPT } from '../lib/constants';
import { LocationIntelligence } from '../lib/types';
import IntelligenceTable from '../components/IntelligenceTable';
import LocationDetailPanel from '../components/LocationDetailPanel';

export default function Home() {
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [inventoryLocationsInput, setInventoryLocationsInput] = useState(`[
  {"SiteId": 101, "site_name": "Chandni Chowk", "latitude": 28.6565, "longitude": 77.2300},
  {"SiteId": 102, "site_name": "Sadar Bazaar", "latitude": 28.6655, "longitude": 77.2060}
]`);
  const [loading, setLoading] = useState(false);
  const [rawResponse, setRawResponse] = useState<string>('');
  const [intelligenceData, setIntelligenceData] = useState<LocationIntelligence[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationIntelligence | null>(null);
  const [error, setError] = useState<string>('');
  const [showRawOutput, setShowRawOutput] = useState(false);

  // Parse Perplexity response into structured data
  const parseResponseToIntelligence = (response: string, inputLocations: any[]): LocationIntelligence[] => {
    // Extract data for each site from the response
    const sites: LocationIntelligence[] = [];
    
    // DEBUG: Log the raw response structure
    console.log('🔍 PARSING DEBUG:');
    console.log('Raw response length:', response.length);
    console.log('First 1000 chars:', response.substring(0, 1000));
    console.log('Contains expected patterns:', {
      siteId: response.includes('Site ID'),
      primaryAttribs: response.includes('PRIMARY ATTRIBUTES'),
      audienceTable: response.includes('AUDIENCE CATEGORY TABLE')
    });
    
    inputLocations.forEach((loc, index) => {
      // Extract site-specific data from response - try multiple patterns
      const siteId = `BB-${loc.SiteId}`;
      
      // Try different site extraction patterns
      let siteSection = '';
      const patterns = [
        new RegExp(`Site ID:\\s*BB-${loc.SiteId}[\\s\\S]*?(?=Site ID:\\s*BB-\\d+|🔹|$)`, 'i'),
        new RegExp(`Site ID\\s*:?\\s*${loc.SiteId}[\\s\\S]*?(?=Site ID\\s*:?\\s*\\d+|$)`, 'i'),
        new RegExp(`BB-${loc.SiteId}[\\s\\S]*?(?=BB-\\d+|$)`, 'i')
      ];
      
      for (const pattern of patterns) {
        const match = response.match(pattern);
        if (match && match[0].length > 100) { // Ensure we got substantial content
          siteSection = match[0];
          break;
        }
      }
      
      // If no specific section found, use entire response for single location
      if (!siteSection && inputLocations.length === 1) {
        siteSection = response;
      }
      
      console.log(`🎯 Site ${loc.SiteId} extraction:`, {
        sectionLength: siteSection.length,
        preview: siteSection.substring(0, 200)
      });
      
      // Extract location name - try multiple patterns
      let locationName = "Unknown Location";
      const namePatterns = [
        /Site Name:\s*([^\n\r]+)/i,
        /Location:\s*([^\n\r]+)/i,
        /Name:\s*([^\n\r]+)/i,
        new RegExp(`${loc.site_name}`, 'i') // Fallback to input name if found
      ];
      
      for (const pattern of namePatterns) {
        const match = siteSection.match(pattern);
        if (match && match[1]) {
          locationName = match[1].trim();
          break;
        }
      }
      
      // Extract demographics - try multiple patterns
      let age = "Unknown";
      const agePatterns = [
        /Age Range:\s*(\d+[-–]\d+)/i,
        /Age:\s*(\d+[-–]\d+)/i,
        /(\d+)[-–](\d+)\s*years?/i
      ];
      
      for (const pattern of agePatterns) {
        const match = siteSection.match(pattern);
        if (match) {
          age = match[1] || `${match[1]}-${match[2]}`;
          break;
        }
      }
      
      // Extract gender - try multiple patterns
      let gender = "Unknown";
      const genderPatterns = [
        /Target Audience Demographics:[\s\S]*?(male|female|mixed)[-\s]*(?:dominant|majority|bias)?/gi,
        /(male|female|mixed)[-\s]*(?:dominant|majority|bias)/gi,
        /gender[:\s]*(male|female|mixed)/gi
      ];
      
      for (const pattern of genderPatterns) {
        const match = siteSection.match(pattern);
        if (match && match[1]) {
          gender = match[1];
          break;
        }
      }
      
      // Extract numeric fields - try multiple patterns
      let dailyReach = 0;
      const reachPatterns = [
        /Estimated Daily Reach:\s*(\d+)/i,
        /Daily Reach:\s*(\d+)/i,
        /Reach:\s*(\d+)/i,
        /daily audience[:\s]*(\d+)/i
      ];
      
      for (const pattern of reachPatterns) {
        const match = siteSection.match(pattern);
        if (match && match[1]) {
          dailyReach = parseInt(match[1]);
          break;
        }
      }
      
      let dailyImpressions = 0;
      const impressionsPatterns = [
        /Estimated Daily Impressions:\s*(\d+)/i,
        /Daily Impressions:\s*(\d+)/i,
        /Impressions:\s*(\d+)/i,
        /daily views[:\s]*(\d+)/i
      ];
      
      for (const pattern of impressionsPatterns) {
        const match = siteSection.match(pattern);
        if (match && match[1]) {
          dailyImpressions = parseInt(match[1]);
          break;
        }
      }
      
      let population = 0;
      const populationPatterns = [
        /Population:\s*(\d+)/i,
        /population catchment[:\s]*(\d+)/i,
        /local population[:\s]*(\d+)/i,
        /residents[:\s]*(\d+)/i
      ];
      
      for (const pattern of populationPatterns) {
        const match = siteSection.match(pattern);
        if (match && match[1]) {
          population = parseInt(match[1]);
          break;
        }
      }
      
      // Log extraction results
      console.log(`📊 Numeric extraction for Site ${loc.SiteId}:`, {
        dailyReach, dailyImpressions, population
      });
      
      // Extract all other fields with flexible patterns
      let peakHours = "No data";
      const peakHoursPatterns = [
        /Peak Traffic Hours and Patterns:\s*([^\n\r]+)/i,
        /Peak Hours:\s*([^\n\r]+)/i,
        /Traffic Hours:\s*([^\n\r]+)/i,
        /busy hours[:\s]*([^\n\r]+)/i
      ];
      for (const pattern of peakHoursPatterns) {
        const match = siteSection.match(pattern);
        if (match && match[1]) { peakHours = match[1].trim(); break; }
      }
      
      let usp = "No data available";
      const uspPatterns = [
        /USP:\s*([^\n\r]+)/i,
        /Unique Selling Point:\s*([^\n\r]+)/i,
        /Key Advantage:\s*([^\n\r]+)/i,
        /advantage[:\s]*([^\n\r]+)/i
      ];
      for (const pattern of uspPatterns) {
        const match = siteSection.match(pattern);
        if (match && match[1]) { usp = match[1].trim(); break; }
      }
      
      let locationTypes = ["No data"];
      const locationTypesPatterns = [
        /Location Types:\s*([^\n\r]+)/i,
        /Area Type:\s*([^\n\r]+)/i,
        /Zone Type:\s*([^\n\r]+)/i,
        /location category[:\s]*([^\n\r]+)/i
      ];
      for (const pattern of locationTypesPatterns) {
        const match = siteSection.match(pattern);
        if (match && match[1]) { 
          locationTypes = match[1].split(',').map(t => t.trim()).slice(0, 5);
          break; 
        }
      }
      
      let dwellTime = "No data";
      const dwellTimePatterns = [
        /Dwell Time:\s*([^\n\r]+)/i,
        /Viewing Time:\s*([^\n\r]+)/i,
        /(\d+)\s*[-–]\s*(\d+)\s*seconds/i,
        /dwell[:\s]*([^\n\r]+)/i
      ];
      for (const pattern of dwellTimePatterns) {
        const match = siteSection.match(pattern);
        if (match && match[1]) { 
          dwellTime = match[1].trim();
          break; 
        }
      }
      
      let incomeGroup = "No data";
      const incomePatterns = [
        /Income Group:\s*(Low Income|Mid Income|High Income)/i,
        /Income Level:\s*(Low Income|Mid Income|High Income)/i,
        /(Low Income|Mid Income|High Income)/i
      ];
      for (const pattern of incomePatterns) {
        const match = siteSection.match(pattern);
        if (match && match[1]) { incomeGroup = match[1]; break; }
      }
      
      let trafficType = "No data";
      const trafficPatterns = [
        /Traffic Type:\s*(Pedestrian Dominant|Vehicle Dominant)/i,
        /Dominant Traffic:\s*(Pedestrian|Vehicle)/i,
        /(Pedestrian Dominant|Vehicle Dominant)/i
      ];
      for (const pattern of trafficPatterns) {
        const match = siteSection.match(pattern);
        if (match && match[1]) { trafficType = match[1]; break; }
      }
      
      // Extract description with flexible patterns
      let description = "No description available";
      const descPatterns = [
        /Description:\s*([^\n\r]+(?:\n[^\n\r]+)*)/i,
        /Area Description:\s*([^\n\r]+(?:\n[^\n\r]+)*)/i,
        /Location Description:\s*([^\n\r]+(?:\n[^\n\r]+)*)/i,
        /This (?:area|location)[:\s]*([^\n\r]+)/i
      ];
      for (const pattern of descPatterns) {
        const match = siteSection.match(pattern);
        if (match && match[1]) { 
          description = match[1].trim().substring(0, 300); 
          break; 
        }
      }
      
      // Extract frequency from Audience Category Table or other sources
      let frequencySpecific = 0;
      const frequencyPatterns = [
        /AUDIENCE CATEGORY TABLE[\s\S]*?Adults 0\+\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/i,
        /Daily Frequency[:\s]*(\d+)/i,
        /Frequency[:\s]*(\d+)/i,
        /frequency of target audience[:\s]*(\d+)/i
      ];
      for (const pattern of frequencyPatterns) {
        const match = siteSection.match(pattern);
        if (match && match[1]) { 
          frequencySpecific = parseInt(match[pattern === frequencyPatterns[0] ? 4 : 1]); 
          break; 
        }
      }
      
      // Calculate monthly impressions only if daily impressions exist
      const monthlyImpressions = dailyImpressions > 0 ? dailyImpressions * 30 : 0;
      
      sites.push({
        site_id: siteId,
        location_name: locationName,
        latitude: loc.latitude,
        longitude: loc.longitude,
        target_audience_demographics: {
          age: age,
          gender: gender
        },
        estimated_daily_reach: dailyReach,
        estimated_daily_impressions: dailyImpressions,
        dwell_time: dwellTime,
        income_group: incomeGroup,
        unique_selling_point: usp,
        peak_traffic_hours: peakHours,
        location_types: locationTypes,
        estimated_reach_frequency: frequencySpecific,
        monthly_impressions: monthlyImpressions,
        population: population,
        description: description,
        traffic_type: trafficType
      });
    });
    
    return sites;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRawResponse('');
    setIntelligenceData([]);

    try {
      // Parse inventory locations JSON
      let inventoryLocations;
      try {
        inventoryLocations = JSON.parse(inventoryLocationsInput);
      } catch (parseError) {
        setError('Invalid JSON format in inventory locations');
        setLoading(false);
        return;
      }

      const response = await axios.post('/api/extract', {
        system_prompt: systemPrompt,
        inventory_locations: inventoryLocations
      });

      if (response.data.success) {
        const rawData = response.data.data;
        setRawResponse(rawData);
        
        // Parse the response into structured intelligence data
        const parsedData = parseResponseToIntelligence(rawData, inventoryLocations);
        setIntelligenceData(parsedData);
      } else {
        setError(response.data.error);
      }
    } catch (error: any) {
      if (error.response?.data) {
        setError(error.response.data.error);
      } else {
        setError('Network error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = (location: LocationIntelligence) => {
    setSelectedLocation(location);
  };

  const handleCloseDetail = () => {
    setSelectedLocation(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Billboard Intelligence Report - Perplexity Sonar Tester</title>
        <meta name="description" content="Generate intelligence reports for billboard locations using Perplexity Sonar API" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Billboard Intelligence System
          </h1>
          <p className="mt-2 text-gray-600">
            Generate comprehensive intelligence reports for billboard locations using Perplexity Sonar Deep Research
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Research Configuration
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Prompt */}
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                  System Prompt
                </label>
                <textarea
                  id="prompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  required
                  rows={8}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your research prompt..."
                />
                <p className="mt-1 text-sm text-gray-500">
                  The billboard locations will be injected after this prompt
                </p>
              </div>

              {/* Inventory Locations JSON */}
              <div>
                <label htmlFor="locations" className="block text-sm font-medium text-gray-700">
                  Inventory Locations (JSON Array)
                </label>
                <textarea
                  id="locations"
                  value={inventoryLocationsInput}
                  onChange={(e) => setInventoryLocationsInput(e.target.value)}
                  required
                  rows={8}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
                  placeholder='[{"SiteId": 101, "site_name": "Chandni Chowk", "latitude": 28.6565, "longitude": 77.2300}]'
                />
                                  <p className="mt-1 text-sm text-gray-500">
                    Valid JSON array with SiteId (number), site_name (string), latitude, and longitude fields
                  </p>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-800">
                  <strong>Error:</strong> {error}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Deep Research (This may take several minutes)...
                </>
              ) : (
                'Generate Intelligence Report'
              )}
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600 font-medium">Conducting Deep Research Analysis...</p>
                <p className="text-sm text-gray-500 mt-1">Sonar Deep Research is analyzing hundreds of sources</p>
                <p className="text-xs text-gray-400 mt-1">This process may take 5+ minutes for comprehensive results</p>
              </div>
            </div>
          </div>
        )}

        {/* Intelligence Table */}
        {intelligenceData.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Intelligence Report Results</h2>
              <button
                onClick={() => setShowRawOutput(!showRawOutput)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                {showRawOutput ? 'Hide' : 'Show'} Raw Output
              </button>
            </div>
            <IntelligenceTable 
              data={intelligenceData} 
              onRowClick={handleLocationClick}
            />
          </div>
        )}

        {/* Raw Output (Toggle) */}
        {showRawOutput && rawResponse && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw Perplexity Response</h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {rawResponse}
              </pre>
            </div>
          </div>
        )}

        {/* Location Detail Panel */}
        <LocationDetailPanel
          location={selectedLocation}
          onClose={handleCloseDetail}
          rawApiResponse={rawResponse}
        />
      </div>
    </div>
  );
} 