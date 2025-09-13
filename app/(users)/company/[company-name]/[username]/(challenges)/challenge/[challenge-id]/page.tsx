export default function CompanyChallengePage({ params }: { params: { challengeId: string } }) {
	const { challengeId } = params;
	return <div>CompanyChallengePage {challengeId}</div>;
}
