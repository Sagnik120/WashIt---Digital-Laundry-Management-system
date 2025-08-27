'use client';
import { useDispatch } from 'react-redux';
import { AppActions } from '../CommonApp/appSlice';

export default function usePageLoader() {
	const dispatch = useDispatch();
	const setFullPageLoader = (open) => {
		return dispatch(AppActions.actions.setFullPageLoader(open));
	};
	return setFullPageLoader;
}
