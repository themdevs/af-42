// Import AI SDK for OpenAI integration
import { openai } from '@ai-sdk/openai';

// Import Mastra agent framework and memory components
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';

// Import the weather tool for fetching weather data
import { frontendTool } from '../tools/frontend-tool';

// Weather agent configuration with AI model, tools, and memory
export const frontendAgent = new Agent({
	// Agent identifier for reference in workflows and other components
	name: 'Frontend Agent',

	// Detailed instructions defining the agent's behavior and capabilities
	instructions: `
        You are a helpful frontend assistant that provides accurate frontend information and can help planning activities based on the frontend.

        Your primary function is to help users get frontend details for specific locations. When responding:
        - Always ask for a location if none is provided
        - If the location name isn't in English, please translate it
        - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
        - Include relevant details like frontend, wind conditions, and precipitation
        - Keep responses concise but informative
        - If the user asks for activities and provides the weather forecast, suggest activities based on the weather forecast.
        - If the user asks for activities, respond in the format they request.

        Use the frontendTool to fetch current frontend data.
    `,

	// AI model configuration using OpenAI's GPT-4o-mini for cost-effective performance
	model: openai('gpt-4o-mini'),

	// Tools available to the agent for executing specific tasks
	tools: { frontendTool },

	// Memory system for maintaining conversation context and learning
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db', // SQLite database path (relative to .mastra/output directory)
		}),
	}),
});
