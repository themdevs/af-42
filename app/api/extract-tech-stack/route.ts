/**
 * Tech Stack Extraction API Endpoint
 *
 * This API endpoint extracts technology stack information from translated job descriptions or text content.
 * It accepts translated text and optionally an existing JSON configuration, then uses AI-powered analysis
 * to identify and categorize technologies mentioned in the content. The endpoint returns structured
 * tech stack data that can be used for job matching, skill assessment, or technology categorization.
 *
 * @route POST /api/extract-tech-stack
 * @param translatedText - The translated text content to analyze
 * @param existingJsonConfig - Optional existing JSON configuration to merge with extracted data
 * @returns Structured tech stack data with success/error status and metadata
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractTechStackFromFormattedText } from '@/mastra/utils/extract-tech-stack-from-formatted-text';

export async function POST(request: NextRequest) {
	try {
		const { formattedText, existingJsonConfig } = await request.json();

		if (!formattedText || typeof formattedText !== 'string') {
			return NextResponse.json({ error: 'formatted text is required and must be a string' }, { status: 400 });
		}

		// Parse existing JSON config if provided
		let existingJson;
		try {
			existingJson = existingJsonConfig ? JSON.parse(existingJsonConfig) : undefined;
		} catch (parseError) {
			console.warn('Failed to parse existing JSON config:', parseError);
			existingJson = undefined;
		}

		// Extract tech stack from formatted text
		const result = await extractTechStackFromFormattedText(formattedText, existingJson);

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
