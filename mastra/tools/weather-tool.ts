// Import Mastra's createTool utility for building structured tools
import { createTool } from '@mastra/core/tools';
// Import Zod for runtime type validation and schema definition
import { z } from 'zod';

// Type definitions for external API responses
interface GeocodingResponse {
	results: {
		latitude: number;
		longitude: number;
		name: string;
	}[];
}
interface WeatherResponse {
	current: {
		time: string;
		temperature_2m: number;
		apparent_temperature: number;
		relative_humidity_2m: number;
		wind_speed_10m: number;
		wind_gusts_10m: number;
		weather_code: number;
	};
}

// Main weather tool definition using Mastra's createTool pattern
export const weatherTool = createTool({
	// Unique identifier for tool registration and reference
	id: 'get-weather',
	// Human-readable description for AI agents and documentation
	description: 'Get current weather for a location',
	// Input validation schema - defines what parameters this tool accepts
	inputSchema: z.object({
		location: z.string().describe('City name'),
	}),
	// Output validation schema - defines the structure of returned data
	outputSchema: z.object({
		temperature: z.number(),
		feelsLike: z.number(),
		humidity: z.number(),
		windSpeed: z.number(),
		windGust: z.number(),
		conditions: z.string(),
		location: z.string(),
	}),
	// Core execution function - called when agents use this tool
	execute: async ({ context }) => {
		return await getWeather(context.location);
	},
});

// Internal helper function to fetch weather data from Open-Meteo APIs
const getWeather = async (location: string) => {
	// Step 1: Convert location name to coordinates using geocoding API
	const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
	const geocodingResponse = await fetch(geocodingUrl);
	const geocodingData = (await geocodingResponse.json()) as GeocodingResponse;

	// Validate that location was found
	if (!geocodingData.results?.[0]) {
		throw new Error(`Location '${location}' not found`);
	}

	// Extract coordinates and proper location name
	const { latitude, longitude, name } = geocodingData.results[0];

	// Step 2: Fetch current weather data using coordinates
	const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code`;

	const response = await fetch(weatherUrl);
	const data = (await response.json()) as WeatherResponse;

	// Transform API response to match our output schema
	return {
		temperature: data.current.temperature_2m,
		feelsLike: data.current.apparent_temperature,
		humidity: data.current.relative_humidity_2m,
		windSpeed: data.current.wind_speed_10m,
		windGust: data.current.wind_gusts_10m,
		conditions: getWeatherCondition(data.current.weather_code), // Convert numeric code to readable string
		location: name,
	};
};

// Helper function to convert WMO weather codes to human-readable conditions
function getWeatherCondition(code: number): string {
	// WMO (World Meteorological Organization) standard weather codes
	const conditions: Record<number, string> = {
		0: 'Clear sky',
		1: 'Mainly clear',
		2: 'Partly cloudy',
		3: 'Overcast',
		45: 'Foggy',
		48: 'Depositing rime fog',
		51: 'Light drizzle',
		53: 'Moderate drizzle',
		55: 'Dense drizzle',
		56: 'Light freezing drizzle',
		57: 'Dense freezing drizzle',
		61: 'Slight rain',
		63: 'Moderate rain',
		65: 'Heavy rain',
		66: 'Light freezing rain',
		67: 'Heavy freezing rain',
		71: 'Slight snow fall',
		73: 'Moderate snow fall',
		75: 'Heavy snow fall',
		77: 'Snow grains',
		80: 'Slight rain showers',
		81: 'Moderate rain showers',
		82: 'Violent rain showers',
		85: 'Slight snow showers',
		86: 'Heavy snow showers',
		95: 'Thunderstorm',
		96: 'Thunderstorm with slight hail',
		99: 'Thunderstorm with heavy hail',
	};
	// Return mapped condition or fallback for unknown codes
	return conditions[code] || 'Unknown';
}
