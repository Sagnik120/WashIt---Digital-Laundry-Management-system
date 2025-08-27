import React from 'react';
import { IconButton } from '@mui/material';

const CommonIconButton = ({
	icon,
	backgroundColor,
	onClick,
	muiIcon,
	disabled,
	height,
	width,
	hover,
	ariaLabel,
}) => {
	return (
		<>
			<IconButton
				onClick={onClick}
				aria-label={ariaLabel}
				disabled={disabled}
				sx={{
					borderRadius: '10px',
					backgroundColor: disabled ? '#d9d9d9' : backgroundColor,
					padding: '5px',
					cursor: disabled ? 'default' : 'pointer',
					':hover': {
						backgroundColor: hover
							? (theme) => theme?.palette?.bgLightBlue2?.main
							: 'transparent',
					},
				}}
			>
				{muiIcon ? (
					muiIcon
				) : (
					<img
						src={icon}
						alt="product-name"
						style={{ borderRadius: '10px', height: height, width: width }}
					/>
				)}
			</IconButton>
		</>
	);
};

export default CommonIconButton;
