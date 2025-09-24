import { createSlice, combineReducers } from '@reduxjs/toolkit';

const initialState = {
	snackBar: {
		open: false,
		type: 'success',
		message: '',
	},
	fullPageLoaderOpen: false,
};

export const AppActions = createSlice({
	name: 'app',
	initialState,
	reducers: {
		setSnackBar: {
			reducer: (state, action) => {
				state.snackBar = action.payload;
			},
			prepare: (payload) => {
				return {
					payload: payload,
				};
			},
		},
		setFullPageLoader: {
			reducer: (state, action) => {
				state.fullPageLoaderOpen = action.payload;
			},
			prepare: (open) => {
				return {
					payload: open,
				};
			},
		},
	},
});

export default combineReducers({
	common: AppActions.reducer,
});
