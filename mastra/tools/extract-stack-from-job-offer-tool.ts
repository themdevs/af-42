import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const extractTechStackFromJobOfferTool = createTool({
	id: 'extract-tech-stack-from-job-offer',
	description: 'Extract the stack from a job offer',
	inputSchema: z.object({
		jobOffer: z.string(),
	}),
	outputSchema: z.object({
		techStack: z.array(z.string()),
		techStackCount: z.number(),
		success: z.boolean(),
	}),
	execute: async ({ context, mastra }) => {
		const { jobOffer } = context;
		console.log('❓ Generating tech stack from extracted text...');

		if (!jobOffer || jobOffer.trim() === '') {
			console.error('❌ No extracted text provided for tech stack extraction');
			return {
				techStack: [],
				techStackCount: 0,
				success: false,
			};
		}

		try {
			const agent = mastra?.getAgent('techStackExtractorAgent');
			if (!agent) {
				throw new Error('Tech stack extractor agent not found');
			}

			const streamResponse = await agent.stream([
				{
					role: 'user',
					content: `Please create tech stack based on the following content extracted from a job offer.

                    ${jobOffer}`,
				},
			]);
			console.log('streamResponse', streamResponse);

			let generatedContent = '';

			for await (const chunk of streamResponse.textStream) {
				generatedContent += chunk || '';
			}

			if (generatedContent.trim().length > 20) {
				// Parse the tech stack from the generated content
				const techStack = parseTechStackFromText(generatedContent);
				console.log('techStack', techStack);
				console.log('techStackCount', techStack.length);
				console.log('success', true);

				console.log(`✅ Tech stack extraction successful: ${techStack.length} tech stack generated`);

				return {
					techStack,
					techStackCount: techStack.length,
					success: true,
				};
			} else {
				console.warn('⚠️ Generated content too short for tech stack parsing');
				return {
					techStack: [],
					techStackCount: 0,
					success: false,
				};
			}
		} catch (error) {
			console.log('error', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			console.error('❌ Tech stack extraction failed:', errorMessage);

			// Check if it's a token limit error
			if (errorMessage.includes('context length') || errorMessage.includes('token')) {
				console.error('💡 Tip: Try using a smaller PDF file. Large documents exceed the token limit.');
			}

			return {
				techStack: [],
				techStackCount: 0,
				success: false,
			};
		}
	},
});

// Helper function to parse tech stack from generated text
function parseTechStackFromText(text: string): string[] {
	// Common tech stack patterns and keywords
	const techKeywords = [
		// Frontend Technologies
		'React',
		'Vue',
		'Angular',
		'Svelte',
		'Next.js',
		'Nuxt.js',
		'Gatsby',
		'TypeScript',
		'JavaScript',
		'HTML',
		'CSS',
		'SCSS',
		'Sass',
		'Less',
		'Tailwind',
		'Bootstrap',
		'Material-UI',
		'Ant Design',
		'Chakra UI',
		'Webpack',
		'Vite',
		'Parcel',
		'Rollup',
		'Babel',
		'ESLint',
		'Prettier',

		// Backend Technologies
		'Node.js',
		'Express',
		'Fastify',
		'Koa',
		'NestJS',
		'Python',
		'Django',
		'Flask',
		'FastAPI',
		'Java',
		'Spring',
		'Spring Boot',
		'C#',
		'.NET',
		'ASP.NET',
		'PHP',
		'Laravel',
		'Symfony',
		'Ruby',
		'Rails',
		'Go',
		'Rust',
		'Elixir',
		'Phoenix',
		'Scala',
		'Kotlin',

		// Databases
		'PostgreSQL',
		'MySQL',
		'MongoDB',
		'Redis',
		'Elasticsearch',
		'SQLite',
		'DynamoDB',
		'Cassandra',
		'Neo4j',
		'InfluxDB',
		'CouchDB',

		// Cloud & DevOps
		'AWS',
		'Azure',
		'GCP',
		'Docker',
		'Kubernetes',
		'Terraform',
		'Ansible',
		'Jenkins',
		'GitLab CI',
		'GitHub Actions',
		'CircleCI',
		'Travis CI',

		// Testing
		'Jest',
		'Mocha',
		'Chai',
		'Cypress',
		'Playwright',
		'Selenium',
		'Puppeteer',
		'Enzyme',
		'Testing Library',
		'Vitest',

		// State Management
		'Redux',
		'MobX',
		'Zustand',
		'Recoil',
		'Jotai',
		'Vuex',
		'Pinia',

		// Other Tools
		'Git',
		'GitHub',
		'GitLab',
		'Bitbucket',
		'Figma',
		'Sketch',
		'Adobe XD',
		'GraphQL',
		'REST',
		'API',
		'Microservices',
		'Serverless',
		'Lambda',
	];

	// Extract tech stack from the text
	const foundTechStack = new Set<string>();

	// Method 1: Look for explicit tech stack mentions
	const techStackPatterns = [
		/tech stack[:\s]+([^.]+)/gi,
		/technologies[:\s]+([^.]+)/gi,
		/stack[:\s]+([^.]+)/gi,
		/technologies used[:\s]+([^.]+)/gi,
		/required technologies[:\s]+([^.]+)/gi,
		/experience with[:\s]+([^.]+)/gi,
		/knowledge of[:\s]+([^.]+)/gi,
		/strong knowledge of[:\s]+([^.]+)/gi,
		/experience in[:\s]+([^.]+)/gi,
		/proficiency in[:\s]+([^.]+)/gi,
	];

	techStackPatterns.forEach((pattern) => {
		const matches = text.match(pattern);
		if (matches) {
			matches.forEach((match) => {
				const techPart = match
					.split(/[:\s]+/)
					.slice(1)
					.join(' ')
					.trim();
				if (techPart) {
					// Split by common separators and clean up
					const techs = techPart.split(/[,;&|]/).map((t) => t.trim());
					techs.forEach((tech) => {
						if (tech.length > 2 && tech.length < 50) {
							foundTechStack.add(tech);
						}
					});
				}
			});
		}
	});

	// Method 2: Look for individual tech keywords in context
	techKeywords.forEach((keyword) => {
		const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
		if (regex.test(text)) {
			foundTechStack.add(keyword);
		}
	});

	// Method 3: Look for bullet points or numbered lists that might contain tech stack
	const lines = text
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

	lines.forEach((line) => {
		// Check if line contains tech keywords
		techKeywords.forEach((keyword) => {
			if (line.toLowerCase().includes(keyword.toLowerCase())) {
				// Extract the tech from the line
				const techMatch = line.match(new RegExp(`\\b${keyword}\\b`, 'gi'));
				if (techMatch) {
					foundTechStack.add(keyword);
				}
			}
		});
	});

	// Convert to array and clean up
	const techStack = Array.from(foundTechStack)
		.map((tech) => {
			// Clean up common prefixes/suffixes
			let cleaned = tech
				.replace(/^(experience with|knowledge of|strong knowledge of|proficiency in|expertise in)\s+/i, '')
				.replace(/\s+(experience|knowledge|proficiency|expertise)$/i, '')
				.replace(/^(at least|minimum|maximum)\s+\d+\s+(years?|months?)\s+of\s+/i, '')
				.replace(/\d+\s+(years?|months?)\s+of\s+/i, '')
				.trim();

			// Remove version numbers and extra details
			cleaned = cleaned.replace(/\s+\d+(\.\d+)*(\s|$)/g, ' ');

			return cleaned;
		})
		.filter((tech) => {
			// Filter out invalid entries
			return (
				tech.length > 2 &&
				tech.length < 50 &&
				!tech.match(/^\d+$/) && // Not just numbers
				!tech.match(/^(years?|months?|experience|knowledge|proficiency)$/i) && // Not generic terms
				techKeywords.some(
					(keyword) =>
						keyword.toLowerCase() === tech.toLowerCase() ||
						tech.toLowerCase().includes(keyword.toLowerCase()),
				)
			);
		})
		.slice(0, 20); // Limit to 20 tech stack items

	return techStack;
}
