import { createSlice, combineReducers } from '@reduxjs/toolkit';
import { login } from '../Actions/AuthUser';

const initialState = {
	userDetail: {},
};

export let loggedInUserDetailsSlice = createSlice({
	name: 'loggedInUserDetailsSlice',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(login.pending, (state) => {
			state.status = 'loading';
		});
		builder.addCase(login.fulfilled, (state, { payload }) => {
			state.userDetail = payload?.data?.user;
			state.status = 'success';
		});
		builder.addCase(login.rejected, (state, { payload }) => {
			state.userDetail = {};
			state.status = 'failed';
		});
	},
});

export default combineReducers({
	loggedInUserDetails: loggedInUserDetailsSlice.reducer,
});
