import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
	return (
		<div className="min-h-screen bg-black text-white">
			{/* Hero Section */}
			<section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]"></div>
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
					<div className="text-center">
						<Badge variant="outline" className="mb-8 border-cyan-400/50 text-cyan-400 bg-cyan-400/10 text-sm">
							🚀 AI-Powered Hiring Platform
						</Badge>
						<h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-8">
							<span className="text-white">Discover and hire the best 42 developers with ease.</span>
						</h1>
						<p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
							The AI-powered platform that generates custom technical challenges, filters through the
							exclusive 42 developer network, and matches companies with the perfect candidates.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							<Button
								size="lg"
								className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25"
								asChild
							>
								<Link href="/for-companies">For Companies</Link>
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black px-8 py-4 text-lg font-semibold transition-all duration-300"
								asChild
							>
								<Link href="/for-devs">For 42 Developers</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-24 bg-gray-900/50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
							<span className="text-white">Powered by </span>
							<span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
								Advanced AI
							</span>
						</h2>
						<p className="text-xl text-gray-300 max-w-3xl mx-auto">
							Our platform leverages cutting-edge artificial intelligence to revolutionize
							<br /> technical hiring and talent matching.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						<Card className="bg-gray-800/50 border-gray-700 hover:border-cyan-400/50 transition-all duration-300 group">
							<CardContent className="p-8">
								<div className="w-12 h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-400/30 transition-colors">
									<svg
										className="w-6 h-6 text-cyan-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-semibold text-white mb-4">AI Challenge Generation</h3>
								<p className="text-gray-300 leading-relaxed">
									Generate custom technical challenges tailored to your specific tech stack, role
									requirements, and company culture using advanced AI algorithms.
								</p>
							</CardContent>
						</Card>

						<Card className="bg-gray-800/50 border-gray-700 hover:border-cyan-400/50 transition-all duration-300 group">
							<CardContent className="p-8">
								<div className="w-12 h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-400/30 transition-colors">
									<svg
										className="w-6 h-6 text-cyan-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-semibold text-white mb-4">Elite Developer Network</h3>
								<p className="text-gray-300 leading-relaxed">
									Access an exclusive pool of developers from the prestigious 42 network, known for
									their exceptional problem-solving skills and technical expertise.
								</p>
							</CardContent>
						</Card>

						<Card className="bg-gray-800/50 border-gray-700 hover:border-cyan-400/50 transition-all duration-300 group">
							<CardContent className="p-8">
								<div className="w-12 h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-cyan-400/30 transition-colors">
									<svg
										className="w-6 h-6 text-cyan-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-semibold text-white mb-4">Smart Matching</h3>
								<p className="text-gray-300 leading-relaxed">
									Our AI analyzes candidate performance, skills, and cultural fit to match you with
									the perfect developers for your team and project needs.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-24 bg-black">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div className="text-center">
							<div className="text-4xl sm:text-5xl font-bold text-cyan-400 mb-2">500+</div>
							<div className="text-gray-300 text-lg">42 Developers</div>
							<div className="text-gray-500 text-sm">In our network</div>
						</div>
						<div className="text-center">
							<div className="text-4xl sm:text-5xl font-bold text-cyan-400 mb-2">95%</div>
							<div className="text-gray-300 text-lg">Success Rate</div>
							<div className="text-gray-500 text-sm">Perfect matches</div>
						</div>
						<div className="text-center">
							<div className="text-4xl sm:text-5xl font-bold text-cyan-400 mb-2">48h</div>
							<div className="text-gray-300 text-lg">Average Time</div>
							<div className="text-gray-500 text-sm">To find candidates</div>
						</div>
						<div className="text-center">
							<div className="text-4xl sm:text-5xl font-bold text-cyan-400 mb-2">100+</div>
							<div className="text-gray-300 text-lg">Companies</div>
							<div className="text-gray-500 text-sm">Trust our platform</div>
						</div>
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="py-24 bg-gray-900/50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
							<span className="text-white">How It </span>
							<span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
								Works
							</span>
						</h2>
						<p className="text-xl text-gray-300 max-w-3xl mx-auto">
							Simple, efficient, and powered by AI. Get started in minutes.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="w-16 h-16 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
								<span className="text-2xl font-bold text-cyan-400">1</span>
							</div>
							<h3 className="text-xl font-semibold text-white mb-4">Define Your Needs</h3>
							<p className="text-gray-300 leading-relaxed">
								Tell us about your tech stack, role requirements, and company culture. Our AI analyzes
								your needs to create the perfect challenge.
							</p>
						</div>

						<div className="text-center">
							<div className="w-16 h-16 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
								<span className="text-2xl font-bold text-cyan-400">2</span>
							</div>
							<h3 className="text-xl font-semibold text-white mb-4">AI Generates Challenges</h3>
							<p className="text-gray-300 leading-relaxed">
								Our advanced AI creates custom technical challenges that accurately assess the skills
								you're looking for in candidates.
							</p>
						</div>

						<div className="text-center">
							<div className="w-16 h-16 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
								<span className="text-2xl font-bold text-cyan-400">3</span>
							</div>
							<h3 className="text-xl font-semibold text-white mb-4">Get Matched</h3>
							<p className="text-gray-300 leading-relaxed">
								Receive pre-screened candidates from the 42 network who have completed your custom
								challenges and are ready to interview.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-24 bg-gradient-to-r from-cyan-600 to-cyan-700">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
						Ready to Find Your Perfect Developer?
					</h2>
					<p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
						Join hundreds of companies who trust After-42 to connect them with elite talent from the 42
						network.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							size="lg"
							variant="secondary"
							className="bg-white text-cyan-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
							asChild
						>
							<Link href="/for-companies">Start Hiring Today</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="border-white text-white hover:bg-white hover:text-cyan-700 px-8 py-4 text-lg font-semibold transition-all duration-300"
							asChild
						>
							<Link href="/about">Learn More</Link>
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
