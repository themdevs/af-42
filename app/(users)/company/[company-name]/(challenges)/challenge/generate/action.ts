'use server';

import { mastra } from '../../../../../../../mastra';

export async function createFrontendChallenge(jobOffer: string, jsonConfig: string) {
	const agent = mastra.getAgent('frontendAgent');

	const challenge = await agent.generate(
		`Create a frontend challenge for ${jobOffer} with the following JSON config: ${jsonConfig}`,
	);

	return challenge.text;
}


export async function createBackendChallenge(jobOffer: string, jsonConfig: string) {
	const agent = mastra.getAgent('backendAgent');

	const challenge = await agent.generate(
		`Create a backend challenge for ${jobOffer} with the following JSON config: ${jsonConfig}`,
	);

	return challenge.text;
}
