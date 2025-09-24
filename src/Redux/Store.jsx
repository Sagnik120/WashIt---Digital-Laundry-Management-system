import { configureStore } from '@reduxjs/toolkit';
import AppSlice from './CommonApp/appSlice';
import AuthSlice from './Auth/AuthSlice';

export const store = configureStore({
	reducer: {
		auth: AuthSlice,
		app: AppSlice,
	},
});

// export type AppDispatch =  store.dispatch;
// export type RootState = ReturnType<typeof store.getState>;
export default store;
