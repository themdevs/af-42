import { extractTextFromPDF } from './extract-text-from-pdf';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

// TypeScript interfaces for the extraction result
export interface TextExtractionResult {
	success: boolean;
	fileName: string;
	fileType: string;
	fileSize: number;
	extractedText: string;
	metadata?: {
		pagesCount?: number;
		sheetsCount?: number;
		wordCount?: number;
		charCount?: number;
		extractionMethod?: string;
	};
	error?: string;
}

export interface FileProcessingOptions {
	includeMetadata?: boolean;
	maxFileSize?: number; // in bytes
	allowedTypes?: string[];
}

/**
 * Extracts text from various file types and returns structured JSON data
 * Supports: PDF, DOCX, DOC, TXT, MD, JSON, XLSX, XLS, PPTX, PPT, and image files
 */
export async function extractTextFromFile(
	file: File,
	options: FileProcessingOptions = {},
): Promise<TextExtractionResult> {
	const {
		includeMetadata = true,
		maxFileSize = 50 * 1024 * 1024, // 50MB default
		allowedTypes = [
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'text/plain',
			'text/markdown',
			'application/json',
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'application/vnd.ms-powerpoint',
			'application/vnd.openxmlformats-officedocument.presentationml.presentation',
			'image/jpeg',
			'image/png',
			'image/gif',
			'image/webp',
		],
	} = options;

	// Validate file
	if (!file) {
		return {
			success: false,
			fileName: '',
			fileType: '',
			fileSize: 0,
			extractedText: '',
			error: 'No file provided',
		};
	}

	if (file.size > maxFileSize) {
		return {
			success: false,
			fileName: file.name,
			fileType: file.type,
			fileSize: file.size,
			extractedText: '',
			error: `File size exceeds maximum allowed size of ${Math.round(maxFileSize / 1024 / 1024)}MB`,
		};
	}

	if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
		return {
			success: false,
			fileName: file.name,
			fileType: file.type,
			fileSize: file.size,
			extractedText: '',
			error: `File type ${file.type} is not supported`,
		};
	}

	try {
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		let extractedText = '';
		let metadata: TextExtractionResult['metadata'] = {};

		switch (file.type) {
			case 'application/pdf':
				const pdfResult = await extractTextFromPDF(buffer);
				extractedText = pdfResult.extractedText;
				metadata = {
					pagesCount: pdfResult.pagesCount,
					extractionMethod: 'pdf2json',
				};
				break;

			case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				const docxResult = await mammoth.extractRawText({ buffer });
				extractedText = docxResult.value;
				metadata = {
					extractionMethod: 'mammoth',
				};
				break;

			case 'application/msword':
				// For older .doc files, we'll try to extract as much as possible
				// Note: mammoth works best with .docx files
				try {
					const docResult = await mammoth.extractRawText({ buffer });
					extractedText = docResult.value;
					metadata = {
						extractionMethod: 'mammoth (limited support for .doc)',
					};
				} catch (error) {
					extractedText =
						'Unable to extract text from .doc file. Please convert to .docx format for better support.';
					metadata = {
						extractionMethod: 'unsupported',
					};
				}
				break;

			case 'text/plain':
			case 'text/markdown':
				extractedText = buffer.toString('utf-8');
				metadata = {
					extractionMethod: 'utf-8',
				};
				break;

			case 'application/json':
				try {
					const jsonData = JSON.parse(buffer.toString('utf-8'));
					extractedText = JSON.stringify(jsonData, null, 2);
					metadata = {
						extractionMethod: 'json-parse',
					};
				} catch (error) {
					extractedText = buffer.toString('utf-8');
					metadata = {
						extractionMethod: 'utf-8 (invalid json)',
					};
				}
				break;

			case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
			case 'application/vnd.ms-excel':
				const workbook = XLSX.read(buffer, { type: 'buffer' });
				const sheetNames = workbook.SheetNames;
				let allText = '';

				for (const sheetName of sheetNames) {
					const worksheet = workbook.Sheets[sheetName];
					const sheetData = XLSX.utils.sheet_to_txt(worksheet);
					allText += `\n--- Sheet: ${sheetName} ---\n${sheetData}\n`;
				}

				extractedText = allText.trim();
				metadata = {
					sheetsCount: sheetNames.length,
					extractionMethod: 'xlsx',
				};
				break;

			case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			case 'application/vnd.ms-powerpoint':
				// PowerPoint files are complex and would require additional libraries
				// For now, we'll return a message indicating limited support
				extractedText =
					'PowerPoint file detected. Text extraction from PowerPoint files requires additional processing. Please convert to PDF or extract text manually.';
				metadata = {
					extractionMethod: 'unsupported',
				};
				break;

			case 'image/jpeg':
			case 'image/png':
			case 'image/gif':
			case 'image/webp':
				// For images, we would need OCR capabilities
				// For now, we'll return a message indicating that OCR is needed
				extractedText =
					'Image file detected. Text extraction from images requires OCR (Optical Character Recognition) capabilities. Please use a tool that supports OCR or convert the image to PDF with text layer.';
				metadata = {
					extractionMethod: 'unsupported (requires OCR)',
				};
				break;

			default:
				// Try to extract as plain text for unknown types
				try {
					extractedText = buffer.toString('utf-8');
					metadata = {
						extractionMethod: 'utf-8 (unknown type)',
					};
				} catch (error) {
					extractedText = 'Unable to extract text from this file type.';
					metadata = {
						extractionMethod: 'unsupported',
					};
				}
		}

		// Calculate additional metadata if requested
		if (includeMetadata) {
			const wordCount = extractedText.split(/\s+/).filter((word) => word.length > 0).length;
			const charCount = extractedText.length;

			metadata = {
				...metadata,
				wordCount,
				charCount,
			};
		}

		return {
			success: true,
			fileName: file.name,
			fileType: file.type,
			fileSize: file.size,
			extractedText,
			metadata,
		};
	} catch (error) {
		return {
			success: false,
			fileName: file.name,
			fileType: file.type,
			fileSize: file.size,
			extractedText: '',
			error: error instanceof Error ? error.message : 'Unknown error occurred during text extraction',
		};
	}
}

