import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Resource Linker Tool
export const resourceLinkerTool = createTool({
	id: 'suggest-resources',
	description: 'Suggest relevant learning resources and documentation for the challenge',
	inputSchema: z.object({
		technologies: z.array(z.string()),
		difficulty: z.enum(['junior', 'mid', 'senior']),
	}),
	outputSchema: z.object({
		documentation: z.array(z.string()),
		tutorials: z.array(z.string()),
		examples: z.array(z.string()),
	}),
	//   execute: async ({ technologies, difficulty }) => {
	//     // Resource suggestion logic
	//   },
});
