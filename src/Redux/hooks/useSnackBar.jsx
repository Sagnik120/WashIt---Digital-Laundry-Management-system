import { useDispatch } from 'react-redux';
import { AppActions } from '../CommonApp/appSlice';

export default function useSnackBar() {
	const dispatch = useDispatch();
	const setSnackBar = (type, message) => {
		return dispatch(
			AppActions.actions.setSnackBar({
				open: true,
				type: type,
				message: message,
			})
		);
	};
	const closeSnackBar = () => {
		return dispatch(
			AppActions.actions.setSnackBar({
				open: false,
				type: '',
				message: '',
			})
		);
	};
	return { setSnackBar, closeSnackBar };
}
