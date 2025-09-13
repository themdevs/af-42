'use server';

import { mastra } from '../../../../../../../mastra';

export async function createFrontendChallenge(formData: FormData) {
	const jobOffer = formData.get('jobOffer')?.toString();
	const jsonConfig = formData.get('jsonConfig')?.toString();
	const agent = mastra.getAgent('frontendAgent');

	const challenge = await agent.generate(
		`Create a frontend challenge for ${jobOffer} with the following JSON config: ${jsonConfig}`,
	);

	return challenge.text;
}
