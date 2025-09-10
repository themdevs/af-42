import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Difficulty Assessor Tool
export const difficultyAssessorTool = createTool({
	id: 'assess-challenge-difficulty',
	description: 'Assess the appropriate difficulty level for a frontend challenge',
	inputSchema: z.object({
		requirements: z.array(z.string()),
		timeConstraint: z.string().optional(),
		seniorityLevel: z.enum(['junior', 'mid', 'senior']),
	}),
	outputSchema: z.object({
		difficultyScore: z.number().min(1).max(10),
		estimatedTime: z.string(),
		complexityFactors: z.array(z.string()),
	}),
	//   execute: async ({ requirements, timeConstraint, seniorityLevel }) => {
	//     // Difficulty assessment logic
	//   },
});
