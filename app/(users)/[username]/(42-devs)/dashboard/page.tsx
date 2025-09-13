export default function DashboardPage({ params }: { params: { username: string } }) {
	const { username } = params;
	console.log(username);
	return <div>DashboardPage</div>;
}
