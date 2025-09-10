// Import Mastra tool utilities and Zod for schema validation
import { createTool } from '@mastra/core/tools';
import { challengeSchema } from '../schemas/challenge-schema';
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
console.log(OPENAI_API_KEY);

export const backendTool = createTool({
	id: 'generate-backend-challenge',
	description: 'Generate a backend technical challenge',
	inputSchema: z.object({
		jobOffer: z.instanceof(File),
		jsonConfig: z.instanceof(File),
	}),
	outputSchema: challengeSchema,
	// execute: async (): Promise<typeof challengeSchema> => {
	// 	return await generateBackendChallenge();
	// },
});

const generateBackendChallenge = () => {
	return challengeSchema.parse({});
};
