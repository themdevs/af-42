import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { challengeSchema } from '../schemas/challenge-schema';
import dotenv from 'dotenv';

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Best Practice Checker Tool
export const bestPracticeTool = createTool({
	id: 'check-best-practices',
	description: 'Ensure challenge follows frontend development best practices',
	inputSchema: z.object({
		challenge: challengeSchema,
	}),
	outputSchema: z.object({
		complianceScore: z.number().min(0).max(100),
		violations: z.array(z.string()),
		recommendations: z.array(z.string()),
	}),
	// execute: async ({ challenge }) => {
	// 	// Best practice validation
	// },
});
