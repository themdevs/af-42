'use client';

import { useState } from 'react';
import { createFrontendChallenge } from './action';
import { ProfileForm } from './TaskGeneratorForm';

export function FormGenerator() {
	const [result, setResult] = useState<string | null>(null);

	async function handleSubmit(formData: FormData) {
		const res = await createFrontendChallenge(formData);
		setResult(res);
	}

	return (
		<>
			<div className="p-4 gap-4 items-center justify-center">
				<ProfileForm />
				<h2 className="text-2xl font-bold text-center py-4">Create Frontend Challenge</h2>
				<form action={handleSubmit} className="flex flex-col gap-2">
					<input
						className="border border-gray-300 p-2 rounded-md cursor-pointer"
						name="jobOffer"
						placeholder="Enter job offer"
						required
					/>
					<input
						className="border border-gray-300 p-2 rounded-md cursor-pointer"
						name="jsonConfig"
						placeholder="Enter JSON config"
					/>
					<button className="bg-blue-500 text-white p-2 rounded-md cursor-pointer" type="submit">
						Create Challenge
					</button>
				</form>
			</div>

			{result && <pre>{result}</pre>}
		</>
	);
}
