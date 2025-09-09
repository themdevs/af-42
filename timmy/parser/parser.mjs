import OpenAI from 'openai';
import { config } from 'dotenv';

config({ path: '../../../../.env' });

// Check if API key is provided
const apiKey = process.env.OPENAI_API_KEY;
console.log('process.env ===========>', process.env);
console.log('apiKey ===========>', apiKey);

if (!apiKey) {
	console.error('Error: OPENAI_API_KEY environment variable is not set.');
	console.log('Usage: OPENAI_API_KEY=your_key_here node parser.mjs');
	process.exit(1);
}

const client = new OpenAI({
	apiKey: apiKey,
});

try {
	const response = await client.chat.completions.create({
		model: 'gpt-5-mini',
		messages: [
			{
				role: 'user',
				content: 'Write a one-sentence bedtime story about a unicorn.',
			},
		],
		max_completion_tokens: 50000,
	});

	console.log('API Key loaded:', apiKey ? 'Yes' : 'No');
	console.log('Response:', response.choices[0].message.content);
} catch (error) {
	console.error('Error calling OpenAI API:', error.message);
}
