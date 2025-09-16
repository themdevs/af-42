/**
 * Example Usage of Tech Stack Extraction Function
 *
 * This file demonstrates how to use the extractTechStackFromTranslatedText function
 * to automatically extract tech stack from translated text and populate JSON objects.
 */

import { extractTechStackFromTranslatedText, type StackSelectionJson } from './extract-tech-stack-from-translated-text';

// Example 1: Basic usage with translated text
export async function basicExample() {
	const translatedText = `
		We are looking for a Senior Frontend Developer with experience in React, TypeScript, and Next.js.
		The ideal candidate should have knowledge of modern frontend technologies including:
		- React 18+ with hooks and functional components
		- TypeScript for type safety
		- Next.js for SSR and SSG
		- Tailwind CSS for styling
		- Jest and Cypress for testing
		- Git for version control
		- AWS for cloud deployment
	`;

	try {
		const result = await extractTechStackFromTranslatedText(translatedText);

		if (result.success && result.techStack) {
			console.log('✅ Tech stack extracted successfully!');
			console.log('Role:', result.techStack.role_title);
			console.log('Seniority:', result.techStack.seniority);
			console.log('Primary Stack:', result.techStack.primary_stack);
			console.log('Secondary Stack:', result.techStack.secondary_stack);
			console.log('Technical Stack:', result.techStack.technical_stack);

			return result.techStack;
		} else {
			console.error('❌ Extraction failed:', result.error);
			return null;
		}
	} catch (error) {
		console.error('❌ Unexpected error:', error);
		return null;
	}
}

// Example 2: Usage with existing JSON object
export async function mergeWithExistingJson() {
	const translatedText = `
		Backend Developer position requiring Python, Django, PostgreSQL, Docker, and Kubernetes.
		Experience with AWS, Redis, and Elasticsearch is preferred.
	`;

	const existingJson: StackSelectionJson = {
		role_title: 'Software Engineer',
		domain: 'E-commerce Platform',
		focus_areas: ['API Development', 'Database Design'],
		company_context_priority: 'strict',
		evaluation_mode: 'mixed',
		deliverable_format: 'repo',
		output_language: 'en',
	};

	try {
		const result = await extractTechStackFromTranslatedText(translatedText, existingJson);

		if (result.success && result.techStack) {
			console.log('✅ Tech stack merged with existing JSON!');
			console.log('Merged JSON:', JSON.stringify(result.techStack, null, 2));

			return result.techStack;
		} else {
			console.error('❌ Merge failed:', result.error);
			return null;
		}
	} catch (error) {
		console.error('❌ Unexpected error:', error);
		return null;
	}
}

// Example 3: Integration with file text extraction workflow (Client-side)
export async function integrationExampleClientSide(extractedText: string) {
	// This would typically be called after text extraction from a file
	// and after translation (if needed) - from a client component

	try {
		const response = await fetch('/api/extract-tech-stack', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				translatedText: extractedText,
				existingJsonConfig: '',
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || 'Tech stack extraction failed');
		}

		const result = await response.json();

		if (result.success && result.techStack) {
			// The techStack object is now ready to be used in the stack selection tool
			// or passed to other components that need structured tech stack data

			return {
				success: true,
				stackSelectionJson: result.techStack,
				metadata: result.metadata,
			};
		} else {
			return {
				success: false,
				error: result.error,
				metadata: result.metadata,
			};
		}
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
			metadata: {
				originalLength: extractedText.length,
				processingTimeMs: 0,
				extractedCount: 0,
			},
		};
	}
}

// Example 3b: Integration with file text extraction workflow (Server-side)
export async function integrationExampleServerSide(extractedText: string) {
	// This would typically be called after text extraction from a file
	// and after translation (if needed) - from a server component or API route

	const result = await extractTechStackFromTranslatedText(extractedText);

	if (result.success && result.techStack) {
		// The techStack object is now ready to be used in the stack selection tool
		// or passed to other components that need structured tech stack data

		return {
			success: true,
			stackSelectionJson: result.techStack,
			metadata: result.metadata,
		};
	} else {
		return {
			success: false,
			error: result.error,
			metadata: result.metadata,
		};
	}
}

// Example 4: Error handling demonstration
export async function errorHandlingExample() {
	const invalidText = ''; // Empty text to trigger validation error

	try {
		const result = await extractTechStackFromTranslatedText(invalidText);

		if (!result.success) {
			console.log('Expected error caught:', result.error);
			console.log('Metadata:', result.metadata);
		}

		return result;
	} catch (error) {
		console.error('Unexpected error:', error);
		return {
			success: false,
			error: 'Unexpected error occurred',
			metadata: {
				originalLength: 0,
				processingTimeMs: 0,
				extractedCount: 0,
			},
		};
	}
}

// Example 5: Batch processing multiple texts
export async function batchProcessingExample(texts: string[]) {
	const results = [];

	for (const text of texts) {
		try {
			const result = await extractTechStackFromTranslatedText(text);
			results.push({
				text: text.substring(0, 100) + '...', // Truncate for logging
				result,
			});
		} catch (error) {
			results.push({
				text: text.substring(0, 100) + '...',
				result: {
					success: false,
					error: 'Processing failed',
					metadata: {
						originalLength: text.length,
						processingTimeMs: 0,
						extractedCount: 0,
					},
				},
			});
		}
	}

	return results;
}

// Export all examples for easy testing
export const examples = {
	basic: basicExample,
	merge: mergeWithExistingJson,
	integrationClientSide: integrationExampleClientSide,
	integrationServerSide: integrationExampleServerSide,
	errorHandling: errorHandlingExample,
	batchProcessing: batchProcessingExample,
};
