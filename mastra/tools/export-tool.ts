import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { challengeSchema } from '../schemas/challenge-schema';
import dotenv from 'dotenv';

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Export Tool
export const exportTool = createTool({
	id: 'export-challenge',
	description: 'Export generated challenge in various formats',
	inputSchema: z.object({
		challenge: challengeSchema,
		format: z.enum(['markdown', 'html', 'pdf', 'json']),
		styling: z
			.object({
				theme: z.string().optional(),
				companyBranding: z.boolean().optional(),
			})
			.optional(),
	}),
	outputSchema: z.object({
		exportedContent: z.string(),
		filePath: z.string().optional(),
	}),
	//   execute: async ({ challenge, format, styling }) => {
	//     // Export logic
	//   },
});
