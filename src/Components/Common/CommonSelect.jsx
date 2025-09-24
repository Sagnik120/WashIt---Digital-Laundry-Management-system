import React from 'react';
import {
	Box,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	Typography,
	useTheme,
} from '@mui/material';

const CommonSelect = ({
	text,
	name,
	value,
	onChange,
	width,
	valid,
	options = [],
	labelSize,
	labelColor,
	fontWeight,
	fontSize,
	borderRadius,
	disabled,
	sx = {},
	placeholder,
	className,
	onBlur,
	whiteSpace,
	size,
	error,
	helperText,
}) => {
	const theme = useTheme();

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

			<FormControl fullWidth>
				<Select
					displayEmpty
					name={name}
					value={value}
					size={size || 'small'}
					onChange={onChange}
					onBlur={onBlur}
					disabled={disabled}
					className={className}
					error={error}
					sx={{
						height: 40,
						minHeight: 40,
						borderRadius: borderRadius || '6px',
						'& .MuiOutlinedInput-notchedOutline': {
							border: `1px solid ${theme?.palette?.bgSkyBlue?.main}`,
						},
						'&:hover .MuiOutlinedInput-notchedOutline': {
							borderColor: theme?.palette?.primary?.main,
						},
						'& .MuiSelect-select': {
							padding: '8px 12px',
							fontSize: fontSize || '14px',
							color: theme.palette.text.primary,
						},
						'& .MuiSelect-icon': {
							color: theme.palette.text.secondary,
							fontSize: '20px',
						},
						...sx,
					}}
					renderValue={(selected) => {
						const selectedOption = options.find((option) => option.value === selected);
						return selectedOption ? (
							selectedOption.label
						) : (
							<span style={{ color: '#9e9e9e' }}>{placeholder}</span>
						);
					}}
				>
					{options.map((option, index) => (
						<MenuItem key={index} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</Select>
				{helperText && (
					<FormHelperText sx={{ margin: '3px 14px 0', color: theme.palette.error.main }}>
						{helperText}
					</FormHelperText>
				)}
			</FormControl>
		</Box>
	);
};

export default CommonSelect;
