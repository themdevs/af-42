'use server';

import { mastra } from '@/mastra';

export async function getQuestions(formData: FormData) {
	const text = formData.get('text')?.toString();
	const agent = mastra.getAgent('textQuestionAgent');

	const result = await agent.generate(`Generate 10 questions from the following text: ${text}`);

	return result.text;
}
