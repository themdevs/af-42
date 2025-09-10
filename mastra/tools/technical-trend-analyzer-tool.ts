import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Technical Trend Analyzer Tool
export const trendAnalyzerTool = createTool({
	id: 'analyze-tech-trends',
	description: 'Analyze current frontend technology trends for challenge relevance',
	inputSchema: z.object({
		stack: z.array(z.string()),
		industry: z.string().optional(),
	}),
	outputSchema: z.object({
		trendingTechnologies: z.array(z.string()),
		relevanceScore: z.number().min(0).max(100),
		recommendations: z.array(z.string()),
	}),
	// execute: async ({ stack, industry }) => {
	// 	// Trend analysis using web search or AI
	// },
});
