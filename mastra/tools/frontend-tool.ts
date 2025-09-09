// Import Mastra tool utilities and Zod for schema validation
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const frontendTool = createTool({
	id: 'get-frontend',
	description: 'Get current frontend',
	outputSchema: z.object({
		frontend: z.string(),
	}),
	execute: async () => {
		return await getFrontend();
	},
});

// Core function that fetches and processes weather data for a given location
const getFrontend = async () => {
	return {
		frontend: 'Frontend',
	};
};
