import React from 'react';
import { Select, MenuItem, Chip, FormControl, InputLabel, OutlinedInput, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const CommonMultiSelectDropDown = ({ values, selectedValues, onChange, placeholder }) => {
	const theme = useTheme();

	return (
		<FormControl fullWidth>
			<InputLabel
				sx={{
					marginRight: '3px',
					fontWeight: 400,
					fontSize: '14px',
					color: theme.palette.bgBlack.main,
				}}
			>
				{placeholder}
			</InputLabel>
			<Select
				multiple
				value={selectedValues}
				onChange={onChange}
				input={<OutlinedInput label={placeholder} />}
				renderValue={(selected) => (
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
						{selected.map((value) => (
							<Chip key={value} label={value} />
						))}
					</Box>
				)}
				sx={{
					marginTop: '4px',
				}}
			>
				{values.map((value) => (
					<MenuItem key={value} value={value}>
						{value}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default CommonMultiSelectDropDown;
