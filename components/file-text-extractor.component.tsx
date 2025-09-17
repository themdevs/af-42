/*  FileTextExtractor Component
    A React component that provides a user interface for uploading files and extracting text content from them.
    Supports various file types including PDFs, Word documents, text files, and more. The component handles
    file upload, displays file metadata, and shows extraction results with detailed statistics like word count,
    character count, and page count. Users can view the extracted text in a collapsible section.
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileUploaderComponent } from './file-uploader.component';
import { type TextExtractionResult } from '@/mastra/utils/extract-text-from-file';
import { formatFileSize } from '@/lib/file-utils';
import { Loader2, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface FileTextExtractorProps {
	onTextExtracted?: (result: TextExtractionResult) => void;
	className?: string;
}

export const FileTextExtractor = ({ onTextExtracted, className }: FileTextExtractorProps) => {
	// State for the currently selected file
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	// State for storing text extraction results
	const [extractionResult, setExtractionResult] = useState<TextExtractionResult | null>(null);
	// State to track extraction loading state
	const [isExtracting, setIsExtracting] = useState(false);

	// Handle file selection and reset previous results
	const handleFileSelect = (file: File | null) => {
		setSelectedFile(file);
		setExtractionResult(null);
	};

	// Main function to handle text extraction from uploaded file
	const handleExtractText = async () => {
		if (!selectedFile) return;

		setIsExtracting(true);
		try {
			// Create FormData to send file to API
			const formData = new FormData();
			formData.append('file', selectedFile);

			// Call the text extraction API endpoint
			const response = await fetch('/api/extract-text', {
				method: 'POST',
				body: formData,
			});

			// Handle API errors
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to extract text');
			}

			// Parse successful response and update state
			const result: TextExtractionResult = await response.json();

			setExtractionResult(result);

			// Notify parent component of successful extraction
			onTextExtracted?.(result);
		} catch (error) {
			console.error('Text extraction failed:', error);

			// Create error result object for display
			setExtractionResult({
				success: false,
				fileName: selectedFile.name,
				fileType: selectedFile.type,
				fileSize: selectedFile.size,
				extractedText: '',
				error: error instanceof Error ? error.message : 'Unknown error occurred',
			});
		} finally {
			// Always reset loading state
			setIsExtracting(false);
		}
	};

	return (
		<div className={className}>
			<Card>
				{/* Header with title and icon */}
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="h-5 w-5" />
						Text Extraction Tool
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* File upload component with size limit */}
					<FileUploaderComponent
						onFileSelect={handleFileSelect}
						maxFileSize={50} // 50MB
						disabled={isExtracting}
					/>

					{/* Show file details and extract button when file is selected */}
					{selectedFile && (
						<div className="space-y-3">
							{/* File info display and extract button */}
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<span className="text-sm font-medium">{selectedFile.name}</span>
									<Badge variant="secondary">{formatFileSize(selectedFile.size)}</Badge>
									<Badge variant="outline">{selectedFile.type}</Badge>
								</div>
								<Button
									onClick={handleExtractText}
									disabled={isExtracting}
									className="flex items-center gap-2"
								>
									{/* Show loading spinner during extraction */}
									{isExtracting ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin" />
											Extracting...
										</>
									) : (
										'Extract Text'
									)}
								</Button>
							</div>

							{/* Display extraction results if available */}
							{extractionResult && (
								<Card
									className={
										extractionResult.success
											? 'border-green-200 bg-green-50/50' // Green styling for success
											: 'border-red-200 bg-red-50/50' // Red styling for errors
									}
								>
									<CardContent className="p-4">
										<div className="flex items-start gap-3">
											{/* Success/error icon */}
											{extractionResult.success ? (
												<CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
											) : (
												<AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
											)}
											<div className="flex-1 space-y-2">
												{/* Status message and extraction method badge */}
												<div className="flex items-center gap-2">
													<span className="font-medium">
														{extractionResult.success
															? 'Text Extracted Successfully'
															: 'Extraction Failed'}
													</span>
													{/* Show extraction method if available */}
													{extractionResult.metadata?.extractionMethod && (
														<Badge variant="outline" className="text-xs">
															{extractionResult.metadata.extractionMethod}
														</Badge>
													)}
												</div>

												{extractionResult.success ? (
													<div className="space-y-2">
														{/* Grid layout for extraction metadata stats */}
														<div className="grid grid-cols-2 gap-4 text-sm">
															{/* Word count display */}
															{extractionResult.metadata?.wordCount && (
																<div>
																	<span className="text-muted-foreground">
																		Words:
																	</span>
																	<span className="ml-2 font-medium">
																		{extractionResult.metadata.wordCount}
																	</span>
																</div>
															)}
															{/* Character count display */}
															{extractionResult.metadata?.charCount && (
																<div>
																	<span className="text-muted-foreground">
																		Characters:
																	</span>
																	<span className="ml-2 font-medium">
																		{extractionResult.metadata.charCount}
																	</span>
																</div>
															)}
															{/* Page count display for documents */}
															{extractionResult.metadata?.pagesCount && (
																<div>
																	<span className="text-muted-foreground">
																		Pages:
																	</span>
																	<span className="ml-2 font-medium">
																		{extractionResult.metadata.pagesCount}
																	</span>
																</div>
															)}
															{/* Sheet count display for spreadsheets */}
															{extractionResult.metadata?.sheetsCount && (
																<div>
																	<span className="text-muted-foreground">
																		Sheets:
																	</span>
																	<span className="ml-2 font-medium">
																		{extractionResult.metadata.sheetsCount}
																	</span>
																</div>
															)}
														</div>

														{/* Collapsible text viewer section */}
														<div className="mt-3">
															<details className="group">
																{/* Clickable summary with character count */}
																<summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
																	View Extracted Text (
																	{extractionResult.extractedText.length} characters)
																</summary>
																{/* Scrollable text content area */}
																<div className="mt-2 p-3 bg-muted rounded-md max-h-60 overflow-y-auto">
																	<pre className="text-xs whitespace-pre-wrap break-words">
																		{extractionResult.extractedText}
																	</pre>
																</div>
															</details>
														</div>
													</div>
												) : (
													<div className="text-sm text-red-600">
														{/* Error message display */}
														{extractionResult.error}
													</div>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};
