'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createFrontendChallenge } from './action';
import { useState } from 'react';

const formSchema = z.object({
	jobOffer: z.string().min(200, {
		message: 'Job offer must be at least 200 characters.',
	}),
	jsonConfig: z.string().optional(),
});

export function TaskGeneratorForm() {

	const [result, setResult] = useState<string | null>(null);
	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			jobOffer: '',
			jsonConfig: '',
		},
	});

	// 2. Define a submit handler.
	async function handleSubmit(formData: z.infer<typeof formSchema>) {
		const res = await createFrontendChallenge(formData.jobOffer, formData.jsonConfig || '');
		setResult(res);
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="jobOffer"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Job Offer</FormLabel>
								<FormControl>
									<Input placeholder="shadcn" {...field} />
								</FormControl>
								<FormDescription>This is your job offer.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="jsonConfig"
						render={({ field }) => (
							<FormItem>
								<FormLabel>JSON Config</FormLabel>
								<FormControl>
									<Input placeholder="shadcn" {...field} />
								</FormControl>
								<FormDescription>This is your JSON config.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Submit</Button>
				</form>
			</Form>
			{result && <pre>{result}</pre>}
		</>
	);
}
