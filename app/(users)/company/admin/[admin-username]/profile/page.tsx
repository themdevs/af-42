export default function AdminProfilePage({ params }: { params: { adminUsername: string } }) {
	const { adminUsername } = params;
	console.log('adminUsername', adminUsername);
	return <div>AdminProfilePage {adminUsername}</div>;
}
