import React from 'react';
import clsx from 'clsx';
import { Card, CardContent, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
const CommonNoDataFound = ({ title, icon, elevation, color }) => {
	return (
		<Card
			elevation={elevation !== undefined ? elevation : 1}
			style={{
				flexGrow: 1,
				width: '100%',
			}}
		>
			<CardContent style={{ padding: '20px 10px 30px' }}>
				<div style={{ textAlign: 'center' }}>
					<WarningIcon color="warning" sx={{ fontSize: '2.5rem' }} />
				</div>
				<div style={{ textAlign: 'center', color: color ? color : 'inherit' }}>
					<Typography fontSize={'16px'} fontWeight={500}>
						{title ? title : 'No Record Found !'}
					</Typography>
				</div>
			</CardContent>
		</Card>
	);
};

export default CommonNoDataFound;
