import { z } from 'zod';

const envSchema = z.object({
	JWT_PUBLIC_KEY: z.string(),
	JWT_ALGO: z.string().default('RS512'),
	BACKEND_API_CALL: z.string(),
	NEXT_PUBLIC_DOMAIN: z.string(),
	APP_ENV: z.enum(['development', 'production', 'testing', 'staging']).default('development'),
	NODE_ENV: z.enum(['development', 'production', 'testing']).default('development'),
	NEXT_PUBLIC_BACKEND_API_CLIENT: z.string(),
	OPENAI_API_KEY: z.string(),
});

//* Need to explicitly extract the public env variables from the process.env
//* because the env variables are not available in the frontend

const publicEnv: Record<string, string> = {
	NEXT_PUBLIC_BACKEND_API_CLIENT: process.env.NEXT_PUBLIC_BACKEND_API_CLIENT as string,
	NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN as string,
};

export type EnvType = z.infer<typeof envSchema>;

export class Env {
	static initialize() {
		const checkEnv = envSchema.safeParse(process.env);
		if (!checkEnv.success) {
			console.error('❌ Invalid environment variables:');
			for (const error of checkEnv.error.issues) {
				console.error(`Missing environment variable: ${error.path[0]}`);
			}
			throw new Error('Invalid environment variables. Check the logs above for details.');
		}
	}

	static get(key: keyof EnvType): string {
		if (key.startsWith('NEXT_PUBLIC_')) {
			return publicEnv[key];
		}
		return process.env[key] as string;
	}
}
