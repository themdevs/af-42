import { makeRequest } from '@/utils/make-requests';


export async function translateExtractedTextFromFile(extractedText: string, targetLanguage: string) {
	const response = await fetch('/api/translate', {
		method: 'POST',
		body: JSON.stringify({ extractedText, targetLanguage }),
	});
}
