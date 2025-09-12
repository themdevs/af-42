import Header from '@/components/navigation/signed-out/Header';
import Footer from '@/components/navigation/signed-out/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="text-slate-700">
			<Header />
			{children}
			<Footer />
		</div>
	);
}
