'use server';

import { mastra } from '../../../../../../../mastra';

// Server action to generate technical challenges using AI agent
export async function createTechChallenge(jobOffer: string, jsonConfig: string) {
	console.log('Creating technical challenge with job offer:', jobOffer);
	console.log('Creating technical challenge with JSON config:', jsonConfig);
	// Get the AI agent named 'timmy' from Mastra
	const timmy = mastra.getAgent('timmy');

	// Generate challenge using AI with job offer and configuration
	const challenge = await timmy.generate(
		`Create a technical challenge for ${jobOffer} with the following JSON config: ${jsonConfig}`,
	);

	// Return the generated challenge text
	return challenge.text;
}
