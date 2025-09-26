import React from 'react';
import { Dialog } from '@mui/material';

const CustomDialog = ({ isOpen, maxWidth, handleClose, children, width, title, sx }) => {
	return (
		<>
			<Dialog
				onClick={() => {}}
				maxWidth={maxWidth ? maxWidth : 'auto'}
				sx={{ width: width ? width : 'auto', ...sx }}
				title={title}
				open={isOpen}
				onClose={handleClose}
				arial-labelledby="max-width-dialog-title"
			>
				{children}
			</Dialog>
		</>
	);
};

export default CustomDialog;
