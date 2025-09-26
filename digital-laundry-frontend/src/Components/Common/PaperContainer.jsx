import Paper from '@mui/material/Paper';
import React from 'react';

export default function PaperContainer({ children, sx, ...other }) {
	return (
		<Paper elevation={0} sx={{ p: 4, borderRadius: '28px', ...sx }} {...other}>
			{children}
		</Paper>
	);
}
