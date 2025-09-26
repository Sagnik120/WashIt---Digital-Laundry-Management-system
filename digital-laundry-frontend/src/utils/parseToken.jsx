import { jwtDecode } from 'jwt-decode';

export const parseJwt = (token) => {
	try {
		return jwtDecode(token);
	} catch (e) {
		return null;
	}
};
