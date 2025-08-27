import { handleApiError, handleRequest, handleResponse } from './ClientHelper';
import Axios from 'axios';

export function axiosClient(baseURL) {
	const clientInstance = Axios.create({
		baseURL,
	});
	clientInstance.interceptors.request.use(handleRequest);
	clientInstance.interceptors.response.use(handleResponse, handleApiError);
	return clientInstance;
}
