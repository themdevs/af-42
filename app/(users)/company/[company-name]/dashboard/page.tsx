export default function DashboardPage({ params }: { params: { username: string; companyName: string } }) {
	const { username, companyName } = params;
	console.log(username, companyName);
	return <div>CompanyDashboardPage</div>;
}
