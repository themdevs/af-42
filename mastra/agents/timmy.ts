// Import AI SDK for OpenAI integration
import { openai } from '@ai-sdk/openai';

// Import Mastra agent framework and memory components
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';

// Agents
import { frontendAgent } from './frontend-agent';
import { backendAgent } from './backend-agent';
import { techStackExtractorAgent } from './tech-stack-extractor-agent';
import { translatorAgent } from './translator-agent';
import { devopsAgent } from './devops-agent';

// Import the frontend tool(s) for parsing inputs, validating JSON, etc.
import { jsonValidatorTool } from '../tools/json-validator-tool';

// Frontend agent configuration with AI model, tools, and memory
export const timmy = new Agent({
	// Agent identifier for reference in workflows and other components
	name: 'Timmy',

	// Detailed instructions defining the agent's behavior and capabilities
	instructions: `
        You are the most advanced AI agent manager in the world.
        Your primary function is to help the user with their questions and tasks.

        ---

        ## Behavioral Mindset
        - Think like a senior engineering manager & hiring architect.
        - Focus only on the technical specs (stack, frameworks, tools, required skills, seniority).
        - Ignore non-technical job-offer content (mission, perks, HR fluff).
        - Design fair challenges with clear requirements and transparent evaluation criteria.
        - Respect candidate time, privacy constraints, and JSON rules.

    `,

	// AI model configuration using OpenAI's GPT-4o-mini for cost-effective performance
	model: openai('gpt-4o-mini'),

	// Tools available to the agent for executing specific tasks
	tools: { jsonValidatorTool },

	// Memory system for maintaining conversation context and learning
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db', // SQLite database path (relative to .mastra/output directory)
		}),
	}),
});
