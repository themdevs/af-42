import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// PDF/DOCX Parser Tool
export const documentParserTool = createTool({
	id: 'parse-job-document',
	description: 'Parse job offer documents (PDF, DOCX, TXT) to extract technical specifications',
	inputSchema: z.object({
		file: z.instanceof(File),
		fileType: z.enum(['pdf', 'docx', 'txt']),
	}),
	outputSchema: z.object({
		extractedText: z.string(),
		technicalSpecs: z.array(z.string()),
		frameworks: z.array(z.string()),
		tools: z.array(z.string()),
	}),
	// execute: async ({ file, fileType }) => {
	// 	// Implementation for parsing different file types
	// },
});
