import { Box, InputLabel, Typography, useTheme } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React, { useState, useEffect, useCallback } from 'react';

const CommonYearRangePicker = ({
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
	maxDate,
	size = 'small',
	disabled = false,
	fromLabel = 'From',
	toLabel = 'To',
	validateRange = true,
}) => {
	const theme = useTheme();

	// Initialize state from value prop - handle null/undefined/empty values
	const initializeYears = useCallback(() => {
		if (!value || value === null || value === undefined || value === '') {
			return { from: null, to: null };
		}

		// Handle string values
		if (typeof value === 'string') {
			const parts = value.split('-');
			return {
				from: parts[0] && parts[0].trim() !== '' ? parts[0].trim() : null,
				to: parts[1] && parts[1].trim() !== '' ? parts[1].trim() : null,
			};
		}

		return { from: null, to: null };
	}, [value]);

	const [fromYear, setFromYear] = useState(() => initializeYears().from);
	const [toYear, setToYear] = useState(() => initializeYears().to);
	const [rangeError, setRangeError] = useState('');

	// Update local state when value prop changes
	useEffect(() => {
		const { from, to } = initializeYears();
		setFromYear(from);
		setToYear(to);
	}, [value, initializeYears]);

	// Validate range and call onChange
	useEffect(() => {
		let errorMsg = '';

		// Only validate if both years are selected and not null
		if (validateRange && fromYear && toYear && fromYear !== null && toYear !== null) {
			const fromYearNum = parseInt(fromYear);
			const toYearNum = parseInt(toYear);

			if (!isNaN(fromYearNum) && !isNaN(toYearNum) && fromYearNum > toYearNum) {
				errorMsg = 'From year cannot be greater than To year';
			}
		}

		setRangeError(errorMsg);

		// Create the current range value
		const currentRange =
			fromYear && toYear && !errorMsg
				? `${fromYear}-${toYear}`
				: !fromYear && !toYear
					? null
					: undefined;

		// Only call onChange if the value would actually change
		if (currentRange !== undefined) {
			onChange?.(currentRange);
		}
	}, [fromYear, toYear, validateRange]);

	const commonSxStyles = {
		width: '100%',
		'& .MuiOutlinedInput-root': {
			borderRadius: '6px',
			'&:hover .MuiOutlinedInput-notchedOutline': {
				borderColor:
					error || rangeError ? theme.palette.error.main : theme?.palette?.primary?.main,
			},
			'& .MuiOutlinedInput-notchedOutline': {
				border: `1px solid ${
					error || rangeError
						? theme.palette.error.main
						: theme?.palette?.bgSkyBlue?.main || theme.palette.grey[300]
				}`,
			},
		},
		'& .MuiFormHelperText-root': {
			color: error || rangeError ? theme.palette.error.main : theme.palette.text.secondary,
			marginLeft: 0,
			marginTop: '4px',
		},
	};

	const handleFromYearChange = (newVal) => {
		const year = newVal && newVal.isValid() ? newVal.year().toString() : null;
		setFromYear(year);
	};

	const handleToYearChange = (newVal) => {
		const year = newVal && newVal.isValid() ? newVal.year().toString() : null;
		setToYear(year);
	};

	// Calculate dynamic max/min dates - handle null values
	const fromMaxDate =
		toYear && toYear !== null && validateRange ? dayjs(toYear, 'YYYY') : maxDate;
	const toMinDate =
		fromYear && fromYear !== null && validateRange ? dayjs(fromYear, 'YYYY') : minDate;

	const displayError = error || rangeError;
	const displayHelperText = rangeError || helperText;

	return (
		<Box width={width || '100%'}>
			{text && (
				<Box mb={0.5} display="flex" flexDirection="row">
					<InputLabel
						sx={{
							mb: { lg: '4px', xl: '8px' },
							fontWeight: fontWeight || 500,
							fontSize: labelSize || '16px',
							color: displayError
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
				<Box display="flex" gap={2}>
					{/* From Year */}
					<DatePicker
						views={['year']}
						label={fromLabel}
						value={fromYear && fromYear !== null ? dayjs(fromYear, 'YYYY') : null}
						minDate={minDate}
						maxDate={fromMaxDate}
						disabled={disabled}
						onChange={handleFromYearChange}
						slotProps={{
							textField: {
								error: !!displayError,
								helperText: null,
								size: size,
								sx: commonSxStyles,
							},
						}}
					/>

					{/* To Year */}
					<DatePicker
						views={['year']}
						label={toLabel}
						value={toYear && toYear !== null ? dayjs(toYear, 'YYYY') : null}
						minDate={toMinDate}
						maxDate={maxDate}
						disabled={disabled}
						onChange={handleToYearChange}
						slotProps={{
							textField: {
								error: !!displayError,
								helperText: null,
								size: size,
								sx: commonSxStyles,
							},
						}}
					/>
				</Box>

				{/* Show error/helper text below both pickers */}
				{displayHelperText && (
					<Typography
						variant="caption"
						sx={{
							color: displayError
								? theme.palette.error.main
								: theme.palette.text.secondary,
							mt: '4px',
							display: 'block',
						}}
					>
						{displayHelperText}
					</Typography>
				)}
			</LocalizationProvider>
		</Box>
	);
};

export default CommonYearRangePicker;
