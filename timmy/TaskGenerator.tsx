import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import languageData from './fields/frontend/language-data.json';
import frameworkData from './fields/frontend/framework-data.json';
import CompanyDashboardLayout from '@/layouts/company-dashboard-layout';

interface TaskFormData {
	// Basic Information
	taskName: string;
	description: string;
	difficulty: 'beginner' | 'intermediate' | 'advanced';
	estimatedTime: string;

	// Technology Stack
	languages: string[];
	frameworks: string[];

	// Task Details
	taskType: 'feature' | 'bug-fix' | 'refactor' | 'learning' | 'optimization';
	category: 'frontend' | 'backend' | 'fullstack' | 'devops' | 'testing';

	// Requirements
	requirements: string[];
	deliverables: string[];
	constraints: string;

	// Additional Options
	includeTests: boolean;
	includeDocumentation: boolean;
	includeCodeReview: boolean;
}

const initialFormData: TaskFormData = {
	taskName: '',
	description: '',
	difficulty: 'beginner',
	estimatedTime: '',
	languages: [],
	frameworks: [],
	taskType: 'feature',
	category: 'frontend',
	requirements: [''],
	deliverables: [''],
	constraints: '',
	includeTests: false,
	includeDocumentation: false,
	includeCodeReview: false,
};

