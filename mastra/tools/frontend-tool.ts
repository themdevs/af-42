// Import Mastra tool utilities and Zod for schema validation
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// TypeScript interface for Open-Meteo geocoding API response
interface GeocodingResponse {
	results: {
		latitude: number;
		longitude: number;
		name: string;
	}[];
}

// TypeScript interface for Open-Meteo weather API response
interface WeatherResponse {
	current: {
		time: string;
		temperature_2m: number; // Temperature at 2 meters above ground
		apparent_temperature: number; // "Feels like" temperature
		relative_humidity_2m: number; // Humidity percentage
		wind_speed_10m: number; // Wind speed at 10 meters above ground
		wind_gusts_10m: number; // Wind gust speed at 10 meters above ground
		weather_code: number; // Numeric code representing weather conditions
	};
}

// Main tool definition for getting current weather information
export const frontendTool = createTool({
	id: 'get-weather',
	description: 'Get current weather for a location',
	// Input validation: requires a location string
	inputSchema: z.object({
		location: z.string().describe('City name'),
	}),
	// Output schema: defines the structure of returned weather data
	outputSchema: z.object({
		temperature: z.number(), // Current temperature in Celsius
		feelsLike: z.number(), // Apparent temperature in Celsius
		humidity: z.number(), // Relative humidity percentage
		windSpeed: z.number(), // Wind speed in km/h
		windGust: z.number(), // Wind gust speed in km/h
		conditions: z.string(), // Human-readable weather conditions
		location: z.string(), // Resolved location name
	}),
	// Tool execution function
	execute: async ({ context }) => {
		return await getWeather(context.location);
	},
});

// Core function that fetches and processes weather data for a given location
const getWeather = async (location: string) => {
	// Step 1: Get coordinates for the location using Open-Meteo's geocoding API
	const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
	const geocodingResponse = await fetch(geocodingUrl);
	const geocodingData = (await geocodingResponse.json()) as GeocodingResponse;

	// Validate that the location was found
	if (!geocodingData.results?.[0]) {
		throw new Error(`Location '${location}' not found`);
	}

	// Extract coordinates and official location name
	const { latitude, longitude, name } = geocodingData.results[0];

	// Step 2: Fetch current weather data using the coordinates
	const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code`;

	const response = await fetch(weatherUrl);
	const data = (await response.json()) as WeatherResponse;

	// Step 3: Format and return the weather data
	return {
		temperature: data.current.temperature_2m,
		feelsLike: data.current.apparent_temperature,
		humidity: data.current.relative_humidity_2m,
		windSpeed: data.current.wind_speed_10m,
		windGust: data.current.wind_gusts_10m,
		conditions: getWeatherCondition(data.current.weather_code), // Convert code to readable text
		location: name, // Use the official location name from geocoding
	};
};

// Helper function to convert Open-Meteo weather codes to human-readable descriptions
// Reference: https://open-meteo.com/en/docs
function getWeatherCondition(code: number): string {
	const conditions: Record<number, string> = {
		// Clear conditions (0-3)
		0: 'Clear sky',
		1: 'Mainly clear',
		2: 'Partly cloudy',
		3: 'Overcast',
		// Fog (45-48)
		45: 'Foggy',
		48: 'Depositing rime fog',
		// Drizzle (51-57)
		51: 'Light drizzle',
		53: 'Moderate drizzle',
		55: 'Dense drizzle',
		56: 'Light freezing drizzle',
		57: 'Dense freezing drizzle',
		// Rain (61-67)
		61: 'Slight rain',
		63: 'Moderate rain',
		65: 'Heavy rain',
		66: 'Light freezing rain',
		67: 'Heavy freezing rain',
		// Snow (71-77)
		71: 'Slight snow fall',
		73: 'Moderate snow fall',
		75: 'Heavy snow fall',
		77: 'Snow grains',
		// Rain showers (80-82)
		80: 'Slight rain showers',
		81: 'Moderate rain showers',
		82: 'Violent rain showers',
		// Snow showers (85-86)
		85: 'Slight snow showers',
		86: 'Heavy snow showers',
		// Thunderstorms (95-99)
		95: 'Thunderstorm',
		96: 'Thunderstorm with slight hail',
		99: 'Thunderstorm with heavy hail',
	};
	// Return the condition description or 'Unknown' if code not found
	return conditions[code] || 'Unknown';
}
