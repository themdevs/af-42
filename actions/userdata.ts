import { cookies, headers } from 'next/headers';
import { UserData } from '@/shared/types/user-data.types';
import { makeRequest } from '@/utils/make-requests';
import { makeUnprotectedRequest } from '@/utils/make-unprotected-requests';

export const getUserData = async (forceFetch = false): Promise<UserData | null> => {
	const headersList = await headers();
	const company = headersList.get('af-42-company') || '';
	const token = (await cookies()).get(`jwtToken-${company}`)?.value || null;

	try {
		// Use makeRequest which automatically handles token if present, or makeUnprotectedRequest if no token
		if (token) {
			return await makeRequest(`/user`, 'GET', token, {
				next: {
					tags: ['account'],
				},
			});
		} else {
			return await makeUnprotectedRequest(`/user`, 'GET', {
				next: {
					tags: ['account'],
				},
			});
		}
	} catch (error: any) {
		console.error('Error fetching user data:', error);
		return null;
	}
};
