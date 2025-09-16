# Tech Stack Extraction Utility

This utility provides a comprehensive function to extract tech stack information from translated text using AI models and automatically populate JSON objects for the stack selection tool.

## Features

- **AI-Powered Extraction**: Uses OpenAI models to intelligently extract tech stack information
- **Automatic JSON Population**: Converts extracted data into the proper format for stack selection tools
- **Robust Error Handling**: Comprehensive validation and error handling with user-friendly messages
- **Retry Logic**: Exponential backoff retry mechanism for transient failures
- **Timeout Protection**: Configurable timeout to prevent hanging requests
- **Type Safety**: Full TypeScript support with proper interfaces
- **Performance Monitoring**: Detailed metadata about processing time and results

## Usage

### Basic Usage

```typescript
import { extractTechStackFromTranslatedText } from './extract-tech-stack-from-translated-text';

const translatedText = `
  We are looking for a Senior Frontend Developer with experience in React, TypeScript, and Next.js.
  The ideal candidate should have knowledge of modern frontend technologies including:
  - React 18+ with hooks and functional components
  - TypeScript for type safety
  - Next.js for SSR and SSG
  - Tailwind CSS for styling
  - Jest and Cypress for testing
`;

const result = await extractTechStackFromTranslatedText(translatedText);

if (result.success && result.techStack) {
  console.log('Extracted tech stack:', result.techStack);
  // Use result.techStack in your stack selection tool
}
```

### Merging with Existing JSON

```typescript
const existingJson = {
  role_title: 'Software Engineer',
  domain: 'E-commerce Platform',
  company_context_priority: 'strict',
};

const result = await extractTechStackFromTranslatedText(translatedText, existingJson);

// The result will merge the extracted tech stack with the existing JSON
```

### Integration with File Processing Workflow

#### Client-Side Integration (React Components)

```typescript
// After extracting text from a file and translating it - from a client component
const extractedText = await extractTextFromFile(file);
const translatedText = await translateExtractedTextFromFile(extractedText.text);

// Use the API route for client-side components
const response = await fetch('/api/extract-tech-stack', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    translatedText: translatedText.translatedText,
    existingJsonConfig: existingJsonString,
  }),
});

const techStackResult = await response.json();

if (techStackResult.success) {
  // Use techStackResult.techStack in your application
  updateStackSelectionTool(techStackResult.techStack);
}
```

#### Server-Side Integration (API Routes, Server Components)

```typescript
// After extracting text from a file and translating it - from server-side code
const extractedText = await extractTextFromFile(file);
const translatedText = await translateExtractedTextFromFile(extractedText.text);
const techStackResult = await extractTechStackFromTranslatedText(translatedText.translatedText);

if (techStackResult.success) {
  // Use techStackResult.techStack in your application
  updateStackSelectionTool(techStackResult.techStack);
}
```

## API Reference

### API Route (Client-Side)

#### `POST /api/extract-tech-stack`

**Request Body:**
```typescript
{
  translatedText: string;
  existingJsonConfig?: string; // Optional existing JSON config as string
}
```

**Response:**
```typescript
{
  success: boolean;
  techStack?: StackSelectionJson;
  error?: string;
  metadata?: {
    originalLength: number;
    processingTimeMs: number;
    extractedCount: number;
  };
}
```

**Example:**
```typescript
const response = await fetch('/api/extract-tech-stack', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    translatedText: "Senior Frontend Developer with React, TypeScript...",
    existingJsonConfig: '{"domain": "E-commerce"}',
  }),
});

const result = await response.json();
```

### Server-Side Function

### `extractTechStackFromTranslatedText(translatedText: string, existingJson?: StackSelectionJson): Promise<TechStackExtractionResult>`

#### Parameters

- `translatedText` (string): The translated text to extract tech stack from
- `existingJson` (optional): Existing JSON object to merge with extracted data

#### Returns

A `TechStackExtractionResult` object with:

- `success` (boolean): Whether the extraction was successful
- `techStack` (optional): The extracted and formatted tech stack JSON
- `error` (optional): Error message if extraction failed
- `metadata` (optional): Processing metadata including timing and counts

### Types

#### `TechStackExtractionResult`

```typescript
interface TechStackExtractionResult {
  success: boolean;
  techStack?: {
    role_title?: string;
    seniority?: 'junior' | 'mid' | 'senior';
    tech_stack?: {
      languages: string[];
      frameworks: string[];
      databases: string[];
      devops: string[];
      cloud: string[];
      testing: string[];
      tools: string[];
      other: string[];
    };
    assumptions?: string[];
  };
  error?: string;
  metadata?: {
    originalLength: number;
    processingTimeMs: number;
    extractedCount: number;
  };
}
```

#### `StackSelectionJson`

```typescript
interface StackSelectionJson {
  role_title?: string;
  seniority?: 'junior' | 'mid' | 'senior';
  primary_stack?: string[];
  secondary_stack?: string[];
  domain?: string;
  difficulty?: 'junior' | 'mid' | 'senior';
  focus_areas?: string[];
  non_goals?: string[];
  company_context_priority?: string;
  evaluation_mode?: string;
  deliverable_format?: string;
  output_language?: string;
  privacy_constraints?: string[];
  inclusion_requirements?: string[];
  prohibited_items?: string[];
  extra_credit_themes?: string[];
  technical_stack?: string[];
  [key: string]: any;
}
```

## Configuration

The utility uses the following configuration constants:

```typescript
const CONFIG = {
  MAX_TEXT_LENGTH: 50000,    // Maximum characters to prevent API limits
  MIN_TEXT_LENGTH: 10,       // Minimum characters for meaningful extraction
  TIMEOUT_MS: 30000,         // 30 seconds timeout
  RETRY_ATTEMPTS: 3,         // Number of retry attempts for failed requests
  RETRY_DELAY_MS: 1000,      // Delay between retries in milliseconds
};
```

## Error Handling

The function handles various error scenarios:

- **Input Validation**: Checks for empty, too short, or too long text
- **Network Errors**: Retries with exponential backoff for transient failures
- **Timeout Errors**: Prevents hanging requests with configurable timeout
- **Rate Limiting**: Handles API rate limit errors gracefully
- **Authentication Errors**: Provides clear error messages for auth failures
- **Parsing Errors**: Handles malformed responses from the agent

## Examples

See `example-usage.ts` for comprehensive examples including:

- Basic extraction
- Merging with existing JSON
- Integration with file processing workflow
- Error handling demonstration
- Batch processing multiple texts

## Dependencies

- `@mastra/core/agent` - For the tech stack extractor agent
- `@ai-sdk/openai` - For OpenAI integration
- `zod` - For schema validation (if used in other parts)

## Performance

The function includes performance monitoring and will log:
- Processing time
- Number of technologies extracted
- Text length processed
- Success/failure status

Typical processing times range from 2-10 seconds depending on text length and complexity.
