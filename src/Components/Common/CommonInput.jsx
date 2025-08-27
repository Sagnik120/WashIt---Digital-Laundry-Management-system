import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
	Box,
	IconButton,
	InputAdornment,
	InputLabel,
	TextField,
	Typography,
	useTheme,
} from '@mui/material';
import React, { useState } from 'react';

const CommonInput = ({
	text,
	type,
	placeholder,
	width,
	valid,
	multiline,
	rows,
	name,
	value,
	onInput,
	defaultValue,
	fontWeight,
	padding,
	borderRadius,
	labelSize,
	labelColor,
	showPasswordToggle,
	onKeyDown,
	onPaste,
	onBlur,
	disabled,
	whiteSpace,
	onDrag,
	sx = {},
	onChange,
	className,
	label,
	error,
	helperText,
	startAdornment,
	size,
}) => {
	const theme = useTheme();

	const [showPassword, setShowPassword] = useState(false);

	const handleClickShowPassword = () => setShowPassword((prev) => !prev);
	const handleMouseDownPassword = (event) => event.preventDefault();

	const inputType =
		type === 'password' && showPasswordToggle && !multiline
			? showPassword
				? 'text'
				: 'password'
			: type;

	const commonSxStyles = {
		borderRadius: borderRadius || '6px',
		paddingLeft: 0,
		'&:hover .MuiOutlinedInput-notchedOutline': {
			borderColor: error ? theme.palette.error.main : theme?.palette?.primary?.main,
		},
		'& .MuiOutlinedInput-notchedOutline': {
			border: `1px solid ${error ? theme.palette.error.main : theme?.palette?.bgSkyBlue?.main}`,
		},
		'& input::placeholder, & textarea::placeholder': {
			color: theme.palette.text.secondary,
			opacity: 0.6,
			fontWeight: 500,
			fontSize: '14px',
		},
		...(multiline && {
			'& textarea': {
				padding: padding || { xs: '12px 10px', sm: '14px 16px' },
			},
		}),
		// Add error styles
		...(error && {
			'& .MuiOutlinedInput-root': {
				'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
					borderColor: theme.palette.error.main,
				},
			},
		}),
		...sx,
	};

	const inputProps = {
		...(startAdornment ? { startAdornment } : {}),
		...(!multiline && showPasswordToggle && type === 'password'
			? {
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={handleClickShowPassword}
								onMouseDown={handleMouseDownPassword}
								edge="end"
							>
								{showPassword ? (
									<VisibilityOutlinedIcon />
								) : (
									<VisibilityOffOutlinedIcon />
								)}
							</IconButton>
						</InputAdornment>
					),
				}
			: {}),
		sx: commonSxStyles,
	};
	return (
		<Box width={width || '100%'}>
			{text && (
				<Box mb={0.5} display="flex" flexDirection="row">
					<InputLabel
						sx={{
							mb: { lg: '4px', xl: '8px' },
							fontWeight: fontWeight || 500,
							fontSize: labelSize || '16px',
							color: error
								? theme.palette.error.main
								: labelColor || theme.palette.text.secondary,
							whiteSpace: whiteSpace ? 'wrap' : 'nowrap',
						}}
					>
						{text}
					</InputLabel>
					{valid && (
						<Typography color={theme.palette.error.main} variant="body2">
							*
						</Typography>
					)}
				</Box>
			)}
			<TextField
				label={label}
				fullWidth
				className={className}
				autoComplete="off"
				variant="outlined"
				type={inputType}
				name={name}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				sx={{
					width: '100%',
					'& .MuiOutlinedInput-root': {
						padding: multiline ? 0 : undefined,
					},
					// Add error message styles
					'& .MuiFormHelperText-root': {
						color: error ? theme.palette.error.main : theme.palette.text.secondary,
						marginLeft: 0,
						marginTop: '4px',
					},
				}}
				multiline={multiline}
				rows={rows}
				onInput={onInput}
				onPaste={onPaste}
				onKeyDown={onKeyDown}
				defaultValue={defaultValue}
				onDrag={onDrag}
				InputProps={inputProps}
				onBlur={onBlur}
				disabled={!!disabled}
				error={error}
				helperText={helperText}
				size={size || 'small'}
			/>
		</Box>
	);
};

export default CommonInput;
