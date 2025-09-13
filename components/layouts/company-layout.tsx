'use client';

import CompanyLayout from '@/components/layouts/company-layout';
// todo: update from main-layout to devs-layout with the appropriate navigations and sidebar
export default function Layout({ children }: { children: React.ReactNode }) {
	return <CompanyLayout>{children}</CompanyLayout>;
}
