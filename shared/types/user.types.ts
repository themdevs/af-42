import { Company } from './company.types';

export type User = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	email: string;
	firstName: string | null;
	lastName: string | null;
	phoneNumber: string | null;
	companyId: string | null;
	company: Company | null;
	roleId: string;
	pictureUrl: string | null;
	isAf42Admin: boolean;
};
