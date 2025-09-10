import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Time Estimator Tool
export const timeEstimatorTool = createTool({
	id: 'estimate-completion-time',
	description: 'Estimate realistic completion times for different challenge components',
	inputSchema: z.object({
		requirements: z.array(z.string()),
		seniorityLevel: z.enum(['junior', 'mid', 'senior']),
		complexityFactors: z.array(z.string()),
	}),
	outputSchema: z.object({
		totalTime: z.string(),
		breakdown: z.record(z.string()),
		confidence: z.number().min(0).max(100),
	}),
	//   execute: async ({ requirements, seniorityLevel, complexityFactors }) => {
	//     // Time estimation logic
	//   },
});
