/**
 * Client-side file utilities that don't require server-side dependencies
 */

export interface FileTypeInfo {
	type: string;
	category: 'document' | 'spreadsheet' | 'presentation' | 'text' | 'image' | 'other';
	supported: boolean;
}

/**
 * Get file type information without server-side dependencies
 */
export function getFileTypeInfo(file: File): FileTypeInfo {
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
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file icon emoji based on file extension
 */
export function getFileIcon(file: File): string {
	const extension = file.name.split('.').pop()?.toLowerCase();
	switch (extension) {
		case 'pdf':
			return '📄';
		case 'doc':
		case 'docx':
			return '📝';
		case 'txt':
		case 'md':
			return '📄';
		case 'json':
			return '📋';
		case 'xls':
		case 'xlsx':
			return '📊';
		case 'ppt':
		case 'pptx':
			return '📽️';
		case 'jpg':
		case 'jpeg':
		case 'png':
		case 'gif':
		case 'webp':
			return '🖼️';
		default:
			return '📁';
	}
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSizeInMB: number): { valid: boolean; error?: string } {
	const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
	if (file.size > maxSizeInBytes) {
		return {
			valid: false,
			error: `File size must be less than ${maxSizeInMB}MB`,
		};
	}
	return { valid: true };
}

/**
 * Validate file type
 */
export function validateFileType(file: File, allowedTypes: string[]): { valid: boolean; error?: string } {
	if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
		return {
			valid: false,
			error: `File type ${file.type} is not supported`,
		};
	}
	return { valid: true };
}