/**
 * Utility function to get file type information
 */
export function getFileTypeInfo(file: File): {
	type: string;
	category: 'document' | 'spreadsheet' | 'presentation' | 'text' | 'image' | 'other';
	supported: boolean;
} {
	const type = file.type;
	let category: 'document' | 'spreadsheet' | 'presentation' | 'text' | 'image' | 'other' = 'other';
	let supported = false;

	if (type.includes('pdf') || type.includes('word') || type.includes('document')) {
		category = 'document';
		supported = true;
	} else if (type.includes('excel') || type.includes('spreadsheet')) {
		category = 'spreadsheet';
		supported = true;
	} else if (type.includes('powerpoint') || type.includes('presentation')) {
		category = 'presentation';
		supported = type.includes('openxml'); // Only .pptx is supported
	} else if (type.includes('text') || type.includes('json') || type.includes('markdown')) {
		category = 'text';
		supported = true;
	} else if (type.includes('image')) {
		category = 'image';
		supported = false; // Requires OCR
	}

	return { type, category, supported };
}

/**
 * Batch process multiple files
 */
export async function extractTextFromFiles(
	files: File[],
	options: FileProcessingOptions = {},
): Promise<TextExtractionResult[]> {
	const results: TextExtractionResult[] = [];

	for (const file of files) {
		try {
			const result = await extractTextFromFile(file, options);
			results.push(result);
		} catch (error) {
			results.push({
				success: false,
				fileName: file.name,
				fileType: file.type,
				fileSize: file.size,
				extractedText: '',
				error: error instanceof Error ? error.message : 'Unknown error',
			});
		}
	}

	return results;
}
