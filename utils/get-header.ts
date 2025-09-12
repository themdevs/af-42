'use server';

import { headers } from 'next/headers';

export async function getHeader(header: string) {
	const headersList = await headers();
	return headersList.get(header);
}
