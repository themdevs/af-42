import { z } from 'zod';

// Evaluation rubric schema with weighted criteria
export const evaluationCriteriaSchema = z.object({
	correctness: z.object({
		weight: z.number().min(0).max(100),
		description: z.string(),
	}),
	code_quality: z.object({
		weight: z.number().min(0).max(100),
		description: z.string(),
	}),
	testing: z.object({
		weight: z.number().min(0).max(100),
		description: z.string(),
	}),
	architecture: z
		.object({
			weight: z.number().min(0).max(100),
			description: z.string(),
		})
		.optional(),
	documentation: z
		.object({
			weight: z.number().min(0).max(100),
			description: z.string(),
		})
		.optional(),
});
