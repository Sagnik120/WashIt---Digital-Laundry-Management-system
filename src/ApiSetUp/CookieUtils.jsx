const cookieUtils = {
	setCookie: (name, value, expiryDays = 7) => {
		try {
			const cookieValue =
				typeof value === 'object' ? JSON.stringify(value, null, 0) : String(value);

			document.cookie = `${name}=${cookieValue};path=/;max-age=${expiryDays * 24 * 60 * 60};secure;samesite=strict`;
			return true;
		} catch (error) {
			console.error('Error setting cookie:', error);
			return false;
		}
	},

	getCookie: (name) => {
		try {
			const value = document.cookie
				.split('; ')
				.find((row) => row.startsWith(`${name}=`))
				?.split('=')[1];

			if (!value) return null;

			try {
				return JSON.parse(value);
			} catch {
				return value;
			}
		} catch (error) {
			console.error('Error getting cookie:', error);
			return null;
		}
	},

	removeCookie: (name) => {
		try {
			document.cookie = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
			return true;
		} catch (error) {
			console.error('Error removing cookie:', error);
			return false;
		}
	},
};

export default cookieUtils;
