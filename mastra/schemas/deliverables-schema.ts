import { z } from 'zod';

// Deliverables schema
export const deliverablesSchema = z.object({
	repository_format: z.string(),
	readme_requirements: z.array(z.string()),
	code_structure: z.array(z.string()),
	artifacts: z.array(z.string()).optional(),
});
