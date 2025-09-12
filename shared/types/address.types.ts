import { Company } from './company.types';

export type Address = {
	id: string;
	street: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
	companyId: string;
	company?: Company;
};
