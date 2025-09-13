'use client';

import MainLayout from '@/components/layouts/main-layout';

// todo: update from main-layout to companies-layout with the appropriate navigations and sidebar
// todo: make sure the navigations and sidebar are disabled when the user is on the create-company page
export default function Layout({ children }: { children: React.ReactNode }) {
	return <MainLayout>{children}</MainLayout>;
}
