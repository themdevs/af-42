import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Stack Analyzer Tool
export const stackAnalyzerTool = createTool({
	id: 'analyze-tech-stack',
	description: 'Analyze and categorize technical requirements from job descriptions',
	inputSchema: z.object({
		jobDescription: z.string(),
	}),
	outputSchema: z.object({
		frontendFrameworks: z.array(z.string()),
		buildTools: z.array(z.string()),
		testingFrameworks: z.array(z.string()),
		stylingSolutions: z.array(z.string()),
		stateManagement: z.array(z.string()),
		seniorityLevel: z.enum(['junior', 'mid', 'senior']),
	}),
	//   execute: async ({ jobDescription }) => {
	//     // AI-powered analysis of technical requirements
	//   },
});
