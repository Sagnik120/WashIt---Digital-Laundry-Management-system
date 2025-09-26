import { Button, CircularProgress } from '@mui/material';

const ButtonOutlined = ({
	text,
	height,
	width,
	marginRight,
	borderRadius,
	marginLeft,
	marginTop,
	onClick,
	loading,
	color,
	disableLoader,
	disableElevation,
	href,
	fontSize,
	disabled,
	fontWeight,
	padding,
	sx,
	icon,
	showIcon = false,
	iconPosition = 'left',
	iconWidth,
	iconHeight,
	muiIconLeft,
	muiIconRight,
}) => {
	return (
		<Button
			variant={'outlined'}
			aria-label={text}
			color={color ? color : 'primary'}
			sx={{
				borderRadius: borderRadius,
				marginTop: marginTop,
				height: height,
				width: width,
				marginRight: marginRight,
				marginLeft: marginLeft,
				fontSize: fontSize || '16px',
				fontWeight: fontWeight || 400,
				padding: padding,
				...sx,
			}}
			disableElevation={disableElevation}
			startIcon={
				showIcon && iconPosition === 'left' && icon ? (
					<img
						src={icon}
						alt="icon"
						style={{ width: iconWidth || 20, height: iconHeight || 20 }}
					/>
				) : (
					muiIconLeft
				)
			}
			endIcon={
				showIcon && iconPosition === 'right' && icon ? (
					<img
						src={icon}
						alt="icon"
						style={{ width: iconWidth || 20, height: iconHeight || 20 }}
					/>
				) : (
					muiIconRight
				)
			}
			onClick={onClick}
			href={href}
			disabled={disabled}
		>
			{text}
			{loading && !disableLoader ? (
				<CircularProgress size={20} color={'inherit'} sx={{ marginLeft: 3 }} />
			) : (
				''
			)}
		</Button>
	);
};

export default ButtonOutlined;
