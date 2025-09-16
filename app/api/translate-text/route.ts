import { NextRequest, NextResponse } from 'next/server';
import { translateExtractedTextFromFile } from '@/mastra/utils/translate-extracted-text-from-file';

export async function POST(request: NextRequest) {
	try {
		const { text } = await request.json();

		if (!text || typeof text !== 'string') {
			return NextResponse.json({ error: 'Text is required and must be a string' }, { status: 400 });
		}

		const translatedText = await translateExtractedTextFromFile(text);

		return NextResponse.json({ translatedText });
	} catch (error) {
		console.error('Translation API error:', error);
		return NextResponse.json({ error: 'Failed to translate text' }, { status: 500 });
	}
}
