'use server';

import { mastra } from '../../../../../../../mastra';

export async function createTechChallenge(jobOffer: string, jsonConfig: string) {
	const agent = mastra.getAgent('timmy');

	const challenge = await agent.generate(
		`Create a technical challenge for ${jobOffer} with the following JSON config: ${jsonConfig}`,
	);

	return challenge.text;
}
