import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { VercelDeployer } from '@mastra/deployer-vercel';

// Agents
import { frontendAgent } from './agents/frontend-agent';
import { backendAgent } from './agents/backend-agent';
import { techStackExtractorAgent } from './agents/tech-stack-extractor-agent';
import { textQuestionAgent } from './agents/text-question-agent';
import { pdfQuestionAgent } from './agents/pdf-question-agent';
import { pdfSummarizationAgent } from './agents/pdf-summarization-agent';

// Workflows
// import { pdfToQuestionsWorkflow } from './workflows/generate-questions-from-pdf-workflow';

// Utils - Note: extractTextFromFile functions are server-side only, use API route instead
export type { TextExtractionResult, FileProcessingOptions } from './utils/extract-text-from-file';

export const mastra = new Mastra({
	// workflows: { pdfToQuestionsWorkflow },
	agents: {
		textQuestionAgent,
		pdfQuestionAgent,
		pdfSummarizationAgent,
		frontendAgent,
		backendAgent,
		techStackExtractorAgent,
	},
	storage: new LibSQLStore({
		// stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
		url: ':memory:',
	}),
	logger: new PinoLogger({
		name: 'Mastra',
		level: 'info',
	}),
	deployer: new VercelDeployer(),
});
