import Link from 'next/link';

export default function SignedOutFooter() {
	return (
		<footer className="border-t border-gray-800 bg-black">
			<div className="mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
					{/* Company Info */}
					<div className="space-y-3 sm:space-y-4">
						<Link href="/" className="inline-block">
							<h3 className="text-lg sm:text-xl font-bold tracking-tighter flex flex-row items-baseline">
								<span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
									AFTER
								</span>
								<span className="text-white">-42</span>
								<span className="text-xs sm:text-sm text-gray-400 pl-2">Beta</span>
							</h3>
						</Link>
						<p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
							Connecting 42 students with innovative companies and opportunities worldwide.
						</p>
					</div>

					{/* Quick Links */}
					<div className="space-y-3 sm:space-y-4">
						<h4 className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider">
							Quick Links
						</h4>
						<ul className="space-y-1 sm:space-y-2">
							<li>
								<Link
									href="/"
									className="text-xs sm:text-sm text-gray-400 hover:text-cyan-400 transition-colors block py-1"
								>
									What is After-42?
								</Link>
							</li>
							<li>
								<Link
									href="/student"
									className="text-xs sm:text-sm text-gray-400 hover:text-cyan-400 transition-colors block py-1"
								>
									For Students
								</Link>
							</li>
							<li>
								<Link
									href="/company"
									className="text-xs sm:text-sm text-gray-400 hover:text-cyan-400 transition-colors block py-1"
								>
									For Companies
								</Link>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div className="space-y-3 sm:space-y-4">
						<h4 className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider">
							Support
						</h4>
						<ul className="space-y-1 sm:space-y-2">
							<li>
								<Link
									href="/about"
									className="text-xs sm:text-sm text-gray-400 hover:text-cyan-400 transition-colors block py-1"
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									href="/"
									className="text-xs sm:text-sm text-gray-400 hover:text-cyan-400 transition-colors block py-1"
								>
									42 Network
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="text-xs sm:text-sm text-gray-400 hover:text-cyan-400 transition-colors block py-1"
								>
									Contact Us
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="text-xs sm:text-sm text-gray-400 hover:text-cyan-400 transition-colors block py-1"
								>
									FAQ
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div className="space-y-3 sm:space-y-4">
						<h4 className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider">
							Contact
						</h4>
						<div className="space-y-2 text-xs sm:text-sm text-gray-400">
							<p>Email: contact@after-42.com</p>
						</div>
						<div className="flex space-x-3 sm:space-x-4">
							<a
								href="#"
								className="text-gray-500 hover:text-cyan-400 transition-colors p-1"
								aria-label="Follow us on X (formerly Twitter)"
							>
								<span className="sr-only">X (formerly Twitter)</span>
								<svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
								</svg>
							</a>
							<a
								href="#"
								className="text-gray-500 hover:text-cyan-400 transition-colors p-1"
								aria-label="Follow us on LinkedIn"
							>
								<span className="sr-only">LinkedIn</span>
								<svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
										clipRule="evenodd"
									/>
								</svg>
							</a>
							<a
								href="#"
								className="text-gray-500 hover:text-cyan-400 transition-colors p-1"
								aria-label="Follow us on GitHub"
							>
								<span className="sr-only">GitHub</span>
								<svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
										clipRule="evenodd"
									/>
								</svg>
							</a>
						</div>
					</div>
				</div>

				{/* Bottom Footer */}
				<div className="border-t border-gray-800 pt-4 sm:pt-6 lg:pt-8">
					<div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
						<p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
							&copy; 2025 After-42. All rights reserved.
						</p>
						<div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
							<Link
								href="/terms"
								className="text-xs sm:text-sm text-gray-400 hover:text-cyan-400 transition-colors"
							>
								Terms of Service
							</Link>
							<Link
								href="/privacy"
								className="text-xs sm:text-sm text-gray-400 hover:text-cyan-400 transition-colors"
							>
								Privacy Policy
							</Link>
							<Link
								href="/cookies"
								className="text-xs sm:text-sm text-gray-400 hover:text-cyan-400 transition-colors"
							>
								Cookie Policy
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
