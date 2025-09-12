import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	serverExternalPackages: ['@mastra/*'],
	devIndicators: {
		appIsrStatus: false,
		position: 'bottom-right',
	},
};

export default nextConfig;
