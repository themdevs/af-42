'use client';

import { useState } from 'react';
import { TaskGeneratorFormFromFileUpload } from '@/components/challenge-generator/task-generator-from-file-upload';
import { TaskGeneratorFormFromDataSelection } from '@/components/challenge-generator/task-generator-from-data-selection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Database } from 'lucide-react';

export function ChallengeGeneratorSelectorComponent() {
	const [activeTab, setActiveTab] = useState('file-upload');

	return (
		<div className="w-full max-w-7xl mx-auto space-y-6">
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">Challenge Generator</h1>
				<p className="text-muted-foreground">Choose how you'd like to generate your technical challenge</p>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="file-upload" className="flex items-center gap-2">
						<Upload className="h-4 w-4" />
						File Upload
					</TabsTrigger>
					<TabsTrigger value="data-selection" className="flex items-center gap-2">
						<Database className="h-4 w-4" />
						Data Selection
					</TabsTrigger>
				</TabsList>

				<TabsContent value="file-upload" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Upload className="h-5 w-5" />
								Upload Job Description File
							</CardTitle>
							<CardDescription>
								Upload a job description file (PDF, DOCX, TXT) and let our AI extract the technical
								requirements automatically. Perfect for when you have a complete job posting document.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<TaskGeneratorFormFromFileUpload />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="data-selection" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Database className="h-5 w-5" />
								Manual Data Selection
							</CardTitle>
							<CardDescription>
								Manually select technologies, frameworks, and requirements from our curated database.
								Ideal for creating custom challenges or when you want full control over the selection
								process.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<TaskGeneratorFormFromDataSelection />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
