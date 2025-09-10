// Import Mastra workflow utilities and Zod for schema validation
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

// Schema defining the structure of weather forecast data
const forecastSchema = z.object({
	date: z.string(),
	maxTemp: z.number(),
	minTemp: z.number(),
	precipitationChance: z.number(),
	condition: z.string(),
	location: z.string(),
});

// Helper function to convert weather codes from Open-Meteo API to human-readable descriptions
function getWeatherCondition(code: number): string {
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
		61: 'Slight rain',
		63: 'Moderate rain',
		65: 'Heavy rain',
		71: 'Slight snow fall',
		73: 'Moderate snow fall',
		75: 'Heavy snow fall',
		95: 'Thunderstorm',
	};
	return conditions[code] || 'Unknown';
}

// First workflow step: Fetch weather data for a given city
const fetchBackend = createStep({
	id: 'fetch-weather',
	description: 'Fetches backend details for a given city',
	inputSchema: z.object({
		city: z.string().describe('The city to get the backend details for'),
	}),
	outputSchema: forecastSchema,
	execute: async ({ inputData }) => {
		// Validate input data exists
		if (!inputData) {
			throw new Error('Input data not found');
		}

		// Step 1: Get coordinates for the city using Open-Meteo's geocoding API
		const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
			inputData.city,
		)}&count=1`;
		const geocodingResponse = await fetch(geocodingUrl);
		const geocodingData = (await geocodingResponse.json()) as {
			results: { latitude: number; longitude: number; name: string }[];
		};

		// Check if location was found
		if (!geocodingData.results?.[0]) {
			throw new Error(`Location '${inputData.city}' not found`);
		}

		const { latitude, longitude, name } = geocodingData.results[0];

		// Step 2: Fetch weather data using the coordinates
		const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=precipitation,weathercode&timezone=auto,&hourly=precipitation_probability,temperature_2m`;
		const response = await fetch(weatherUrl);
		const data = (await response.json()) as {
			current: {
				time: string;
				precipitation: number;
				weathercode: number;
			};
			hourly: {
				precipitation_probability: number[];
				temperature_2m: number[];
			};
		};

		// Step 3: Process and format the weather data
		const forecast = {
			date: new Date().toISOString(),
			maxTemp: Math.max(...data.hourly.temperature_2m), // Find highest temperature from hourly data
			minTemp: Math.min(...data.hourly.temperature_2m), // Find lowest temperature from hourly data
			condition: getWeatherCondition(data.current.weathercode), // Convert weather code to readable text
			precipitationChance: data.hourly.precipitation_probability.reduce((acc, curr) => Math.max(acc, curr), 0), // Get max precipitation chance
			location: name,
		};

		return forecast;
	},
});

// Second workflow step: Generate activity recommendations based on weather data
const planActivities = createStep({
	id: 'plan-activities',
	description: 'Suggests activities based on weather conditions',
	inputSchema: forecastSchema,
	outputSchema: z.object({
		activities: z.string(),
	}),
	execute: async ({ inputData, mastra }) => {
		const forecast = inputData;

		// Validate forecast data exists
		if (!forecast) {
			throw new Error('Forecast data not found');
		}

		// Get the weather agent from Mastra
		const agent = mastra?.getAgent('weatherAgent');
		if (!agent) {
			throw new Error('Weather agent not found');
		}

		// Create detailed prompt for the AI agent with specific formatting requirements
		const prompt = `
            Based on the following weather forecast for ${forecast.location}, suggest appropriate activities:
            ${JSON.stringify(forecast, null, 2)}
            For each day in the forecast, structure your response exactly as follows:

            📅 [Day, Month Date, Year]
            ═══════════════════════════

            🌡️ WEATHER SUMMARY
            • Conditions: [brief description]
            • Temperature: [X°C/Y°F to A°C/B°F]
            • Precipitation: [X% chance]

            🌅 MORNING ACTIVITIES
            Outdoor:
            • [Activity Name] - [Brief description including specific location/route]
                Best timing: [specific time range]
                Note: [relevant weather consideration]

            🌞 AFTERNOON ACTIVITIES
            Outdoor:
            • [Activity Name] - [Brief description including specific location/route]
                Best timing: [specific time range]
                Note: [relevant weather consideration]

            🏠 INDOOR ALTERNATIVES
            • [Activity Name] - [Brief description including specific venue]
                Ideal for: [weather condition that would trigger this alternative]

            ⚠️ SPECIAL CONSIDERATIONS
            • [Any relevant weather warnings, UV index, wind conditions, etc.]

            Guidelines:
            - Suggest 2-3 time-specific outdoor activities per day
            - Include 1-2 indoor backup options
            - For precipitation >50%, lead with indoor activities
            - All activities must be specific to the location
            - Include specific venues, trails, or locations
            - Consider activity intensity based on temperature
            - Keep descriptions concise but informative

            Maintain this exact formatting for consistency, using the emoji and section headers as shown.
        `;

		// Stream the response from the AI agent
		const response = await agent.stream([
			{
				role: 'user',
				content: prompt,
			},
		]);

		let activitiesText = '';

		// Process the streaming response and collect the text
		for await (const chunk of response.textStream) {
			process.stdout.write(chunk); // Output to console for real-time feedback
			activitiesText += chunk; // Accumulate the full response
		}

		return {
			activities: activitiesText,
		};
	},
});

// Main workflow: Combines weather fetching and activity planning steps
const backendWorkflow = createWorkflow({
	id: 'backend-workflow',
	inputSchema: z.object({
		city: z.string().describe('The city to get the backend details for'),
	}),
	outputSchema: z.object({
		activities: z.string(),
	}),
})
	.then(fetchBackend) // First: fetch weather data
	.then(planActivities); // Second: generate activity recommendations

// Commit the workflow to make it available for execution
backendWorkflow.commit();

export { backendWorkflow };
