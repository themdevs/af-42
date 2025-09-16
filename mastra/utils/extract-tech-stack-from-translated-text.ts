/**
 * Tech Stack Extraction Utility for Translated Text
 *
 * This module provides a comprehensive function to extract technical stack information from translated text
 * using the Mastra tech stack extractor agent. It automatically analyzes job descriptions, technical
 * specifications, and requirements to identify technologies, frameworks, tools, and methodologies. The
 * extracted information is then formatted into a structured JSON object compatible with the stack selection
 * tool, including role titles, seniority levels, primary/secondary tech stacks, and challenge-specific
 * metadata. The utility includes robust error handling, input validation, retry logic with exponential
 * backoff, and timeout protection to ensure reliable operation in production environments.
 *
 * Key Features:
 * - AI-powered tech stack extraction using Mastra agents
 * - Automatic JSON object population for stack selection tools
 * - Comprehensive error handling with user-friendly messages
 * - Retry mechanism with exponential backoff for transient failures
 * - Timeout protection (30 seconds default)
 * - Type-safe interfaces and full TypeScript support
 * - Performance monitoring and detailed metadata
 * - Merge capability with existing JSON objects
 *
 * @author AF42 Development Team
 * @version 1.0.0
 */

import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Define interfaces for better type safety
interface TechStackExtractionResult {
	success: boolean;
	techStack?: {
		role_title?: string;
		seniority?: 'junior' | 'mid' | 'senior';
		tech_stack?: {
			languages: string[];
			frameworks: string[];
			databases: string[];
			devops: string[];
			cloud: string[];
			testing: string[];
			tools: string[];
			other: string[];
		};
		assumptions?: string[];
	};
	error?: string;
	metadata?: {
		originalLength: number;
		processingTimeMs: number;
		extractedCount: number;
	};
}

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

// Configuration constants
const CONFIG = {
	MAX_TEXT_LENGTH: 50000,
	MIN_TEXT_LENGTH: 10,
	TIMEOUT_MS: 30000,
	RETRY_ATTEMPTS: 3,
	RETRY_DELAY_MS: 1000,
} as const;

/**
 * Validates input text for tech stack extraction
 */
function validateInput(text: string): { isValid: boolean; error?: string } {
	if (typeof text !== 'string') {
		return { isValid: false, error: 'Input must be a string' };
	}

	if (!text || text.trim() === '') {
		return { isValid: false, error: 'Input text cannot be empty' };
	}

	if (text.length < CONFIG.MIN_TEXT_LENGTH) {
		return { isValid: false, error: `Text must be at least ${CONFIG.MIN_TEXT_LENGTH} characters long` };
	}

	if (text.length > CONFIG.MAX_TEXT_LENGTH) {
		return { isValid: false, error: `Text exceeds maximum length of ${CONFIG.MAX_TEXT_LENGTH} characters` };
	}

	return { isValid: true };
}

/**
 * Creates a timeout promise for the extraction request
 */
function createTimeoutPromise(timeoutMs: number): Promise<never> {
	return new Promise((_, reject) => {
		setTimeout(() => {
			reject(new Error(`Tech stack extraction request timed out after ${timeoutMs}ms`));
		}, timeoutMs);
	});
}

/**
 * Retries a function with exponential backoff
 */
async function retryWithBackoff<T>(
	fn: () => Promise<T>,
	attempts: number = CONFIG.RETRY_ATTEMPTS,
	delayMs: number = CONFIG.RETRY_DELAY_MS,
): Promise<T> {
	let lastError: Error;

	for (let attempt = 1; attempt <= attempts; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error as Error;

			// Don't retry on certain types of errors
			if (error instanceof Error) {
				const errorMessage = error.message.toLowerCase();
				if (
					errorMessage.includes('invalid') ||
					errorMessage.includes('unauthorized') ||
					errorMessage.includes('forbidden') ||
					errorMessage.includes('not found')
				) {
					throw error;
				}
			}

			if (attempt === attempts) {
				throw lastError;
			}

			// Exponential backoff
			const backoffDelay = delayMs * Math.pow(2, attempt - 1);
			console.warn(`Tech stack extraction attempt ${attempt} failed, retrying in ${backoffDelay}ms:`, error);
			await new Promise((resolve) => setTimeout(resolve, backoffDelay));
		}
	}

	throw lastError!;
}

/**
 * Parses the agent response to extract structured tech stack data
 */
