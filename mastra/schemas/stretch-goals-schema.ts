import { z } from 'zod';

// Stretch goals schema
export const stretchGoalsSchema = z.object({
	title: z.string(),
	description: z.string(),
	estimated_time: z.string(),
});
