import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const repoGeneratorTool = createTool({
	id: 'generate-repo-structure',
	description: 'Generate specific sections of the repo structure',
	inputSchema: z.object({
		section: z.enum(['repository_format', 'readme_requirements', 'code_structure', 'artifacts']),
		context: z.object({
			role: z.string(),
			stack: z.array(z.string()),
			difficulty: z.enum(['junior', 'mid', 'senior']),
		}),
	}),
	outputSchema: z.object({
		repository_format: z.string(),
		readme_requirements: z.array(z.string()),
		code_structure: z.array(z.string()),
		artifacts: z.array(z.string()).optional(),
		suggestions: z.array(z.string()).optional(),
	}),
	//   execute: async ({ section, context }) => {
	//     // Generate specific challenge sections
	//   },
});
