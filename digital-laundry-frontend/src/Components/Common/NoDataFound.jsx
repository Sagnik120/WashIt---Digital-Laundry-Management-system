import { Typography, useTheme } from '@mui/material';
import React from 'react';
import PaperContainer from './PaperContainer';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function NoDataFound({ title }) {
	const theme = useTheme();
	return (
		<PaperContainer
			sx={{
				justifyContent: 'center',
				alignSelf: 'center',
				margin: '8px 0px',
				alignItems: 'center',
				textAlign: 'center',
				p: 4,
			}}
		>
			<ErrorOutlineIcon sx={{ fontSize: '30px', color: theme.palette.primary.main }} />
			<Typography textAlign={'center'} fontFamily={'Satoshi-Bold'} fontSize={'14px'}>
				{title ? title : 'No Data Found!'}
			</Typography>
		</PaperContainer>
	);
}
