'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createFrontendChallenge } from '@/app/(users)/company/[company-name]/(challenges)/challenge/generate/action';
import { useState } from 'react';
import { DataSelectionComponent } from '@/components/challenge-generator/data-selection-component';

const formSchema = z.object({
	jobOffer: z.string().optional(),
	jsonConfig: z.string().optional(),
});

export function TaskGeneratorForm() {
	const [result, setResult] = useState<string | null>(null);
	const [jsonConfig, setJsonConfig] = useState<string>('');

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			jobOffer: '',
			jsonConfig: '',
		},
	});

	// Handle JSON config changes from DataSelectionComponent
	const handleJsonChange = (json: string) => {
		setJsonConfig(json);
		form.setValue('jsonConfig', json);
	};

	// todo: define a way to select the right agent for the task
	// 2. Define a submit handler.
	async function handleSubmit(formData: z.infer<typeof formSchema>) {
		const res = await createFrontendChallenge(formData.jobOffer || '', jsonConfig || '');
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
									<Input placeholder="Job offer" {...field} />
								</FormControl>
								<FormDescription>This is your job offer.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormItem>
						<DataSelectionComponent onJsonChange={handleJsonChange} />
						<FormLabel>JSON Config</FormLabel>
						<FormDescription>
                            <span className="font-bold">Important: </span>
							This JSON config is automatically generated from your selections above and will be used to
							generate the challenge.
						</FormDescription>

						<FormControl>
							<div className="min-h-[200px] border rounded-lg p-4 bg-muted/50">
								{jsonConfig ? (
									<pre className="text-sm font-mono whitespace-pre-wrap overflow-auto">
										{jsonConfig}
									</pre>
								) : (
									<div className="flex items-center justify-center h-full text-muted-foreground">
										Select items from the data selection component above to generate JSON config
									</div>
								)}
							</div>
						</FormControl>
					</FormItem>
					<Button type="submit">Submit</Button>
				</form>
			</Form>
			{result && <pre>{result}</pre>}
		</>
	);
}
