import React from 'react';
import {
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	FormHelperText,
	useTheme,
} from '@mui/material';

const CommonRadioGroup = ({
	label,
	name,
	value,
	onChange,
	options = [],
	error = '',
	required = false,
	row = false,
}) => {
	const theme = useTheme();
	return (
		<FormControl fullWidth required={required} error={Boolean(error)}>
			{label && (
				<FormLabel
					component="legend"
					sx={{
						mb: 1,
						fontWeight: 500,
						'&.Mui-focused': { color: theme.palette.text.secondary },
					}}
				>
					{label}
				</FormLabel>
			)}
			<RadioGroup row={row} name={name} value={value} onChange={onChange}>
				{options.map((option) => (
					<FormControlLabel
						key={option.value}
						value={option.value}
						control={<Radio />}
						label={option.label}
					/>
				))}
			</RadioGroup>
			{error && <FormHelperText>{error}</FormHelperText>}
		</FormControl>
	);
};

export default CommonRadioGroup;
