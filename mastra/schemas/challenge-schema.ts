import { z } from 'zod';
import { evaluationCriteriaSchema } from './evaluation-criteria-schema';

// Technical requirements schema
const requirementsSchema = z.object({
	functional: z.array(z.string()),
	non_functional: z.array(z.string()),
	technical_stack: z.array(z.string()),
});

// Stretch goals schema
const stretchGoalsSchema = z.object({
	title: z.string(),
	description: z.string(),
	estimated_time: z.string(),
});

// Deliverables schema
const deliverablesSchema = z.object({
	repository_format: z.string(),
	readme_requirements: z.array(z.string()),
	code_structure: z.array(z.string()),
	artifacts: z.array(z.string()).optional(),
});

// Main challenge schema matching the job-offer-to-technical-challenge-generator outputs
export const challengeSchema = z.object({
	// Technical Challenge Brief components
	title: z.string(),
	overview: z.string(),
	difficulty_level: z.enum(['junior', 'mid', 'senior']),

	// Requirements (derived from technical specs)
	requirements: requirementsSchema,

	// Deliverables with clear specifications
	deliverables: deliverablesSchema,

	// Weighted evaluation rubric
	evaluation_criteria: evaluationCriteriaSchema,

	// Optional stretch goals aligned with technical stack
	stretch_goals: z.array(stretchGoalsSchema).optional(),

	// Clear submission instructions
	submission_instructions: z.object({
		format: z.string(),
		deadline: z.string().optional(),
		contact_info: z.string().optional(),
		additional_notes: z.array(z.string()).optional(),
	}),

	// Sample data or schemas if relevant to the role
	sample_artifacts: z
		.object({
			data_samples: z.array(z.string()).optional(),
			schemas: z.array(z.string()).optional(),
			interfaces: z.array(z.string()).optional(),
		})
		.optional(),

	// Technical specifications extracted from job offer
	technical_context: z.object({
		extracted_tools: z.array(z.string()),
		frameworks: z.array(z.string()),
		responsibilities: z.array(z.string()),
	}),
});
