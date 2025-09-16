/**
 * Text Extraction API Endpoint
 *
 * This API endpoint extracts text content from uploaded files using multipart form data.
 * It supports various file formats and returns the extracted text along with metadata
 * such as file information and processing details. The endpoint includes file size
 * validation (50MB limit) and comprehensive error handling for robust file processing.
 *
 * @route POST /api/extract-text
 * @param file - The file to extract text from (via FormData)
 * @returns Extracted text content with metadata or error information
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromFile } from '@/mastra/utils/extract-text-from-file';

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 });
		}

		// Extract text from the file
		const result = await extractTextFromFile(file, {
			includeMetadata: true,
			maxFileSize: 50 * 1024 * 1024, // 50MB
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error('Text extraction error:', error);
		return NextResponse.json(
			{
				error: 'Text extraction failed',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
