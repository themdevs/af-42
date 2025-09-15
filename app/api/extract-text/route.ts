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
