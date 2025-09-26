import React from 'react';
import { Box, InputLabel, Typography, useTheme } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const CustomDatePicker = ({
	text,
	value,
	onChange,
	error,
	helperText,
	valid,
	width,
	disabled,
	fontWeight,
	labelSize,
	labelColor,
	sx = {},
	minDate,
	maxDate,
}) => {
	const theme = useTheme();

	return (
		<Box width={width || '100%'} sx={sx}>
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

			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DatePicker
					value={value ? dayjs(value) : null}
					onChange={(newValue) => {
						onChange({
							target: { value: newValue ? newValue.toDate() : null },
						});
					}}
					disabled={disabled}
					minDate={minDate ? dayjs(minDate) : undefined}
					maxDate={maxDate ? dayjs(maxDate) : undefined}
					slotProps={{
						textField: {
							size: 'small',
							error: !!error,
							helperText: helperText || '',
							fullWidth: true,
							sx: {
								'& .MuiOutlinedInput-root': {
									borderRadius: '6px',
									'& fieldset': {
										borderColor: error
											? theme.palette.error.main
											: theme?.palette?.bgSkyBlue?.main,
									},
									'&:hover fieldset': {
										borderColor: error
											? theme.palette.error.main
											: theme?.palette?.primary?.main,
									},
									'&.Mui-focused fieldset': {
										borderColor: error
											? theme.palette.error.main
											: theme?.palette?.primary?.main,
									},
								},
							},
						},
					}}
				/>
			</LocalizationProvider>
		</Box>
	);
};

export default CustomDatePicker;
