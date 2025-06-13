// Input types for the simplified system
export interface InventoryLocation {
  SiteId: number;
  site_name: string;
  latitude: number;
  longitude: number;
}

export interface ResearchRequest {
  system_prompt: string;
  inventory_locations: InventoryLocation[];
}

// Output types following OutputFormatDesign.md specification
export interface TargetAudienceDemographics {
  age: string;
  gender: string;
}

export interface LocationIntelligence {
  site_id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  target_audience_demographics: TargetAudienceDemographics;
  estimated_daily_reach: number;
  estimated_daily_impressions: number;
  dwell_time: string;
  income_group: string;
  unique_selling_point: string;
  peak_traffic_hours: string;
  location_types: string[];
  estimated_reach_frequency: number;
  monthly_impressions: number;
  population: number;
  description: string;
  traffic_type: string;
}

export interface APIResponse {
  success: boolean;
  data?: string; // Raw Perplexity response
  parsed_data?: LocationIntelligence[]; // Structured data array
  error?: string;
} 