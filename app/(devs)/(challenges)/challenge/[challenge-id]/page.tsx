export default function ChallengePage({ params }: { params: { id: string } }) {
	const { id } = params;
	console.log(id);
	return <div>ChallengePage {id}</div>;
}
