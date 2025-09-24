import React from 'react';
import { Button, CircularProgress, useTheme } from '@mui/material';

const ButtonContained = ({
	text,
	height,
	width,
	marginRight,
	marginLeft,
	borderRadius,
	backgroundColor,
	endIcon,
	startIcon,
	onClick,
	marginTop,
	marginBottom,
	color,
	disabled,
	type,
	loading,
	disableLoader,
	fontWeight,
	href,
	fontSize,
	padding,
	text2,
	sx,
}) => {
	const theme = useTheme();

	const getHoverColor = (color) => {
		let colorValue = color.replace('#', '');
		if (colorValue.length === 3) {
			colorValue = colorValue
				.split('')
				.map((c) => c + c)
				.join('');
		}
		const r = parseInt(colorValue.substring(0, 2), 16);
		const g = parseInt(colorValue.substring(2, 4), 16);
		const b = parseInt(colorValue.substring(4, 6), 16);
		const darken = (value) => Math.max(0, value - 30);
		return `rgb(${darken(r)}, ${darken(g)}, ${darken(b)})`;
	};

	const hoverColor = backgroundColor
		? getHoverColor(backgroundColor)
		: theme.palette.primary.main;

	return (
		<Button
			type={type}
			variant="contained"
			aria-label={text}
			sx={{
				bgcolor: backgroundColor,
				borderRadius: borderRadius || '6px',
				marginTop: marginTop,
				marginBottom: marginBottom,
				height: height,
				width: width,
				marginRight: marginRight,
				marginLeft: marginLeft,
				fontSize: fontSize || '16px',
				fontWeight: fontWeight || 400,
				padding: padding,
				color: `${color ? color : theme?.palette?.bgWhite?.main}`,
				'&:hover': {
					bgcolor: hoverColor,
				},
				...sx,
			}}
			disableElevation
			startIcon={startIcon}
			endIcon={endIcon}
			onClick={onClick}
			disabled={disabled}
			href={href}
		>
			{text}
			{text2}
			{loading && !disableLoader ? (
				<CircularProgress size={20} color={'inherit'} sx={{ marginLeft: 3 }} />
			) : (
				''
			)}
		</Button>
	);
};

export default ButtonContained;
