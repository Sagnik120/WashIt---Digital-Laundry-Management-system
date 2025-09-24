import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiInstance } from '@/ApiSetUp/ApiInstance';
import { ApiPostNoAuth } from '../../ApiSetUp/CommonApi';
import { api, BaseUrl } from '../../ApiSetUp/AuthApi';

export function setAuthTokenAndSubscription(data) {
	apiInstance.defaults.data = data;
}

//--------------------- Auth Apis ------------------------------
// export const signup = createAsyncThunk(
//   "signup",
//   async (body) => {
//     return ApiPostNoAuth(BaseUrl, api.signup, body)
//       .then((res) => {
//         return res?.data;
//       })
//       .catch((err) => err);
//   }
// );

export const login = createAsyncThunk('login', async (body) => {
	return await ApiPostNoAuth(BaseUrl, api.login, body)
		.then(async (res) => {
			return res?.data;
		})
		.catch((err) => err);
});
