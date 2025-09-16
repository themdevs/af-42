import { NextRequest, NextResponse } from 'next/server';
import { extractTechStackFromTranslatedText } from '@/mastra/utils/extract-tech-stack-from-translated-text';

export async function POST(request: NextRequest) {
	try {
		const { translatedText, existingJsonConfig } = await request.json();

		if (!translatedText || typeof translatedText !== 'string') {
			return NextResponse.json({ error: 'translatedText is required and must be a string' }, { status: 400 });
		}

		// Parse existing JSON config if provided
		let existingJson;
		try {
			existingJson = existingJsonConfig ? JSON.parse(existingJsonConfig) : undefined;
		} catch (parseError) {
			console.warn('Failed to parse existing JSON config:', parseError);
			existingJson = undefined;
		}

		// Extract tech stack from translated text
		const result = await extractTechStackFromTranslatedText(translatedText, existingJson);

		if (result.success) {
			return NextResponse.json({
				success: true,
				techStack: result.techStack,
				metadata: result.metadata,
			});
		} else {
			return NextResponse.json(
				{
					success: false,
					error: result.error,
					metadata: result.metadata,
				},
				{ status: 400 },
			);
		}
	} catch (error) {
		console.error('Tech stack extraction API error:', error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error occurred',
			},
			{ status: 500 },
		);
	}
}
