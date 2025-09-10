import { createTool } from '@mastra/core/tools';
import { evaluationCriteriaSchema } from '../schemas/evaluation-criteria-schema';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Rubric Generator Tool
export const rubricGeneratorTool = createTool({
	id: 'generate-evaluation-rubric',
	description: 'Generate detailed evaluation rubrics for frontend challenges',
	inputSchema: z.object({
		requirements: z.array(z.string()),
		difficulty: z.enum(['junior', 'mid', 'senior']),
		focusAreas: z.array(z.string()),
	}),
	outputSchema: z.object({
		rubric: evaluationCriteriaSchema,
		sampleCriteria: z.array(z.string()),
	}),
	//   execute: async ({ requirements, difficulty, focusAreas }) => {
	//     // Rubric generation logic
	//   },
});
