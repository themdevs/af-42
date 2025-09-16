'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createFrontendChallenge } from '@/app/(users)/company/[company-name]/(challenges)/challenge/generate/action';
import { useState } from 'react';
import { DataSelectionComponent } from '@/components/challenge-generator/data-selection-component';
import { FileTextExtractor } from '@/components/file-text-extractor';
import { TextExtractionResult } from '@/mastra/utils/extract-text-from-file';

const formSchema = z.object({
	jobOfferFile: z.instanceof(File).optional(),
	extractedText: z.string().optional(),
	jsonConfig: z.string().optional(),
});

export function TaskGeneratorForm() {
	const [result, setResult] = useState<string | null>(null);
	const [jsonConfig, setJsonConfig] = useState<string>('');
	const [extractedText, setExtractedText] = useState<string>('');
	const [translatedText, setTranslatedText] = useState<string>('');
	const [isTranslating, setIsTranslating] = useState<boolean>(false);
	const [translationError, setTranslationError] = useState<string | null>(null);

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			jobOfferFile: undefined,
			extractedText: '',
			jsonConfig: '',
		},
	});

	// Handle JSON config changes from DataSelectionComponent
	const handleJsonChange = (json: string) => {
		setJsonConfig(json);
		form.setValue('jsonConfig', json);
	};

	// Handle text extraction result
	const handleTextExtracted = async (result: TextExtractionResult) => {
		if (result.success) {
			setExtractedText(result.extractedText);
			form.setValue('extractedText', result.extractedText);

			// Automatically translate the extracted text
			setIsTranslating(true);
			setTranslationError(null);
			try {
				const response = await fetch('/api/translate-text', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ text: result.extractedText }),
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.error || 'Translation failed');
				}

				const { translatedText } = await response.json();
				setTranslatedText(translatedText);
			} catch (error) {
				console.error('Translation failed:', error);
				setTranslationError(error instanceof Error ? error.message : 'Translation failed');
			} finally {
				setIsTranslating(false);
			}
		} else {
			setExtractedText('');
			form.setValue('extractedText', '');
			setTranslatedText('');
			setTranslationError(null);
		}
	};

	// todo: define a way to select the right agent for the task
	// 2. Define a submit handler.
	async function handleSubmit(formData: z.infer<typeof formSchema>) {
		let jobOfferContent = '';

		// Use extracted text if available, otherwise fall back to reading file content
		if (formData.extractedText) {
			jobOfferContent = formData.extractedText;
		} else if (formData.jobOfferFile) {
			// Read file content as fallback
			jobOfferContent = await formData.jobOfferFile.text();
		}

		const res = await createFrontendChallenge(jobOfferContent, jsonConfig || '');
		setResult(res);
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="extractedText"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Text Extraction</FormLabel>
								<FormControl>
									<FileTextExtractor onTextExtracted={handleTextExtracted} />
								</FormControl>
								<FormDescription>
									Extract and process text from your uploaded document for better analysis
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Translation Status */}
					{(isTranslating || translatedText || translationError) && (
						<FormItem>
							<FormLabel>Translation Status</FormLabel>
							<FormControl>
								<div className="min-h-[100px] border rounded-lg p-4 bg-muted/50">
									{isTranslating ? (
										<div className="flex items-center justify-center h-full text-muted-foreground">
											<div className="flex items-center gap-2">
												<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
												Translating extracted text...
											</div>
										</div>
									) : translationError ? (
										<div className="text-red-600 text-sm">
											<strong>Translation Error:</strong> {translationError}
										</div>
									) : translatedText ? (
										<div className="space-y-2">
											<div className="text-sm text-green-600 font-medium">
												✓ Translation completed successfully
											</div>
											<details className="group">
												<summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
													View Translated Text ({translatedText.length} characters)
												</summary>
												<div className="mt-2 p-3 bg-background rounded-md max-h-60 overflow-y-auto">
													<pre className="text-xs whitespace-pre-wrap break-words">
														{translatedText}
													</pre>
												</div>
											</details>
										</div>
									) : null}
								</div>
							</FormControl>
							<FormDescription>
								The extracted text is automatically translated for better processing
							</FormDescription>
						</FormItem>
					)}

					<FormItem>
						<DataSelectionComponent onJsonChange={handleJsonChange} />
						<FormLabel>JSON Config</FormLabel>
						<FormDescription>
							<span className="font-bold">Important: </span>
							This JSON config is automatically generated from your selections above and will be used to
							generate the challenge.
						</FormDescription>

						<FormControl>
							<div className="min-h-[200px] border rounded-lg p-4 bg-muted/50">
								{jsonConfig ? (
									<pre className="text-sm font-mono whitespace-pre-wrap overflow-auto">
										{jsonConfig}
									</pre>
								) : (
									<div className="flex items-center justify-center h-full text-muted-foreground">
										Select items from the data selection component above to generate JSON config
									</div>
								)}
							</div>
						</FormControl>
					</FormItem>
					<Button type="submit">Submit</Button>
				</form>
			</Form>
			{result && <pre>{result}</pre>}
		</>
	);
}
