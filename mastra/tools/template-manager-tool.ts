import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { challengeSchema } from '../schemas/challenge-schema';
import dotenv from 'dotenv';

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Template Manager Tool
export const templateManagerTool = createTool({
	id: 'manage-challenge-templates',
	description: 'Manage and apply challenge templates based on role and stack',
	inputSchema: z.object({
		templateType: z.enum(['react', 'vue', 'angular', 'vanilla']),
		role: z.string(),
		customizations: z.record(z.any()).optional(),
	}),
	outputSchema: z.object({
		template: challengeSchema,
		appliedCustomizations: z.array(z.string()),
	}),
	//   execute: async ({ templateType, role, customizations }) => {
	//     // Template management logic
	//   },
});
