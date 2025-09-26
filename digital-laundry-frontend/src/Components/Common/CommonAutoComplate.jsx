import { Autocomplete, Box, InputLabel, TextField, Typography, useTheme } from '@mui/material';
import React from 'react';

const CommonAutocomplete = ({
	text,
	placeholder,
	width,
	valid,
	name,
	value,
	options,
	defaultValue,
	fontWeight,
	labelSize,
	labelColor,
	onBlur,
	disabled,
	whiteSpace,
	sx = {},
	onChange,
	className,
	label,
	error,
	helperText,
	size,
	multiple,
	freeSolo,
	getOptionLabel,
	isOptionEqualToValue,
	renderOption,
	loading,
	filterOptions,
	onInputChange,
	renderInput,
	borderRadius,
}) => {
	const theme = useTheme();

	const commonSxStyles = {
		borderRadius: borderRadius || '6px',
		paddingLeft: 0,
		'&:hover .MuiOutlinedInput-notchedOutline': {
			borderColor: error ? theme.palette.error.main : theme?.palette?.primary?.main,
		},
		'& .MuiOutlinedInput-notchedOutline': {
			border: `1px solid ${error ? theme.palette.error.main : theme?.palette?.bgSkyBlue?.main}`,
		},
		'& input::placeholder': {
			color: theme.palette.text.secondary,
			opacity: 0.6,
			fontWeight: 500,
			fontSize: '14px',
		},
		...(error && {
			'& .MuiOutlinedInput-root': {
				'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
					borderColor: theme.palette.error.main,
				},
			},
		}),
		...sx,
	};

	const defaultRenderInput = (params) => (
		<TextField
			{...params}
			label={label}
			placeholder={placeholder}
			error={error}
			helperText={helperText}
			size={size || 'small'}
			sx={commonSxStyles}
		/>
	);

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
			<Autocomplete
				multiple={multiple}
				freeSolo={freeSolo}
				options={options || []}
				value={value}
				onChange={onChange}
				className={className}
				defaultValue={defaultValue}
				getOptionLabel={getOptionLabel}
				isOptionEqualToValue={isOptionEqualToValue}
				renderOption={renderOption}
				loading={loading}
				filterOptions={filterOptions}
				onInputChange={onInputChange}
				onBlur={onBlur}
				disabled={disabled}
				renderInput={renderInput || defaultRenderInput}
				sx={{
					width: '100%',
					'& .MuiOutlinedInput-root': {
						padding: '3px 9px',
					},
					'& .MuiFormHelperText-root': {
						color: error ? theme.palette.error.main : theme.palette.text.secondary,
						marginLeft: 0,
						marginTop: '4px',
					},
				}}
			/>
		</Box>
	);
};

export default CommonAutocomplete;
