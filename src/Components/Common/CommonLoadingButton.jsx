import { Block } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import React from 'react';

function CommonLoadingButton({
	className,
	variant,
	onClickHandler,
	loading,
	width = '75px',
	height = '35px',
	text = 'Save',
	size,
	...rest
}) {
	return (
		<Button
			className={className}
			variant={variant}
			onClick={onClickHandler}
			disabled={loading}
			style={{
				width: width,
				height: height,
			}}
			size={size || 'medium'}
			{...rest}
			endIcon={
				loading && (
					<CircularProgress
						size={24}
						color="inherit"
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							marginTop: -12,
							marginLeft: -12,
							color: '#F1F4F8',
							strokeWidth: 2,
							display: 'inline-block',
						}}
					/>
				)
			}
		>
			{text}
		</Button>
	);
}

export default CommonLoadingButton;
