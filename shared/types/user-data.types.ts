import { Company } from './company.types';
import { User } from './user.types';

/**
 * Comprehensive user data structure including account details,
 * address information, role, and authentication token
 */
export type UserData = {
	user: User | null;
	role: string | null;
	token: string | null;
	company: Company | null;
};
