import DevNavbar from '../navigation/dev-navbar/DevNavbar';

export default function DevLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="text-slate-700">
			<DevNavbar />
			{children}
		</div>
	);
}
