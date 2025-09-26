import { LOGIN_TOKEN } from '@/ApiSetUp/AuthApi';
import cookieUtils from '@/ApiSetUp/CookieUtils';

export default function useAuth() {
	const token = cookieUtils.getCookie(LOGIN_TOKEN);
	const userData = cookieUtils.getCookie('userData');
	const isAuthenticated = token && userData && Object.keys(userData).length > 0;

	return { isAuthenticated };
}
