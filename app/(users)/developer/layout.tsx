'use client';

import DevLayout from '@/components/layouts/dev-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
	return <DevLayout>{children}</DevLayout>;
}