export const TaskGenerator = () => {
	const [formData, setFormData] = useState<TaskFormData>(initialFormData);
	const [generatedTask, setGeneratedTask] = useState<string>('');
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [fileContent, setFileContent] = useState<string>('');
	const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
	const [uploadError, setUploadError] = useState<string>('');
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleInputChange = (field: keyof TaskFormData, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleArrayChange = (field: 'requirements' | 'deliverables', index: number, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: prev[field].map((item, i) => (i === index ? value : item)),
		}));
	};

	const addArrayItem = (field: 'requirements' | 'deliverables') => {
		setFormData((prev) => ({
			...prev,
			[field]: [...prev[field], ''],
		}));
	};

	const removeArrayItem = (field: 'requirements' | 'deliverables', index: number) => {
		setFormData((prev) => ({
			...prev,
			[field]: prev[field].filter((_, i) => i !== index),
		}));
	};

	const handleLanguageToggle = (language: string) => {
		setFormData((prev) => ({
			...prev,
			languages: prev.languages.includes(language)
				? prev.languages.filter((l) => l !== language)
				: [...prev.languages, language],
		}));
	};

	const handleFrameworkToggle = (framework: string) => {
		setFormData((prev) => ({
			...prev,
			frameworks: prev.frameworks.includes(framework)
				? prev.frameworks.filter((f) => f !== framework)
				: [...prev.frameworks, framework],
		}));
	};

	const generateTask = () => {
		const task = `
# ${formData.taskName}

## Description
${formData.description}

## Task Details
- **Type**: ${formData.taskType}
- **Category**: ${formData.category}
- **Difficulty**: ${formData.difficulty}
- **Estimated Time**: ${formData.estimatedTime}

## Technology Stack
### Languages
${formData.languages.map((lang) => `- ${lang}`).join('\n')}

### Frameworks
${formData.frameworks.map((fw) => `- ${fw}`).join('\n')}

## Requirements
${formData.requirements
	.filter((req) => req.trim())
	.map((req, index) => `${index + 1}. ${req}`)
	.join('\n')}

## Deliverables
${formData.deliverables
	.filter((del) => del.trim())
	.map((del, index) => `${index + 1}. ${del}`)
	.join('\n')}

## Constraints
${formData.constraints}

## Additional Tasks
${formData.includeTests ? '- [ ] Write unit tests\n' : ''}${formData.includeDocumentation ? '- [ ] Update documentation\n' : ''}${formData.includeCodeReview ? '- [ ] Code review required\n' : ''}
    `.trim();

		setGeneratedTask(task);
	};

	const resetForm = () => {
		setFormData(initialFormData);
		setGeneratedTask('');
		setUploadedFile(null);
		setFileContent('');
		setUploadStatus('idle');
		setUploadError('');
	};

	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Validate file type
		const allowedTypes = [
			'text/plain',
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		];
		if (!allowedTypes.includes(file.type)) {
			setUploadError('Please upload a valid file type (TXT, PDF, DOC, DOCX)');
			setUploadStatus('error');
			return;
		}

		// Validate file size (max 10MB)
		if (file.size > 10 * 1024 * 1024) {
			setUploadError('File size must be less than 10MB');
			setUploadStatus('error');
			return;
		}

		setUploadedFile(file);
		setUploadStatus('uploading');
		setUploadError('');

		try {
			let content = '';

			if (file.type === 'text/plain') {
				content = await file.text();
			} else {
				// For PDF and DOC files, we'll show a placeholder message
				// In a real implementation, you'd use libraries like pdf-parse or mammoth
				content = `[File uploaded: ${file.name}]\n\nNote: File content parsing for PDF/DOC files requires additional libraries. Please copy and paste the job description manually.`;
			}

			setFileContent(content);
			setUploadStatus('success');

			// Auto-populate form fields based on file content
			parseJobOffer(content);
		} catch (error) {
			setUploadError('Failed to read file content');
			setUploadStatus('error');
		}
	};

	const parseJobOffer = (content: string) => {
		// Simple parsing logic to extract information from job offer
		const lines = content
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line);

		// Extract job title (usually in the first few lines)
		const titleMatch = content.match(/(?:job title|position|role)[:\s]+([^\n]+)/i);
		if (titleMatch) {
			handleInputChange('taskName', titleMatch[1].trim());
		}

		// Extract technologies mentioned
		const techKeywords = [
			...languageData.languageData.map((lang) => lang.name.toLowerCase()),
			...frameworkData.frameworkData.map((fw) => fw.name.toLowerCase()),
		];

		const foundLanguages: string[] = [];
		const foundFrameworks: string[] = [];

		techKeywords.forEach((tech) => {
			if (content.toLowerCase().includes(tech.toLowerCase())) {
				const languageMatch = languageData.languageData.find(
					(lang) => lang.name.toLowerCase() === tech.toLowerCase(),
				);
				const frameworkMatch = frameworkData.frameworkData.find(
					(fw) => fw.name.toLowerCase() === tech.toLowerCase(),
				);

				if (languageMatch) {
					foundLanguages.push(languageMatch.name);
				}
				if (frameworkMatch) {
					foundFrameworks.push(frameworkMatch.name);
				}
			}
		});

		// Update form with found technologies
		if (foundLanguages.length > 0) {
			handleInputChange('languages', foundLanguages);
		}
		if (foundFrameworks.length > 0) {
			handleInputChange('frameworks', foundFrameworks);
		}

		// Extract requirements (look for bullet points or numbered lists)
		const requirements: string[] = [];
		lines.forEach((line) => {
			if (line.match(/^[-•*]\s+/) || line.match(/^\d+\.\s+/)) {
				requirements.push(line.replace(/^[-•*]\s+/, '').replace(/^\d+\.\s+/, ''));
			}
		});

		if (requirements.length > 0) {
			handleInputChange('requirements', requirements);
		}

		// Set description to the first few lines of content
		const descriptionLines = lines.slice(0, 5).join('\n');
		if (descriptionLines) {
			handleInputChange('description', descriptionLines);
		}
	};

	const removeUploadedFile = () => {
		setUploadedFile(null);
		setFileContent('');
		setUploadStatus('idle');
		setUploadError('');
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	return (
		<CompanyDashboardLayout>
			<div className="min-h-screen bg-gray-50/30">
				<div className="max-w-6xl mx-auto p-6 space-y-8">
					{/* Header Section */}
					<div className="text-center mb-8">
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight font-ibm-plex-mono">
							<span className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 bg-clip-text text-transparent">
								TASK
							</span>
							<span className="text-gray-900"> GENERATOR</span>
						</h1>
						<p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
							Generate comprehensive development tasks with technology stack, requirements, and
							deliverables
						</p>
					</div>

					<Card className="bg-white border border-gray-200 shadow-sm">
						<CardHeader className="border-b border-gray-100">
							<CardTitle className="text-2xl font-bold text-gray-900 font-ibm-plex-mono">
								Create New Task
							</CardTitle>
							<CardDescription className="text-gray-600">
								Build detailed development tasks for your team
							</CardDescription>
						</CardHeader>
						<CardContent className="bg-transparent">
							<Tabs defaultValue="basic" className="w-full">
								<TabsList className="grid w-full grid-cols-5 bg-gray-100 border border-gray-200">
									<TabsTrigger
										value="upload"
										className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-gray-700 hover:text-gray-900 transition-colors"
									>
										Upload
									</TabsTrigger>
									<TabsTrigger
										value="basic"
										className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-gray-700 hover:text-gray-900 transition-colors"
									>
										Basic Info
									</TabsTrigger>
									<TabsTrigger
										value="tech"
										className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-gray-700 hover:text-gray-900 transition-colors"
									>
										Tech Stack
									</TabsTrigger>
									<TabsTrigger
										value="details"
										className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-gray-700 hover:text-gray-900 transition-colors"
									>
										Task Details
									</TabsTrigger>
									<TabsTrigger
										value="requirements"
										className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-gray-700 hover:text-gray-900 transition-colors"
									>
										Requirements
									</TabsTrigger>
								</TabsList>

								<TabsContent value="upload" className="space-y-6">
									<div className="space-y-6">
										<div className="text-center">
											<h3 className="text-xl font-bold mb-3 text-gray-900 font-ibm-plex-mono">
												Upload Job Offer
											</h3>
											<p className="text-gray-600 mb-6">
												Upload a job offer file to automatically populate the form fields
											</p>
										</div>

										{!uploadedFile ? (
											<div className="border-2 border-dashed border-gray-300 hover:border-cyan-500 rounded-lg p-12 text-center bg-gray-50 transition-all duration-300">
												<input
													ref={fileInputRef}
													type="file"
													accept=".txt,.pdf,.doc,.docx"
													onChange={handleFileUpload}
													className="hidden"
												/>
												<Upload className="mx-auto h-16 w-16 text-cyan-600 mb-6" />
												<div className="space-y-4">
													<Button
														variant="af42Outline"
														size="lg"
														onClick={() => fileInputRef.current?.click()}
														disabled={uploadStatus === 'uploading'}
														className="px-8 py-3"
													>
														{uploadStatus === 'uploading' ? 'Uploading...' : 'Choose File'}
													</Button>
													<p className="text-sm text-gray-500">
														Supports TXT, PDF, DOC, DOCX files up to 10MB
													</p>
												</div>
											</div>
										) : (
											<div className="space-y-6">
												<div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg bg-gray-50">
													<div className="flex items-center space-x-4">
														<FileText className="h-10 w-10 text-cyan-600" />
														<div>
															<p className="font-medium text-gray-900">
																{uploadedFile.name}
															</p>
															<p className="text-sm text-gray-500">
																{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
															</p>
														</div>
													</div>
													<div className="flex items-center space-x-3">
														{uploadStatus === 'success' && (
															<CheckCircle className="h-6 w-6 text-green-600" />
														)}
														{uploadStatus === 'error' && (
															<AlertCircle className="h-6 w-6 text-red-600" />
														)}
														<Button
															variant="ghost"
															size="sm"
															onClick={removeUploadedFile}
															className="text-gray-500 hover:text-gray-900 hover:bg-gray-200"
														>
															<X className="h-4 w-4" />
														</Button>
													</div>
												</div>

												{uploadError && (
													<div className="p-4 border border-red-200 rounded-lg bg-red-50">
														<p className="text-sm text-red-600">{uploadError}</p>
													</div>
												)}

												{fileContent && (
													<div className="space-y-3">
														<Label className="text-sm font-medium text-gray-900">
															File Content Preview:
														</Label>
														<div className="max-h-40 overflow-y-auto p-4 border border-gray-200 rounded-lg bg-gray-50">
															<pre className="text-xs whitespace-pre-wrap text-gray-700 font-mono">
																{fileContent}
															</pre>
														</div>
													</div>
												)}

												{uploadStatus === 'success' && (
													<div className="p-4 border border-green-200 rounded-lg bg-green-50">
														<p className="text-sm text-green-600">
															✓ File uploaded successfully! Form fields have been
															auto-populated based on the content.
														</p>
													</div>
												)}
											</div>
										)}
									</div>
								</TabsContent>

								<TabsContent value="basic" className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-3">
											<Label htmlFor="taskName" className="text-gray-900 font-medium">
												Task Name
											</Label>
											<Input
												id="taskName"
												value={formData.taskName}
												onChange={(e) => handleInputChange('taskName', e.target.value)}
												placeholder="Enter task name"
												className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
											/>
										</div>
										<div className="space-y-3">
											<Label htmlFor="estimatedTime" className="text-gray-900 font-medium">
												Estimated Time
											</Label>
											<Input
												id="estimatedTime"
												value={formData.estimatedTime}
												onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
												placeholder="e.g., 2 hours, 1 day"
												className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
											/>
										</div>
									</div>

									<div className="space-y-3">
										<Label htmlFor="description" className="text-gray-900 font-medium">
											Description
										</Label>
										<Textarea
											id="description"
											value={formData.description}
											onChange={(e) => handleInputChange('description', e.target.value)}
											placeholder="Describe the task in detail"
											rows={4}
											className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
										/>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-3">
											<Label htmlFor="difficulty" className="text-gray-900 font-medium">
												Difficulty Level
											</Label>
											<Select
												value={formData.difficulty}
												onValueChange={(value) => handleInputChange('difficulty', value)}
											>
												<SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500/20">
													<SelectValue />
												</SelectTrigger>
												<SelectContent className="bg-white border-gray-200">
													<SelectItem
														value="beginner"
														className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
													>
														Beginner
													</SelectItem>
													<SelectItem
														value="intermediate"
														className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
													>
														Intermediate
													</SelectItem>
													<SelectItem
														value="advanced"
														className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
													>
														Advanced
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className="space-y-3">
											<Label htmlFor="category" className="text-gray-900 font-medium">
												Category
											</Label>
											<Select
												value={formData.category}
												onValueChange={(value) => handleInputChange('category', value)}
											>
												<SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500/20">
													<SelectValue />
												</SelectTrigger>
												<SelectContent className="bg-white border-gray-200">
													<SelectItem
														value="frontend"
														className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
													>
														Frontend
													</SelectItem>
													<SelectItem
														value="backend"
														className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
													>
														Backend
													</SelectItem>
													<SelectItem
														value="fullstack"
														className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
													>
														Full Stack
													</SelectItem>
													<SelectItem
														value="devops"
														className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
													>
														DevOps
													</SelectItem>
													<SelectItem
														value="testing"
														className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
													>
														Testing
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>
								</TabsContent>

								<TabsContent value="tech" className="space-y-8">
									<div>
										<Label className="text-xl font-bold text-gray-900 font-ibm-plex-mono">
											Programming Languages
										</Label>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
											{languageData.languageData.map((lang) => (
												<div
													key={lang.name}
													className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-200 hover:border-cyan-500/50 transition-colors"
												>
													<Checkbox
														id={`lang-${lang.name}`}
														checked={formData.languages.includes(lang.name)}
														onCheckedChange={() => handleLanguageToggle(lang.name)}
														className="data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
													/>
													<Label
														htmlFor={`lang-${lang.name}`}
														className="text-sm text-gray-900 cursor-pointer"
													>
														{lang.name}
													</Label>
												</div>
											))}
										</div>
										{formData.languages.length > 0 && (
											<div className="mt-6">
												<Label className="text-sm text-cyan-600 font-medium">
													Selected Languages:
												</Label>
												<div className="flex flex-wrap gap-2 mt-2">
													{formData.languages.map((lang) => (
														<Badge
															key={lang}
															className="bg-cyan-100 text-cyan-700 border border-cyan-200 hover:bg-cyan-200"
														>
															{lang}
														</Badge>
													))}
												</div>
											</div>
										)}
									</div>

									<Separator className="bg-gray-200" />

									<div>
										<Label className="text-xl font-bold text-gray-900 font-ibm-plex-mono">
											Frameworks & Libraries
										</Label>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
											{frameworkData.frameworkData.map((framework) => (
												<div
													key={framework.name}
													className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-200 hover:border-cyan-500/50 transition-colors"
												>
													<Checkbox
														id={`fw-${framework.name}`}
														checked={formData.frameworks.includes(framework.name)}
														onCheckedChange={() => handleFrameworkToggle(framework.name)}
														className="data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
													/>
													<Label
														htmlFor={`fw-${framework.name}`}
														className="text-sm text-gray-900 cursor-pointer"
													>
														{framework.name}
													</Label>
												</div>
											))}
										</div>
										{formData.frameworks.length > 0 && (
											<div className="mt-6">
												<Label className="text-sm text-cyan-600 font-medium">
													Selected Frameworks:
												</Label>
												<div className="flex flex-wrap gap-2 mt-2">
													{formData.frameworks.map((fw) => (
														<Badge
															key={fw}
															className="bg-cyan-100 text-cyan-700 border border-cyan-200 hover:bg-cyan-200"
														>
															{fw}
														</Badge>
													))}
												</div>
											</div>
										)}
									</div>
								</TabsContent>

								<TabsContent value="details" className="space-y-6">
									<div className="space-y-3">
										<Label htmlFor="taskType" className="text-gray-900 font-medium">
											Task Type
										</Label>
										<Select
											value={formData.taskType}
											onValueChange={(value) => handleInputChange('taskType', value)}
										>
											<SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500/20">
												<SelectValue />
											</SelectTrigger>
											<SelectContent className="bg-white border-gray-200">
												<SelectItem
													value="feature"
													className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
												>
													Feature Development
												</SelectItem>
												<SelectItem
													value="bug-fix"
													className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
												>
													Bug Fix
												</SelectItem>
												<SelectItem
													value="refactor"
													className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
												>
													Refactoring
												</SelectItem>
												<SelectItem
													value="learning"
													className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
												>
													Learning Exercise
												</SelectItem>
												<SelectItem
													value="optimization"
													className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
												>
													Performance Optimization
												</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-3">
										<Label htmlFor="constraints" className="text-gray-900 font-medium">
											Constraints & Notes
										</Label>
										<Textarea
											id="constraints"
											value={formData.constraints}
											onChange={(e) => handleInputChange('constraints', e.target.value)}
											placeholder="Any specific constraints, limitations, or additional notes"
											rows={3}
											className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
										/>
									</div>

									<div className="space-y-4">
										<Label className="text-xl font-bold text-gray-900 font-ibm-plex-mono">
											Additional Tasks
										</Label>
										<div className="space-y-4">
											<div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
												<Checkbox
													id="includeTests"
													checked={formData.includeTests}
													onCheckedChange={(checked) =>
														handleInputChange('includeTests', checked)
													}
													className="data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
												/>
												<Label htmlFor="includeTests" className="text-gray-900 cursor-pointer">
													Include unit tests
												</Label>
											</div>
											<div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
												<Checkbox
													id="includeDocumentation"
													checked={formData.includeDocumentation}
													onCheckedChange={(checked) =>
														handleInputChange('includeDocumentation', checked)
													}
													className="data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
												/>
												<Label
													htmlFor="includeDocumentation"
													className="text-gray-900 cursor-pointer"
												>
													Include documentation updates
												</Label>
											</div>
											<div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
												<Checkbox
													id="includeCodeReview"
													checked={formData.includeCodeReview}
													onCheckedChange={(checked) =>
														handleInputChange('includeCodeReview', checked)
													}
													className="data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
												/>
												<Label
													htmlFor="includeCodeReview"
													className="text-gray-900 cursor-pointer"
												>
													Require code review
												</Label>
											</div>
										</div>
									</div>
								</TabsContent>

								<TabsContent value="requirements" className="space-y-8">
									<div>
										<div className="flex items-center justify-between mb-4">
											<Label className="text-xl font-bold text-gray-900 font-ibm-plex-mono">
												Requirements
											</Label>
											<Button
												type="button"
												variant="af42Outline"
												size="sm"
												onClick={() => addArrayItem('requirements')}
												className="px-4"
											>
												Add Requirement
											</Button>
										</div>
										<div className="space-y-3">
											{formData.requirements.map((req, index) => (
												<div key={index} className="flex gap-3">
													<Input
														value={req}
														onChange={(e) =>
															handleArrayChange('requirements', index, e.target.value)
														}
														placeholder={`Requirement ${index + 1}`}
														className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
													/>
													{formData.requirements.length > 1 && (
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={() => removeArrayItem('requirements', index)}
															className="text-gray-500 hover:text-gray-900 hover:bg-gray-200"
														>
															Remove
														</Button>
													)}
												</div>
											))}
										</div>
									</div>

									<Separator className="bg-gray-200" />

									<div>
										<div className="flex items-center justify-between mb-4">
											<Label className="text-xl font-bold text-gray-900 font-ibm-plex-mono">
												Deliverables
											</Label>
											<Button
												type="button"
												variant="af42Outline"
												size="sm"
												onClick={() => addArrayItem('deliverables')}
												className="px-4"
											>
												Add Deliverable
											</Button>
										</div>
										<div className="space-y-3">
											{formData.deliverables.map((del, index) => (
												<div key={index} className="flex gap-3">
													<Input
														value={del}
														onChange={(e) =>
															handleArrayChange('deliverables', index, e.target.value)
														}
														placeholder={`Deliverable ${index + 1}`}
														className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
													/>
													{formData.deliverables.length > 1 && (
														<Button
															type="button"
															variant="ghost"
															size="sm"
															onClick={() => removeArrayItem('deliverables', index)}
															className="text-gray-500 hover:text-gray-900 hover:bg-gray-200"
														>
															Remove
														</Button>
													)}
												</div>
											))}
										</div>
									</div>
								</TabsContent>
							</Tabs>

							<div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
								<Button
									onClick={generateTask}
									variant="af42"
									size="lg"
									className="flex-1 px-8 py-3 text-lg font-bold"
								>
									Generate Task
								</Button>
								<Button variant="af42Outline" onClick={resetForm} size="lg" className="px-8 py-3">
									Reset Form
								</Button>
							</div>
						</CardContent>
					</Card>

					{generatedTask && (
						<Card className="bg-white border border-gray-200 shadow-sm">
							<CardHeader className="border-b border-gray-100">
								<CardTitle className="text-2xl font-bold text-gray-900 font-ibm-plex-mono">
									Generated Task
								</CardTitle>
								<CardDescription className="text-gray-600">
									Copy the generated task below
								</CardDescription>
							</CardHeader>
							<CardContent className="bg-transparent">
								<pre className="whitespace-pre-wrap bg-gray-50 border border-gray-200 p-6 rounded-lg text-sm overflow-auto max-h-96 text-gray-700 font-mono">
									{generatedTask}
								</pre>
								<Button
									variant="af42"
									size="lg"
									className="mt-6 px-8 py-3"
									onClick={() => navigator.clipboard.writeText(generatedTask)}
								>
									Copy to Clipboard
								</Button>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</CompanyDashboardLayout>
	);
};
