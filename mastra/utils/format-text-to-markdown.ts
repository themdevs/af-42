/**
 * Formats English job offer text into proper markdown format
 * @param text - The raw English job offer text
 * @returns Formatted markdown text
 */
export function formatTextToMarkdown(text: string): string {
	if (!text || typeof text !== 'string') {
		return '';
	}

	// Split text into lines and remove excessive whitespace
	const lines = text
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

	if (lines.length === 0) {
		return '';
	}

	const formattedLines: string[] = [];
	let currentSection = '';

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
		const prevLine = i > 0 ? lines[i - 1] : '';

		// Skip empty lines (already filtered out)
		if (!line) continue;

		// Job title (first non-empty line) - make it H1
		if (i === 0) {
			formattedLines.push(`# ${line}`);
			formattedLines.push('');
			continue;
		}

		// Detect section headers based on common patterns
		if (isJobSectionHeader(line)) {
			// Add spacing before new section
			if (formattedLines.length > 0 && formattedLines[formattedLines.length - 1] !== '') {
				formattedLines.push('');
			}

			formattedLines.push(`## ${line}`);
			formattedLines.push('');
			currentSection = line.toLowerCase();
			continue;
		}

		// Detect subsection headers
		if (isSubsectionHeader(line, nextLine)) {
			formattedLines.push(`### ${line}`);
			formattedLines.push('');
			continue;
		}

		// Handle key-value pairs (like "Salary: Not specified")
		if (isKeyValuePair(line)) {
			formattedLines.push(`**${line}**`);
			formattedLines.push('');
			continue;
		}

		// Handle bullet points and lists
		if (isBulletPoint(line)) {
			formattedLines.push(`* ${line.replace(/^[-*•]\s*/, '')}`);
			continue;
		}

		// Handle numbered lists
		if (isNumberedItem(line)) {
			formattedLines.push(line);
			continue;
		}

		// Handle questions (common in job offers)
		if (isQuestion(line)) {
			formattedLines.push(`**${line}**`);
			formattedLines.push('');
			continue;
		}

		// Handle special formatting for requirements, skills, etc.
		if (isRequirement(line)) {
			formattedLines.push(`* ${line}`);
			continue;
		}

		// Regular paragraph text
		formattedLines.push(line);

		// Add spacing after paragraphs if the next line is not a bullet point or continuation
		if (nextLine && !isBulletPoint(nextLine) && !isNumberedItem(nextLine) && !isKeyValuePair(nextLine)) {
			formattedLines.push('');
		}
	}

	// Clean up excessive empty lines
	const result = formattedLines
		.join('\n')
		.replace(/\n{3,}/g, '\n\n') // Replace 3+ consecutive newlines with 2
		.trim();

	return result;
}

/**
 * Checks if a line is a section header
 */
function isJobSectionHeader(line: string): boolean {
	const sectionPatterns = [
		/^job title$/i,
		/^job description$/i,
		/^company description$/i,
		/^qualifications$/i,
		/^requirements$/i,
		/^responsibilities$/i,
		/^tasks$/i,
		/^skills$/i,
		/^experience$/i,
		/^benefits$/i,
		/^location$/i,
		/^salary$/i,
		/^recruitment process$/i,
		/^who we are$/i,
		/^must have( skills?)?$/i,
		/^nice to have( skills?)?$/i,
		/^the position$/i,
		/^your role$/i,
		/^what about you\??$/i,
		/^about (you|the role)$/i,
		/^role overview$/i,
		/^key responsibilities$/i,
		/^what we offer$/i,
		/^what you'll do$/i,
		/^what we're looking for$/i,
		/^preferred qualifications$/i,
		/^technical requirements$/i,
	];

	return sectionPatterns.some((pattern) => pattern.test(line));
}

/**
 * Checks if a line is a subsection header
 */
function isSubsectionHeader(line: string, nextLine: string): boolean {
	// Short lines that are followed by content might be subsection headers
	if (line.length < 50 && nextLine && nextLine.length > line.length) {
		// Check if it ends with a colon or is all caps
		return line.endsWith(':') || line === line.toUpperCase();
	}
	return false;
}

/**
 * Checks if a line is a key-value pair
 */
function isKeyValuePair(line: string): boolean {
	return /^[^:]+:\s*.+$/.test(line) && line.length < 100;
}

/**
 * Checks if a line is a bullet point
 */
function isBulletPoint(line: string): boolean {
	return /^[-*•]\s+/.test(line);
}

/**
 * Checks if a line is a numbered item
 */
function isNumberedItem(line: string): boolean {
	return /^\d+[.)]\s+/.test(line) || /^[1-9]️⃣/.test(line);
}

/**
 * Checks if a line is a question
 */
function isQuestion(line: string): boolean {
	return line.endsWith('?') && line.length < 200;
}

/**
 * Checks if a line is a requirement or skill item
 */
function isRequirement(line: string): boolean {
	const requirementPatterns = [
		/^experience.+/i,
		/^knowledge.+/i,
		/^proficiency.+/i,
		/^fluent.+/i,
		/^\d+\+?\s+years?.+/i,
		/^(bachelor|master|degree).+/i,
		/^strong.+/i,
		/^excellent.+/i,
		/^solid.+/i,
		/^proven.+/i,
		/^familiarity.+/i,
		/^understanding.+/i,
	];

	return requirementPatterns.some((pattern) => pattern.test(line)) && line.length < 300;
}
