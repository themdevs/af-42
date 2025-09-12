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
 * Helper function to get filtered cookies for the current company
 */
async function getFilteredCookies(companyHeader?: string): Promise<string> {
	if (typeof window !== 'undefined') {
		// Client-side: filter cookies manually
		const currentCompany =
			companyHeader ||
			(() => {
				const meta = document.querySelector('meta[name="af-42-company"]');
				return meta?.getAttribute('content') || window.location.hostname.split('.')[0];
			})();

		const cookies = document.cookie.split(';');
		const filteredCookies = cookies.filter((cookie) => {
			const name = cookie.trim().split('=')[0];
			// Keep ONLY the JWT cookie for current company + non-JWT cookies
			// Exclude ALL other JWT cookies to avoid conflicts
			return name === `jwtToken-${currentCompany}` || !name.startsWith('jwtToken-');
		});

		return filteredCookies.join(';').trim();
	} else {
		// Server-side: get only the relevant cookie
		try {
			const { cookies } = await import('next/headers');
			const cookieStore = await cookies();
			const company = companyHeader || 'default';

			// Get ONLY the JWT cookie for the current company
			const jwtCookie = cookieStore.get(`jwtToken-${company}`);

			// Include only non-JWT cookies + the current company's JWT cookie
			const otherCookies = cookieStore
				.getAll()
				.filter((cookie) => !cookie.name.startsWith('jwtToken-') || cookie.name === `jwtToken-${company}`);

			const result = otherCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ');

			return result;
		} catch (err) {
			console.error('[makeRequest] Failed to get cookies on server:', err);
			return '';
		}
	}
}

/**
 * Makes an authenticated HTTP request to the API
 * Supports Next.js caching via `next` parameter
 * Automatically attaches 'af-42-company' header based on host
 * Only sends cookies relevant to the current company
 */
export const makeRequest = async (
	endpoint: string,
	method: string,
	token: string | null,
	{ body, baseUrl, headers = {}, next = { revalidate: 1 } }: RequestOptions = {},
): Promise<any> => {
	if (!baseUrl) {
		if (typeof window === 'undefined') {
			baseUrl = Env.get('NEXT_PUBLIC_BACKEND_API_CLIENT');
		} else {
			baseUrl = Env.get('NEXT_PUBLIC_BACKEND_API_CLIENT');
		}
	}

	if (!token) throw new Error('No token provided');

	const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

	// Determine company header
	let companyHeader: string | undefined = undefined;
	if (typeof window !== 'undefined') {
		// Client-side: retrieve company from injected meta tag
		const meta = document.querySelector('meta[name="af-42-company"]');
		companyHeader = meta?.getAttribute('content') || undefined;
	} else {
		// Server-side: use host header from request
		try {
			const { getHeader } = await import('@/utils/get-header');
			const host = await getHeader('x-company');
			companyHeader = host || undefined;
		} catch (err) {
			console.error('[makeRequest] Failed to get host header on server:', err);
		}
	}

	// Get filtered cookies (only relevant to current brand)
	const filteredCookies = await getFilteredCookies(companyHeader);

	const finalHeaders = {
		Authorization: `Bearer ${token}`,
		// Only set Content-Type for requests with body (avoid issues with DELETE requests)
		...(body ? { 'Content-Type': 'application/json' } : {}),
		'x-request-origin': 'af_42',
		...(companyHeader ? { 'af-42-company': companyHeader } : {}),
		...(filteredCookies ? { Cookie: filteredCookies } : {}),
		...headers,
	};

	let response;
	let data;

	try {
		response = await fetch(url, {
			method,
			headers: finalHeaders,
			body: body ? JSON.stringify(body) : undefined,
			credentials: 'omit', // Don't send cookies automatically - we handle them manually
			next,
		});
		data = await response.json();
	} catch (error) {
		console.error(`Error with request ${url}:`, error);
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
