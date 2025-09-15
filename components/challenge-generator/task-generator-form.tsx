'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createFrontendChallenge } from '@/app/(users)/company/[company-name]/(challenges)/challenge/generate/action';
import { useState } from 'react';
import { DataSelectionComponent } from '@/components/challenge-generator/data-selection-component';
import { FileUploaderComponent } from '@/components/file-uploader.component';
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
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [extractedText, setExtractedText] = useState<string>('');

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

	// Handle file selection
	const handleFileSelect = (file: File | null) => {
		setUploadedFile(file);
		form.setValue('jobOfferFile', file || undefined);
	};

	// Handle text extraction result
	const handleTextExtracted = (result: TextExtractionResult) => {
		if (result.success) {
			setExtractedText(result.extractedText);
			form.setValue('extractedText', result.extractedText);
		} else {
			setExtractedText('');
			form.setValue('extractedText', '');
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
						name="jobOfferFile"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Job Offer Document</FormLabel>
								<FormControl>
									<FileUploaderComponent onFileSelect={handleFileSelect} maxFileSize={10} />
								</FormControl>
								<FormDescription>
									Upload your job offer document (PDF, Word, text files, etc.)
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
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
