import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const challengeGeneratorTool = createTool({
	id: 'generate-challenge-content',
	description: 'Generate specific sections of the frontend challenge',
	inputSchema: z.object({
		section: z.enum(['overview', 'requirements', 'rubric', 'deliverables']),
		context: z.object({
			role: z.string(),
			stack: z.array(z.string()),
			difficulty: z.enum(['junior', 'mid', 'senior']),
		}),
	}),
	outputSchema: z.object({
		content: z.string(),
		suggestions: z.array(z.string()).optional(),
	}),
	//   execute: async ({ section, context }) => {
	//     // Generate specific challenge sections
	//   },
});
