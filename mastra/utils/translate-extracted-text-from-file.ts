// Translation service configuration
import { translatorAgent } from '../agents/translator-agent';

export async function translateExtractedTextFromFile(extractedText: string) {
	const response = await translatorAgent.generate(extractedText);
	console.log('response', response);
	return response.text;
}