function parseTechStackFromAgentResponse(responseText: string): any {
	try {
		// Try to find JSON in the response
		const jsonMatch = responseText.match(/\{[\s\S]*\}/);
		if (jsonMatch) {
			return JSON.parse(jsonMatch[0]);
		}

		// If no JSON found, try to extract tech stack from text patterns
		const techStack = {
			role_title: extractRoleTitle(responseText),
			seniority: extractSeniority(responseText),
			tech_stack: {
				languages: extractTechnologies(responseText, ['language', 'programming language']),
				frameworks: extractTechnologies(responseText, ['framework', 'library']),
				databases: extractTechnologies(responseText, ['database', 'db']),
				devops: extractTechnologies(responseText, ['devops', 'deployment', 'ci/cd']),
				cloud: extractTechnologies(responseText, ['cloud', 'aws', 'azure', 'gcp']),
				testing: extractTechnologies(responseText, ['testing', 'test', 'qa']),
				tools: extractTechnologies(responseText, ['tool', 'software']),
				other: [],
			},
			assumptions: [],
		};

		return techStack;
	} catch (error) {
		console.error('Error parsing tech stack from agent response:', error);
		return null;
	}
}

/**
 * Extracts role title from text
 */
function extractRoleTitle(text: string): string {
	const rolePatterns = [
		/role[:\s]+([^.]+)/gi,
		/position[:\s]+([^.]+)/gi,
		/title[:\s]+([^.]+)/gi,
		/job[:\s]+([^.]+)/gi,
	];

	for (const pattern of rolePatterns) {
		const match = text.match(pattern);
		if (match) {
			return match[1].trim();
		}
	}

	return 'Software Developer';
}

/**
 * Extracts seniority level from text
 */
function extractSeniority(text: string): 'junior' | 'mid' | 'senior' {
	const textLower = text.toLowerCase();

	if (textLower.includes('senior') || textLower.includes('lead') || textLower.includes('principal')) {
		return 'senior';
	}
	if (textLower.includes('junior') || textLower.includes('entry') || textLower.includes('graduate')) {
		return 'junior';
	}

	return 'mid';
}

/**
 * Extracts technologies based on context keywords
 */
function extractTechnologies(text: string, contextKeywords: string[]): string[] {
	const technologies: string[] = [];
	const textLower = text.toLowerCase();

	// Common technology patterns
	const techPatterns = [
		/React|Angular|Vue|Svelte/gi,
		/TypeScript|JavaScript|Python|Java|C#|Go|Rust/gi,
		/PostgreSQL|MySQL|MongoDB|Redis|Elasticsearch/gi,
		/Docker|Kubernetes|Jenkins|GitHub Actions/gi,
		/AWS|Azure|GCP|Google Cloud/gi,
		/Jest|Cypress|Mocha|Chai|Testing Library/gi,
		/Git|Figma|Jira|Confluence/gi,
	];

	techPatterns.forEach((pattern) => {
		const matches = text.match(pattern);
		if (matches) {
			technologies.push(...matches.map((m) => m.trim()));
		}
	});

	return [...new Set(technologies)]; // Remove duplicates
}

/**
 * Converts extracted tech stack to stack selection JSON format
 */
function convertToStackSelectionJson(extractedTechStack: any): StackSelectionJson {
	const allTechnologies = [
		...(extractedTechStack.tech_stack?.languages || []),
		...(extractedTechStack.tech_stack?.frameworks || []),
		...(extractedTechStack.tech_stack?.databases || []),
		...(extractedTechStack.tech_stack?.devops || []),
		...(extractedTechStack.tech_stack?.cloud || []),
		...(extractedTechStack.tech_stack?.testing || []),
		...(extractedTechStack.tech_stack?.tools || []),
		...(extractedTechStack.tech_stack?.other || []),
	];

	// Split into primary and secondary stacks
	const primaryStack = allTechnologies.slice(0, Math.min(5, allTechnologies.length));
	const secondaryStack = allTechnologies.slice(5);

	return {
		role_title: extractedTechStack.role_title || 'Software Developer',
		seniority: extractedTechStack.seniority || 'mid',
		primary_stack: primaryStack,
		secondary_stack: secondaryStack,
		domain: 'Technology',
		difficulty: extractedTechStack.seniority || 'mid',
		focus_areas: [
			'Code quality and best practices',
			'Technical implementation',
			'Problem solving',
			'System design',
		],
		non_goals: ['Production deployment', 'User authentication', 'Payment processing'],
		company_context_priority: 'strict',
		evaluation_mode: 'mixed',
		deliverable_format: 'repo',
		output_language: 'en',
		privacy_constraints: ['No proprietary data', 'No secrets in repository', 'Use only public APIs'],
		inclusion_requirements: ['README with setup instructions', 'Basic test coverage', 'Code documentation'],
		prohibited_items: ['External paid APIs', 'Embedded credentials', 'Proprietary libraries'],
		extra_credit_themes: ['Performance optimization', 'Error handling', 'Code organization'],
		technical_stack: allTechnologies,
	};
}

