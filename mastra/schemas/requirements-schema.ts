import { z } from 'zod';

// Technical requirements schema
export const requirementsSchema = z.object({
	functional: z.array(z.string()),
	non_functional: z.array(z.string()),
	technical_stack: z.array(z.string()),
});
