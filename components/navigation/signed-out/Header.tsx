import { useState } from 'react';
import Link from 'next/link';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
// import { logIn, logout } from '@/actions/auth';
import { Button } from '@/components/ui/button';

const navLinks = [
	{
		href: '/what',
		label: 'WHAT IS AFTER-42?',
		description: 'What is After-42?',
	},
	{
		href: '/for-devs',
		label: 'FOR 42 DEVS',
		description: 'Home page for 42 Devs',
	},
	{
		href: '/for-companies',
		label: 'FOR COMPANIES',
		description: 'Home page for companies',
	},
	{
		href: '/about',
		label: 'ABOUT US',
		description: 'About us',
	},
	{
		href: '/faq',
		label: 'FAQ',
		description: 'FAQ',
	},
];

export default function SignedOutHeader() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<>
			<header className="border-b border-gray-800 shadow-lg sticky top-0 z-50 bg-black/95 backdrop-blur-sm relative">
				<nav className="min-h-[60px] flex items-center justify-between px-4 py-3 md:px-6 lg:px-8">
					{/* Logo */}
					<Link href="/home" className="flex-shrink-0">
						<h2 className="text-lg sm:text-xl md:text-xl font-semibold tracking-tighter hover:text-cyan-400 transition-all duration-200 flex flex-row items-baseline font-source-code-pro">
							<span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
								AFTER
							</span>
							<span className="text-white">-42</span>
							<span className="text-xs sm:text-sm text-gray-400 pl-2">Beta</span>
						</h2>
					</Link>

					{/* Desktop Navigation - Hidden on mobile/tablet */}
					<div className="hidden xl:block">
						<NavigationMenu>
							<NavigationMenuList className="flex flex-row gap-4 justify-center items-center font-ibm-plex-mono">
								{navLinks.map(({ href, label }) => (
									<NavigationMenuItem key={href}>
										<Link
											href={href}
											className="text-sm font-bold text-gray-300 hover:text-cyan-400 transition-all duration-200 whitespace-nowrap"
										>
											{label}
										</Link>
									</NavigationMenuItem>
								))}
							</NavigationMenuList>
						</NavigationMenu>
					</div>

					{/* Desktop Auth Buttons - Hidden on mobile/tablet */}
					<div className="hidden md:flex flex-row gap-2">
						<Button
							// onClick={() => logIn()}
							size="sm"
							className="bg-cyan-600 hover:bg-cyan-700 text-white border-2 border-cyan-600 hover:border-cyan-700 transition-all duration-300 transform hover:scale-105 text-xs lg:text-sm"
						>
							Log In
						</Button>
						<Button
							// onClick={() => logout()}
							size="sm"
							className="bg-cyan-600 hover:bg-cyan-700 text-white border-2 border-cyan-600 hover:border-cyan-700 transition-all duration-300 transform hover:scale-105 text-xs lg:text-sm"
						>
							Sign Out
						</Button>
					</div>

					{/* Mobile Menu Toggle - Visible on mobile/tablet */}
					<Button
						variant="outline"
						size="sm"
						className="md:hidden p-2 border-gray-700 text-gray-300 bg-transparent hover:bg-gray-800 hover:text-cyan-400 hover:border-cyan-400 transition-all duration-200"
						aria-label="Toggle navigation menu"
						onClick={toggleMenu}
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
							/>
						</svg>
					</Button>
				</nav>
			</header>

			{/* Mobile Navigation Menu */}
			{isMenuOpen && (
				<div className="md:hidden border-b border-gray-800 bg-black/95 backdrop-blur-sm absolute top-[60px] left-0 right-0 z-40 shadow-lg">
					<div className="px-4 py-6">
						{/* Mobile Navigation Links */}
						<div className="space-y-4 mb-6 font-ibm-plex-mono">
							{navLinks.map(({ href, label }) => (
								<Link
									key={href}
									href={href}
									className="block text-sm font-bold text-gray-300 hover:text-cyan-400 transition-all duration-200 py-2 border-b border-gray-800 last:border-b-0"
									onClick={() => setIsMenuOpen(false)}
								>
									{label}
								</Link>
							))}
						</div>

						{/* Mobile Auth Section */}
						<div className="flex flex-col gap-3 w-full">
							<Button
								onClick={() => {
									// logIn();
									setIsMenuOpen(false);
								}}
								className="w-full bg-cyan-600 hover:bg-cyan-700 text-white border-2 border-cyan-600 hover:border-cyan-700 transition-all duration-300"
							>
								Log In
							</Button>
							<Button
								onClick={() => {
									// logout();
									setIsMenuOpen(false);
								}}
								className="w-full bg-cyan-600 hover:bg-cyan-700 text-white border-2 border-cyan-600 hover:border-cyan-700 transition-all duration-300"
							>
								Sign Out
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
