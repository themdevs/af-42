import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { frontendTool } from '../tools/frontend-tool';

export const frontendAgent = new Agent({
	name: 'Frontend Agent',
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
	model: openai('gpt-4o-mini'),
	tools: { frontendTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db', // path is relative to the .mastra/output directory
		}),
	}),
});
