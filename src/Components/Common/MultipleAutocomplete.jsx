import React, { useState } from 'react';
import { Autocomplete, TextField, styled, InputLabel, Box, useTheme } from '@mui/material';

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
	'& .MuiInputBase-root': {
		'&.MuiOutlinedInput-root': {
			'& fieldset': {
				borderColor: theme.palette.primary.light,
			},
			'&:hover fieldset': {
				borderColor: theme.palette.primary.main,
			},
			'&.Mui-focused fieldset': {
				borderColor: theme.palette.primary.main,
			},
		},
	},
	'& .MuiAutocomplete-tag': {
		backgroundColor: theme.palette.primary.light,
		color: theme.palette.primary.contrastText,
		padding: '3px 8px',
		margin: '2px',
		'& .MuiChip-deleteIcon': {
			color: theme.palette.primary.contrastText,
			'&:hover': {
				color: theme.palette.primary.dark,
			},
		},
	},
	'& .MuiAutocomplete-clearIndicator': {
		color: theme.palette.primary.light,
		'&:hover': {
			color: theme.palette.primary.main,
		},
	},
}));

const MultipleAutocomplete = ({
	options,
	label = '',
	placeholder = '',
	error = false,
	helperText = '',
	required = false,
	disabled = false,
	loading = false,
	getOptionLabel = [],
	sx,
	value,
	onChange,
	size,
	fullWidth = true,
	fontWeight,
	labelSize,
	labelColor,
	whiteSpace,
	valid = false,
}) => {
	const theme = useTheme();
	return (
		<Box sx={{ width: fullWidth ? '100%' : 'auto', ...sx }}>
			{label && (
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
						{label}
					</InputLabel>
					{valid && (
						<Typography color={theme.palette.error.main} variant="body2">
							*
						</Typography>
					)}
				</Box>
			)}
			<StyledAutocomplete
				multiple
				options={options}
				getOptionLabel={getOptionLabel}
				value={value || []}
				onChange={(_, newValue) => {
					onChange?.(newValue);
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						placeholder={placeholder}
						error={error}
						helperText={helperText}
						required={required}
						size={size || 'small'}
					/>
				)}
				disabled={disabled}
				loading={loading}
				filterSelectedOptions
				clearOnBlur
				clearOnEscape
				handleHomeEndKeys
				selectOnFocus
				blurOnSelect={false}
				ChipProps={{
					size: 'small',
					color: 'primary',
				}}
				limitTags={3}
			/>
		</Box>
	);
};

export default MultipleAutocomplete;
