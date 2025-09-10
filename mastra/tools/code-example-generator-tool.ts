import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Code Example Generator Tool
export const codeExampleTool = createTool({
	id: 'generate-code-examples',
	description: 'Generate code examples and starter templates for challenges',
	inputSchema: z.object({
		framework: z.string(),
		feature: z.string(),
		complexity: z.enum(['basic', 'intermediate', 'advanced']),
	}),
	outputSchema: z.object({
		code: z.string(),
		explanation: z.string(),
		dependencies: z.array(z.string()),
	}),
	//   execute: async ({ framework, feature, complexity }) => {
	//     // Generate code examples
	//   },
});