/**
 * Extracts tech stack from translated text using the tech stack extractor agent
 * and automatically populates a stack selection JSON object
 */
export async function extractTechStackFromTranslatedText(
	translatedText: string,
	existingJson?: StackSelectionJson,
): Promise<TechStackExtractionResult> {
	const startTime = Date.now();

	try {
		// Input validation
		const validation = validateInput(translatedText);
		if (!validation.isValid) {
			return {
				success: false,
				error: validation.error,
				metadata: {
					originalLength: translatedText?.length || 0,
					processingTimeMs: Date.now() - startTime,
					extractedCount: 0,
				},
			};
		}

		// Clean and prepare text
		const cleanedText = translatedText.trim();
		console.log(`Starting tech stack extraction for text of length: ${cleanedText.length}`);

		// Perform extraction with timeout and retry logic using AI model directly
		const response = await Promise.race([
			retryWithBackoff(async () => {
				const result = await generateText({
					model: openai('gpt-4o-mini'),
					prompt: `You are a Tech Stack Extractor Agent. Analyze the following job offer text and extract the technical stack information. Return a JSON object with the following structure:

{
  "role_title": "extracted role title",
  "seniority": "junior|mid|senior",
  "tech_stack": {
    "languages": ["list of programming languages"],
    "frameworks": ["list of frameworks"],
    "databases": ["list of databases"],
    "devops": ["list of devops tools"],
    "cloud": ["list of cloud services"],
    "testing": ["list of testing tools"],
    "tools": ["list of other tools"],
    "other": []
  },
  "assumptions": ["list any assumptions made"]
}

Job offer text:
${cleanedText}`,
				});

				return {
					text: result.text,
				};
			}),
			createTimeoutPromise(CONFIG.TIMEOUT_MS),
		]);

		// Validate response
		if (!response) {
			throw new Error('Received empty response from AI model');
		}

		if (!response.text || typeof response.text !== 'string') {
			throw new Error('Invalid response format from AI model');
		}

		const responseText = response.text.trim();
		if (responseText === '') {
			throw new Error('Tech stack extraction resulted in empty text');
		}

		// Parse the extracted tech stack
		const extractedTechStack = parseTechStackFromAgentResponse(responseText);
		if (!extractedTechStack) {
			throw new Error('Failed to parse tech stack from agent response');
		}

		// Convert to stack selection JSON format
		const stackSelectionJson = convertToStackSelectionJson(extractedTechStack);

		// Merge with existing JSON if provided
		const finalJson = existingJson ? { ...existingJson, ...stackSelectionJson } : stackSelectionJson;

		const processingTime = Date.now() - startTime;
		const extractedCount = Object.values(extractedTechStack.tech_stack || {}).flat().length;

		console.log(`Tech stack extraction completed successfully in ${processingTime}ms`);
		console.log(`Extracted ${extractedCount} technologies`);

		return {
			success: true,
			techStack: finalJson,
			metadata: {
				originalLength: cleanedText.length,
				processingTimeMs: processingTime,
				extractedCount,
			},
		};
	} catch (error) {
		const processingTime = Date.now() - startTime;
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

		console.error('Tech stack extraction failed:', {
			error: errorMessage,
			processingTimeMs: processingTime,
			textLength: translatedText?.length || 0,
			timestamp: new Date().toISOString(),
		});

		// Determine error type and provide appropriate error message
		let userFriendlyError = 'Tech stack extraction failed due to an unexpected error';

		if (error instanceof Error) {
			const errorMsg = error.message.toLowerCase();

			if (errorMsg.includes('timeout')) {
				userFriendlyError = 'Tech stack extraction request timed out. Please try again with a shorter text.';
			} else if (errorMsg.includes('network') || errorMsg.includes('connection')) {
				userFriendlyError = 'Network error occurred. Please check your connection and try again.';
			} else if (errorMsg.includes('rate limit') || errorMsg.includes('quota')) {
				userFriendlyError =
					'Tech stack extraction service is temporarily unavailable due to high demand. Please try again later.';
			} else if (errorMsg.includes('unauthorized') || errorMsg.includes('forbidden')) {
				userFriendlyError = 'Tech stack extraction service authentication failed. Please contact support.';
			} else if (errorMsg.includes('invalid')) {
				userFriendlyError = 'Invalid input provided for tech stack extraction.';
			}
		}

		return {
			success: false,
			error: userFriendlyError,
			metadata: {
				originalLength: translatedText?.length || 0,
				processingTimeMs: processingTime,
				extractedCount: 0,
			},
		};
	}
}

// Export types for use in other modules
export type { TechStackExtractionResult, StackSelectionJson };
