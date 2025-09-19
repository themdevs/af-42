'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createTechChallenge } from '@/app/(users)/company/[company-name]/(challenges)/challenge/generate/action';
import { useState } from 'react';
import { DataSelectionComponent } from '@/components/challenge-generator/data-selection.component';
import { FileTextExtractor } from '@/components/file-text-extractor.component';
import { TextExtractionResult } from '@/mastra/utils/extract-text-from-file';
import { formatTextToMarkdown } from '@/mastra/utils/format-text-to-markdown';

// Define the StackSelectionJson type locally to avoid importing Mastra utilities in client component
interface StackSelectionJson {
	role_title?: string;
	seniority?: 'junior' | 'mid' | 'senior';
	primary_stack?: string[];
	secondary_stack?: string[];
	domain?: string;
	difficulty?: 'junior' | 'mid' | 'senior';
	focus_areas?: string[];
	non_goals?: string[];
	company_context_priority?: string;
	evaluation_mode?: string;
	deliverable_format?: string;
	output_language?: string;
	privacy_constraints?: string[];
	inclusion_requirements?: string[];
	prohibited_items?: string[];
	extra_credit_themes?: string[];
	technical_stack?: string[];
	[key: string]: any;
}

const formSchema = z.object({
	jobOfferFile: z.instanceof(File).optional(),
	extractedText: z.string().optional(),
	jsonConfig: z.string().optional(),
});

export function TaskGeneratorFormFromDataSelection() {
	const [result, setResult] = useState<string | null>(null);
	const [jsonConfig, setJsonConfig] = useState<string>('');
	const [extractedText, setExtractedText] = useState<string>('');
	const [translatedText, setTranslatedText] = useState<string>('');
	const [isTranslating, setIsTranslating] = useState<boolean>(false);
	const [translationError, setTranslationError] = useState<string | null>(null);
	const [isExtractingTechStack, setIsExtractingTechStack] = useState<boolean>(false);
	const [techStackError, setTechStackError] = useState<string | null>(null);
	const [extractedTechStack, setExtractedTechStack] = useState<StackSelectionJson | null>(null);

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

	// Automatically extract tech stack from formatted text and merge with existing JSON config
	const extractAndMergeTechStack = async (formattedText: string, existingJsonConfig: string) => {
		if (!formattedText || formattedText.trim() === '') {
			return;
		}

		setIsExtractingTechStack(true);
		setTechStackError(null);

		try {
			// Call the API route to extract tech stack
			const response = await fetch('/api/extract-tech-stack', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					formattedText,
					existingJsonConfig,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Tech stack extraction failed');
			}

			const result = await response.json();

			if (result.success && result.techStack) {
				setExtractedTechStack(result.techStack);

				// Update the JSON config with the extracted tech stack
				const mergedJsonString = JSON.stringify(result.techStack, null, 2);
				setJsonConfig(mergedJsonString);
				form.setValue('jsonConfig', mergedJsonString);

				console.log('✅ Tech stack extracted and merged successfully:', result.techStack);
			} else {
				setTechStackError(result.error || 'Failed to extract tech stack');
				console.error('❌ Tech stack extraction failed:', result.error);
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			setTechStackError(errorMessage);
			console.error('❌ Tech stack extraction error:', error);
		} finally {
			setIsExtractingTechStack(false);
		}
	};

	// Handle text extraction result
	const handleTextExtracted = async (result: TextExtractionResult) => {
		if (result.success) {
			setExtractedText(result.extractedText);
			form.setValue('extractedText', result.extractedText);

			// Automatically translate the extracted text
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

				const formattedText = formatTextToMarkdown(translatedText);

				// Automatically extract tech stack from formatted text and merge with exiMergeTechStack(formattedText, jsonConfig);
				const techStack = await extractAndMergeTechStack(formattedText, jsonConfig);
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

		const res = await createTechChallenge(jobOfferContent, jsonConfig || '');
		setResult(res);
	}

	return (
		<>
			<DataSelectionComponent onJsonChange={handleJsonChange} />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 flex flex-col gap-4">
					<FormItem>
						<FormLabel>JSON Config</FormLabel>
						<FormDescription>
							<span className="font-bold">Important: </span>
							This JSON config is automatically generated from your selections above and tech stack
							extraction from translated text. It will be used to generate the challenge.
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
			<div className="mt-4 max-w-6xl border rounded-lg p-4 bg-muted/50">
				<h1 className="text-2xl text-green-600 font-bold pb-4">Result:</h1>
				<pre className="text-lg font-mono whitespace-pre-wrap overflow-auto mt-4">{result}</pre>
			</div>
		</>
	);
}
