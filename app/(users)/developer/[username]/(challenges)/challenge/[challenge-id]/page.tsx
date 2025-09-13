// * this page is for the devs to view the challenge page

export default function ChallengePage({ params }: { params: { id: string } }) {
	const { id } = params;
	console.log(id);
	return <div>DevChallengePage {id}</div>;
}
