'use client';

const localStoreUtil = {
	store_data: (key, data) => {
		if (typeof window === 'undefined') return false;

		if (typeof data === 'object') {
			localStorage.setItem(key, JSON.stringify(data));
		} else {
			localStorage.setItem(key, data);
		}

		return true;
	},

	get_data: (key) => {
		if (typeof window === 'undefined') return null;

		const item = localStorage.getItem(key);
		if (!item) return null;

		try {
			return JSON.parse(item);
		} catch {
			return item;
		}
	},

	remove_data: (key) => {
		if (typeof window === 'undefined') return false;
		localStorage.removeItem(key);
		return true;
	},

	remove_all: () => {
		if (typeof window === 'undefined') return false;
		localStorage.clear();
		return true;
	},
};

export default localStoreUtil;
