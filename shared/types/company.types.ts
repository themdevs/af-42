import { User } from './user.types';
import { Address } from './address.types';

export type Company = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	name: string;
	imageUrl: string | null;
	users: User[];
	credits: number;
	subdomain: string | null;
	registrationNumber: string | null;
	taxId: string | null;
	companyType: string | null;
	industry: string | null;
	address: Address | null;
	socialNetworks: Record<string, string> | null;
	template: Record<string, string> | null;
	secureMode: boolean;
	stateSecurity: boolean;
};

// types/company.ts
export type SlimCompany = Pick<
	Company,
	| 'id'
	| 'createdAt'
	| 'updatedAt'
	| 'name'
	| 'imageUrl'
	| 'subdomain'
	| 'registrationNumber'
	| 'companyType'
	| 'industry'
>;
