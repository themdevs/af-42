import { Env } from '@/env';

type RequestOptions = {
	body?: any;
	baseUrl?: string;
	headers?: Record<string, string>;
	next?: {
		revalidate?: number;
		cache?: 'force-cache' | 'no-store';
		tags?: string[];
	};
};

/**
 * Makes an unauthenticated HTTP request to the API
 * Supports Next.js caching via `next` parameter
 * Automatically attaches 'af-42-company' header based on host
 */
export const makeUnprotectedRequest = async (
	endpoint: string,
	method: string,
	{ body, baseUrl, headers = {}, next = { revalidate: 1 } }: RequestOptions = {},
): Promise<any> => {
	if (!baseUrl) {
		if (typeof window === 'undefined') {
			baseUrl = Env.get('NEXT_PUBLIC_BACKEND_API_CLIENT');
		} else {
			baseUrl = Env.get('NEXT_PUBLIC_BACKEND_API_CLIENT');
		}
	}

	const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

	// Determine company header
	let companyHeader: string | undefined = undefined;

	if (typeof window !== 'undefined') {
		companyHeader = window.location.hostname;
	} else {
		try {
			const { getHeader } = await import('@/utils/get-header');
			const host = await getHeader('af-42-company');
			companyHeader = host || undefined;
		} catch (err) {
			console.error('[makeUnprotectedRequest] Failed to get host header on server:', err);
		}
	}

	const finalHeaders = {
		// Only set Content-Type for requests with body (avoid issues with DELETE requests)
		...(body ? { 'Content-Type': 'application/json' } : {}),
		'x-request-origin': 'af_42',
		...(companyHeader ? { 'af-42-company': companyHeader } : {}),
		...headers,
	};

	let response;
	let data;
	try {
		response = await fetch(url, {
			method,
			headers: finalHeaders,
			body: body ? JSON.stringify(body) : undefined,
			next,
		});
		data = await response.json();
	} catch (jsonError) {
		console.error(`Error with request ${url}:`, jsonError);
		return null;
	}

	if (!response.ok) {
		console.error('Response not ok:', url, method, finalHeaders, body);
		console.error('Response status:', response.status);
		console.error('Response data:', data);

		const error = new Error(data?.message || 'Network response was not ok');
		(error as any).status = response.status;
		(error as any).response = data;
		throw error;
	}

	return { ...data, status: response.status };
};
