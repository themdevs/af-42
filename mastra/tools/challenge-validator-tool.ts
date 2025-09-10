import { createTool } from '@mastra/core/tools';
import { challengeSchema } from '../schemas/challenge-schema';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Challenge Validator Tool
export const challengeValidatorTool = createTool({
	id: 'validate-challenge',
	description: 'Validate generated challenge for completeness and quality',
	inputSchema: z.object({
		challenge: challengeSchema,
	}),
	outputSchema: z.object({
		isValid: z.boolean(),
		missingElements: z.array(z.string()),
		qualityScore: z.number().min(0).max(100),
		suggestions: z.array(z.string()),
	}),
	//   execute: async ({ challenge }) => {
	// Challenge validation logic
	//   },
});
