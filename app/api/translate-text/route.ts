import { NextRequest, NextResponse } from 'next/server';
import {
	translateExtractedTextFromFile,
	type TranslationResult,
} from '@/mastra/utils/translate-extracted-text-from-file';

export async function POST(request: NextRequest) {
	try {
		// Parse request body
		let body;
		try {
			body = await request.json();
		} catch (parseError) {
			return NextResponse.json(
				{
					error: 'Invalid JSON in request body',
					success: false,
				},
				{ status: 400 },
			);
		}

		const { text } = body;

		// Basic validation (additional validation happens in the translation function)
		if (!text || typeof text !== 'string') {
			return NextResponse.json(
				{
					error: 'Text is required and must be a string',
					success: false,
				},
				{ status: 400 },
			);
		}

		// Call the improved translation function
		const result: TranslationResult = await translateExtractedTextFromFile(text);

		// Return appropriate response based on translation result
		if (result.success) {
			return NextResponse.json({
				success: true,
				translatedText: result.translatedText,
				metadata: result.metadata,
			});
		} else {
			// Determine appropriate HTTP status code based on error type
			let statusCode = 500; // Default to internal server error

			if (
				result.error?.includes('exceeds maximum length') ||
				result.error?.includes('must be at least') ||
				result.error?.includes('cannot be empty') ||
				result.error?.includes('only whitespace')
			) {
				statusCode = 400; // Bad request for validation errors
			} else if (result.error?.includes('authentication failed')) {
				statusCode = 401; // Unauthorized
			} else if (result.error?.includes('temporarily unavailable')) {
				statusCode = 503; // Service unavailable
			}

			return NextResponse.json(
				{
					success: false,
					error: result.error,
					metadata: result.metadata,
				},
				{ status: statusCode },
			);
		}
	} catch (error) {
		console.error('Translation API error:', {
			error: error instanceof Error ? error.message : 'Unknown error',
			timestamp: new Date().toISOString(),
			stack: error instanceof Error ? error.stack : undefined,
		});

		return NextResponse.json(
			{
				success: false,
				error: 'An unexpected error occurred while processing the translation request',
			},
			{ status: 500 },
		);
	}
}
