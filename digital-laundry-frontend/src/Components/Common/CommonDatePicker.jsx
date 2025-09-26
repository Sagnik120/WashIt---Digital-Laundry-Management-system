import { Box, InputLabel, Typography, useTheme } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const CommonDatePicker = ({
	text,
	value,
	onChange,
	valid,
	error,
	helperText,
	width,
	fontWeight,
	labelSize,
	labelColor,
	whiteSpace,
	minDate,
	size = 'small',
}) => {
	const theme = useTheme();

	const commonSxStyles = {
		width: '100%',
		'& .MuiOutlinedInput-root': {
			borderRadius: '6px',
			'&:hover .MuiOutlinedInput-notchedOutline': {
				borderColor: error ? theme.palette.error.main : theme?.palette?.primary?.main,
			},
			'& .MuiOutlinedInput-notchedOutline': {
				border: `1px solid ${error ? theme.palette.error.main : theme?.palette?.bgSkyBlue?.main}`,
			},
		},
		'& .MuiFormHelperText-root': {
			color: error ? theme.palette.error.main : theme.palette.text.secondary,
			marginLeft: 0,
			marginTop: '4px',
		},
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
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DatePicker
					value={value ? dayjs(value) : null}
					onChange={(newValue) => {
						onChange(newValue);
					}}
					minDate={minDate}
					slotProps={{
						textField: {
							error: !!error,
							helperText: helperText,
							size: size,
							sx: commonSxStyles,
						},
					}}
				/>
			</LocalizationProvider>
		</Box>
	);
};

export default CommonDatePicker;
