import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { ResearchRequest, APIResponse } from '../../lib/types';
import { API_CONFIG } from '../../lib/constants';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse>
) {
  // DEBUG: Check what environment variables are loaded
  console.log('DEBUG - Environment check:');
  console.log('PERPLEXITY_API_KEY exists:', !!process.env.PERPLEXITY_API_KEY);
  console.log('PERPLEXITY_API_KEY length:', process.env.PERPLEXITY_API_KEY?.length || 0);
  console.log('PERPLEXITY_API_KEY first 10 chars:', process.env.PERPLEXITY_API_KEY?.substring(0, 10) || 'undefined');

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { system_prompt, inventory_locations }: ResearchRequest = req.body;

    // Basic validation
    if (!system_prompt || !inventory_locations || !Array.isArray(inventory_locations)) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: system_prompt and inventory_locations (as array)'
      });
    }

    if (inventory_locations.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one inventory location is required'
      });
    }

    // Validate inventory locations format
    for (const location of inventory_locations) {
      if (typeof location.SiteId !== 'number' || typeof location.site_name !== 'string' || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
        return res.status(400).json({
          success: false,
          error: 'Each inventory location must have SiteId (number), site_name (string), latitude, and longitude'
        });
      }
    }

    // Check if API key exists before making request
    if (!process.env.PERPLEXITY_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'PERPLEXITY_API_KEY not found in environment variables'
      });
    }

    // Build formatted input blocks exactly as specified in system prompt
    const formattedLocations = inventory_locations
      .map(loc => `Site ID: BB-${loc.SiteId}
Site Name: ${loc.site_name}
Latitude: ${loc.latitude}
Longitude: ${loc.longitude}`)
      .join('\n\n');

    // Final prompt with exact format specified
    const finalPrompt = `${system_prompt}

${formattedLocations}`;

    // Call Perplexity Sonar API
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: API_CONFIG.PERPLEXITY_MODEL,
        messages: [
          {
            role: 'user',
            content: finalPrompt
          }
        ],
        stream: false,
        temperature: 0.0,
        max_tokens: 3000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: API_CONFIG.TIMEOUT
      }
    );

    const content = response.data.choices[0]?.message?.content;
    
    if (!content) {
      return res.status(500).json({
        success: false,
        error: "No response content from Perplexity Sonar"
      });
    }

    return res.status(200).json({
      success: true,
      data: content
    });

  } catch (error: any) {
    console.error('Perplexity API error:', error);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      
      return res.status(500).json({
        success: false,
        error: `Perplexity API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`
      });
    }
    
    return res.status(500).json({
      success: false,
      error: `Request failed: ${error.message}`
    });
  }
}

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
} 