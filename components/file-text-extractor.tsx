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
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [extractionResult, setExtractionResult] = useState<TextExtractionResult | null>(null);
	const [isExtracting, setIsExtracting] = useState(false);

	const handleFileSelect = (file: File | null) => {
		setSelectedFile(file);
		setExtractionResult(null);
	};

	const handleExtractText = async () => {
		if (!selectedFile) return;

		setIsExtracting(true);
		try {
			// Create FormData to send file to API
			const formData = new FormData();
			formData.append('file', selectedFile);

			// Call the API route
			const response = await fetch('/api/extract-text', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to extract text');
			}

			const result: TextExtractionResult = await response.json();
			console.log('result', result);

			setExtractionResult(result);
			onTextExtracted?.(result);
		} catch (error) {
			console.error('Text extraction failed:', error);
			setExtractionResult({
				success: false,
				fileName: selectedFile.name,
				fileType: selectedFile.type,
				fileSize: selectedFile.size,
				extractedText: '',
				error: error instanceof Error ? error.message : 'Unknown error occurred',
			});
		} finally {
			setIsExtracting(false);
		}
	};

	return (
		<div className={className}>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="h-5 w-5" />
						Text Extraction Tool
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<FileUploaderComponent
						onFileSelect={handleFileSelect}
						maxFileSize={50} // 50MB
						disabled={isExtracting}
					/>

					{selectedFile && (
						<div className="space-y-3">
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

							{extractionResult && (
								<Card
									className={
										extractionResult.success
											? 'border-green-200 bg-green-50/50'
											: 'border-red-200 bg-red-50/50'
									}
								>
									<CardContent className="p-4">
										<div className="flex items-start gap-3">
											{extractionResult.success ? (
												<CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
											) : (
												<AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
											)}
											<div className="flex-1 space-y-2">
												<div className="flex items-center gap-2">
													<span className="font-medium">
														{extractionResult.success
															? 'Text Extracted Successfully'
															: 'Extraction Failed'}
													</span>
													{extractionResult.metadata?.extractionMethod && (
														<Badge variant="outline" className="text-xs">
															{extractionResult.metadata.extractionMethod}
														</Badge>
													)}
												</div>

												{extractionResult.success ? (
													<div className="space-y-2">
														<div className="grid grid-cols-2 gap-4 text-sm">
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

														<div className="mt-3">
															<details className="group">
																<summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
																	View Extracted Text (
																	{extractionResult.extractedText.length} characters)
																</summary>
																<div className="mt-2 p-3 bg-muted rounded-md max-h-60 overflow-y-auto">
																	<pre className="text-xs whitespace-pre-wrap break-words">
																		{extractionResult.extractedText}
																	</pre>
																</div>
															</details>
														</div>
													</div>
												) : (
													<div className="text-sm text-red-600">{extractionResult.error}</div>
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
