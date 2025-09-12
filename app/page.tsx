// import { getUserData } from '@/actions/userdata';
import { redirect } from 'next/navigation';

export default async function Page() {
	// const userData = await getUserData();
	// if (!userData?.user) {
	// 	redirect('/signin');
	// }
	// // Redirection selon le rôle
	// if (userData.role === 'owner' || userData.role === 'admin' || userData.role === 'superAdmin') {
	// 	redirect('/brand/products');
	// } else {
	// 	redirect('/home');
	// }
	// redirect('/Home');
	redirect('/home');
}
