'use client';

// React hooks
import { useState, useMemo } from 'react';

// UI Components from shadcn/ui
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent } from '@/components/ui/tabs';

// Icons and notifications
import { Copy, Download, Search, Filter, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

// Import all technology datasets from JSON files
import * as aiDataset from '../app/data-json/ai-dataset.json';
import * as blockchainDataset from '../app/data-json/blockchain-dataset.json';
import * as cryptographyDataset from '../app/data-json/cryptography-dataset.json';
import * as cybersecurityDataset from '../app/data-json/cyber-dataset.json';
import * as dataScienceDataset from '../app/data-json/data-science-dataset.json';
import * as dbDataset from '../app/data-json/db-dataset.json';
import * as deepLearningDataset from '../app/data-json/deep-learning-dataset.json';
import * as devOpsDataset from '../app/data-json/devops-dataset.json';
import * as gamingDataset from '../app/data-json/game-developement-dataset.json';
import * as generativeAiDataset from '../app/data-json/generative-ai-dataset.json';
import * as graphicsDataset from '../app/data-json/graphics-dataset.json';
import * as hardwareDataset from '../app/data-json/hardware-and-low-level-dataset.json';
import * as kernelDataset from '../app/data-json/kernel-dataset.json';
import * as languagesDataset from '../app/data-json/languages-dataset.json';
import * as machineLearningDataset from '../app/data-json/machine-learning-dataset.json';
import * as mobileDataset from '../app/data-json/mobile-development-dataset.json';
import * as programingLanguagesDataset from '../app/data-json/programing-languages.json';
import * as webDevelopmentDataset from '../app/data-json/web-development-dataset.json';
import * as web3Dataset from '../app/data-json/web3-dataset.json';

// Dataset configuration - maps dataset keys to their data and display names
const datasets = [
	{ key: 'ai', name: 'AI & Machine Learning', data: aiDataset },
	{ key: 'blockchain', name: 'Blockchain', data: blockchainDataset },
	{ key: 'cryptography', name: 'Cryptography', data: cryptographyDataset },
	{ key: 'cybersecurity', name: 'Cybersecurity', data: cybersecurityDataset },
	{ key: 'dataScience', name: 'Data Science', data: dataScienceDataset },
	{ key: 'database', name: 'Database', data: dbDataset },
	{ key: 'deepLearning', name: 'Deep Learning', data: deepLearningDataset },
	{ key: 'devOps', name: 'DevOps', data: devOpsDataset },
	{ key: 'gaming', name: 'Game Development', data: gamingDataset },
	{ key: 'generativeAi', name: 'Generative AI', data: generativeAiDataset },
	{ key: 'graphics', name: 'Graphics', data: graphicsDataset },
	{ key: 'hardware', name: 'Hardware & Low-level', data: hardwareDataset },
	{ key: 'kernel', name: 'Kernel', data: kernelDataset },
	{ key: 'languages', name: 'Programming Languages', data: languagesDataset },
	{ key: 'machineLearning', name: 'Machine Learning', data: machineLearningDataset },
	{ key: 'mobile', name: 'Mobile Development', data: mobileDataset },
	{ key: 'programmingLanguages', name: 'Programming Languages', data: programingLanguagesDataset },
	{ key: 'webDevelopment', name: 'Web Development', data: webDevelopmentDataset },
	{ key: 'web3', name: 'Web3', data: web3Dataset },
];

// TypeScript interfaces for data structure
interface DatasetItem {
	name: string; // Technology/tool name
	official_docs?: string; // Optional documentation URL
	official_website?: string; // Optional official website URL
}

interface CategoryData {
	[key: string]: DatasetItem[] | DatasetItem | any; // Flexible category structure
}

// Main component for selecting technology stacks
export const DataSelectionComponent = () => {
	// Component state management
	const [searchTerm, setSearchTerm] = useState(''); // Search filter for categories/items
	const [selectedDataset, setSelectedDataset] = useState('ai'); // Currently selected dataset
	const [selectedKeys, setSelectedKeys] = useState<string[]>([]); // Array of selected item keys
	const [outputJson, setOutputJson] = useState<Record<string, any>>({}); // Generated JSON output

	// Get the currently selected dataset
	const currentDataset = datasets.find((d) => d.key === selectedDataset)?.data as CategoryData;

	// Filter categories based on search term (searches both category names and item names)
	const filteredCategories = useMemo(() => {
		if (!searchTerm) return Object.keys(currentDataset || {});

		return Object.keys(currentDataset || {}).filter(
			(category) =>
				category.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(Array.isArray(currentDataset[category]) &&
					(currentDataset[category] as DatasetItem[]).some((item) =>
						item.name.toLowerCase().includes(searchTerm.toLowerCase()),
					)),
		);
	}, [currentDataset, searchTerm]);

	// Event handlers for user interactions

	// Handle individual item selection within a category
	const handleItemToggle = (categoryKey: string, itemIndex: number) => {
		const key = `${selectedDataset}.${categoryKey}.${itemIndex}`;
		const newSelectedKeys = selectedKeys.includes(key)
			? selectedKeys.filter((k) => k !== key)
			: [...selectedKeys, key];

		setSelectedKeys(newSelectedKeys);
		generateOutput(newSelectedKeys);
	};

	// Generate JSON output from selected keys
	// Keys format: "dataset.category.itemIndex" or "dataset.category"
	const generateOutput = (keys: string[]) => {
		const output: Record<string, any> = {};

		keys.forEach((key) => {
			const parts = key.split('.');
			const datasetKey = parts[0]; // e.g., "ai"
			const categoryKey = parts[1]; // e.g., "machine_learning"
			const itemIndex = parts[2]; // e.g., "0" (for individual items)

			const dataset = datasets.find((d) => d.key === datasetKey);

			if (dataset && dataset.data && (dataset.data as any)[categoryKey]) {
				if (!output[datasetKey]) {
					output[datasetKey] = {};
				}

				const categoryData = (dataset.data as any)[categoryKey];

				if (itemIndex !== undefined) {
					// Individual item selection - add specific item to array
					if (Array.isArray(categoryData) && categoryData[parseInt(itemIndex)]) {
						if (!output[datasetKey][categoryKey]) {
							output[datasetKey][categoryKey] = [];
						}
						output[datasetKey][categoryKey].push(categoryData[parseInt(itemIndex)]);
					}
				} else {
					// Entire category selection - add all category data
					output[datasetKey][categoryKey] = categoryData;
				}
			}
		});

		setOutputJson(output);
	};

	// Utility functions for exporting data
	// Copy JSON to clipboard
	const copyToClipboard = () => {
		navigator.clipboard.writeText(JSON.stringify(outputJson, null, 2));
		toast.success('JSON copied to clipboard!');
	};

	// Download JSON as file
	const downloadJson = () => {
		const blob = new Blob([JSON.stringify(outputJson, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'selected-data.json';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		toast.success('JSON file downloaded!');
	};

	return (
		<div className="max-w-7xl mx-auto p-6 space-y-6">
			{/* Page Header */}
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">Stack Selection Tool</h1>
				<p className="text-muted-foreground">
					Select categories and items from various technology fields to generate custom JSON output
				</p>
			</div>

			{/* Main Content Grid - 3 columns on large screens */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column: Field/Dataset Selection */}
				<Card className="lg:col-span-1">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Filter className="h-5 w-5" />
							Field Selection
						</CardTitle>
						<CardDescription>Choose the field or your tech challenge</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Tabs value={selectedDataset} onValueChange={setSelectedDataset}>
							<TabsContent
								value={selectedDataset}
								className="space-y-2 p-0 m-0 border-1 border-muted rounded-lg"
							>
								<ScrollArea className="h-64">
									<div className="space-y-1">
										{datasets.map((dataset) => (
											<Button
												key={dataset.key}
												variant={selectedDataset === dataset.key ? 'default' : 'ghost'}
												className="w-full justify-start text-left h-auto p-3"
												onClick={() => setSelectedDataset(dataset.key)}
											>
												<div>
													<div className="font-medium">{dataset.name}</div>
													<div className="text-xs text-muted-foreground">
														{Object.keys(dataset.data).length} categories
													</div>
												</div>
											</Button>
										))}
									</div>
								</ScrollArea>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>

				{/* Middle Column: Category and Item Selection */}
				<Card className="lg:col-span-1">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Search className="h-5 w-5" />
							Category Selection
						</CardTitle>
						<CardDescription>
							Search and select categories from {datasets.find((d) => d.key === selectedDataset)?.name}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Search Input */}
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search categories or items..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>

						{/* Categories and Items List */}
						<ScrollArea className="h-96">
							<div className="space-y-3">
								{/* Render each filtered category */}
								{filteredCategories.map((category) => {
									const categoryData = currentDataset[category];
									const isArray = Array.isArray(categoryData);

									return (
										<div key={category} className="space-y-2">
											{/* Render individual items if category contains array data */}
											{isArray && (categoryData as DatasetItem[]).length > 0 && (
												<div className="ml-4 space-y-1 border-l-2 border-muted pl-4">
													{/* Category header */}
													<div className="mb-2">
														<div className="text-xs font-medium text-muted-foreground">
															{category}:
														</div>
													</div>
													{/* Render each item in the category */}
													{(categoryData as DatasetItem[]).map((item, index) => {
														const itemKey = `${selectedDataset}.${category}.${index}`;
														const isItemSelected = selectedKeys.includes(itemKey);

														return (
															<div
																key={index}
																className="flex items-center space-x-2 p-1 rounded border bg-background"
															>
																{/* Selection checkbox */}
																<Checkbox
																	id={itemKey}
																	checked={isItemSelected}
																	onCheckedChange={() =>
																		handleItemToggle(category, index)
																	}
																/>
																{/* Item details */}
																<Label
																	htmlFor={itemKey}
																	className="flex-1 cursor-pointer"
																>
																	<div className="text-sm font-medium">
																		{item.name}
																	</div>
																	{/* Show documentation URL if available */}
																	{item.official_docs && (
																		<div className="text-xs text-muted-foreground truncate">
																			{item.official_docs}
																		</div>
																	)}
																</Label>
																{/* Selection indicator */}
																{isItemSelected && (
																	<CheckCircle2 className="h-3 w-3 text-green-500" />
																)}
															</div>
														);
													})}
												</div>
											)}
										</div>
									);
								})}
							</div>
						</ScrollArea>

						{/* Selection controls - show when items are selected */}
						{selectedKeys.length > 0 && (
							<div className="pt-4 border-t">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">{selectedKeys.length} selected</span>
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											setSelectedKeys([]);
											setOutputJson({});
										}}
									>
										Clear All
									</Button>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Right Column: JSON Output Preview and Export */}
				<Card className="lg:col-span-1">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Download className="h-5 w-5" />
							JSON Output
						</CardTitle>
						<CardDescription>Preview and export your selected data</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Show JSON output if items are selected */}
						{Object.keys(outputJson).length > 0 ? (
							<>
								{/* JSON preview */}
								<ScrollArea className="h-96 border rounded-lg p-4 bg-muted/50">
									<pre className="text-xs font-mono whitespace-pre-wrap">
										{JSON.stringify(outputJson, null, 2)}
									</pre>
								</ScrollArea>

								{/* Export buttons */}
								<div className="flex gap-2">
									<Button onClick={copyToClipboard} className="flex-1">
										<Copy className="h-4 w-4 mr-2" />
										Copy JSON
									</Button>
									<Button onClick={downloadJson} variant="outline" className="flex-1">
										<Download className="h-4 w-4 mr-2" />
										Download
									</Button>
								</div>
							</>
						) : (
							<div className="h-96 flex items-center justify-center border rounded-lg bg-muted/50">
								<div className="text-center text-muted-foreground">
									<Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
									<p>Select categories to generate JSON output</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Bottom Section: Selected Items Summary */}
			{selectedKeys.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Selected Items Summary</CardTitle>
						<CardDescription>Overview of your current selection</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{/* Selected items badges */}
							<div className="flex flex-wrap gap-2">
								{selectedKeys.map((key) => {
									const parts = key.split('.');
									const datasetKey = parts[0];
									const categoryKey = parts[1];
									const itemIndex = parts[2];
									const dataset = datasets.find((d) => d.key === datasetKey);

									if (itemIndex !== undefined) {
										// Individual item selection - show specific item
										const categoryData = (dataset?.data as any)?.[categoryKey];
										const item = Array.isArray(categoryData)
											? categoryData[parseInt(itemIndex)]
											: null;
										return (
											<Badge key={key} variant="outline" className="text-xs">
												{dataset?.name} → {categoryKey} → {item?.name || `Item ${itemIndex}`}
											</Badge>
										);
									} else {
										// Category selection - show entire category
										return (
											<Badge key={key} variant="secondary" className="text-xs">
												{dataset?.name} → {categoryKey} (All)
											</Badge>
										);
									}
								})}
							</div>

							{/* Selection Statistics */}
							<div className="pt-2 border-t">
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<span className="font-medium">Categories:</span>{' '}
										{selectedKeys.filter((key) => key.split('.').length === 2).length}
									</div>
									<div>
										<span className="font-medium">Individual Items:</span>{' '}
										{selectedKeys.filter((key) => key.split('.').length === 3).length}
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
};
