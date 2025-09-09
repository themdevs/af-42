// Import Mastra tool utilities and Zod for schema validation
import { createTool } from '@mastra/core/tools';
import { challengeSchema } from '../schemas/challenge-schema';
import { z } from 'zod';

export const frontendTool = createTool({
	id: 'generate-frontend-challenge',
	description: 'Generate a frontend challenge',
	inputSchema: z.object({
		jobOffer: z.string(),
		jsonConfig: z.string(),
	}),
	outputSchema: challengeSchema,
	execute: async (): Promise<typeof challengeSchema> => {
		return await generateFrontendChallenge();
	},
});

const generateFrontendChallenge = async (): Promise<typeof challengeSchema> => {
	return await challengeSchema.parse({});
};
