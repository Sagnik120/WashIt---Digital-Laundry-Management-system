import React from 'react';
import {
	Box,
	Pagination,
	Select,
	MenuItem,
	Typography,
	useTheme,
	FormControl,
	InputLabel,
	styled,
} from '@mui/material';

const StyledPagination = styled(Pagination)(({ theme }) => ({
	'& .MuiPaginationItem-root': {
		color: theme.palette.text.primary,
		fontWeight: 500,
		fontSize: '14px',
		[theme.breakpoints.down('sm')]: {
			fontSize: '12px',
		},
	},
	'& .MuiPaginationItem-page.Mui-selected': {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		'&:hover': {
			backgroundColor: theme.palette.primary.dark,
		},
	},
	'& .MuiPaginationItem-page:hover': {
		backgroundColor: theme.palette.action.hover,
	},
	'& .MuiPaginationItem-ellipsis': {
		border: 'none',
	},
	'& .MuiPaginationItem-previousNext': {
		border: `1px solid ${theme.palette.divider}`,
		borderRadius: '4px',
	},
}));

const StyledSelect = styled(Select)(({ theme }) => ({
	height: '36px',
	fontSize: '14px',
	minWidth: '80px',
	'& .MuiSelect-select': {
		padding: '8px 14px',
		[theme.breakpoints.down('sm')]: {
			padding: '6px 10px',
		},
	},
	[theme.breakpoints.down('sm')]: {
		height: '32px',
		fontSize: '12px',
	},
}));

const CommonPagination = ({
	count = 0,
	page = 1,
	rowsPerPage = 10,
	onPageChange,
	onRowsPerPageChange,
	rowsPerPageOptions = [1, 10, 25, 50, 100],
	showRowsPerPage = true,
	showCount = true,
}) => {
	const theme = useTheme();

	const handlePageChange = (event, newPage) => {
		if (onPageChange) {
			onPageChange(newPage);
		}
	};

	const handleRowsPerPageChange = (event) => {
		if (onRowsPerPageChange) {
			onRowsPerPageChange(event.target.value);
		}
	};

	const totalPages = Math.ceil(count / rowsPerPage) || 1;

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: { xs: 'column', sm: 'row' },
				alignItems: { xs: 'flex-start', sm: 'center' },
				justifyContent: 'space-between',
				py: 2,
				px: 1,
				borderTop: `1px solid ${theme.palette.divider}`,
				gap: { xs: 2, sm: 0 },
			}}
		>
			{showCount && (
				<Box sx={{ minWidth: '200px' }}>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{
							fontSize: { xs: '12px', sm: '13px', md: '14px' },
						}}
					>
						Showing {Math.min((page - 1) * rowsPerPage + 1, count)} to{' '}
						{Math.min(page * rowsPerPage, count)} of {count} entries
					</Typography>
				</Box>
			)}

			<Box
				sx={{
					display: 'flex',
					flexDirection: { xs: 'column', sm: 'row' },
					alignItems: { xs: 'flex-start', sm: 'center' },
					gap: 2,
					width: '100%',
					justifyContent: { xs: 'flex-start', sm: 'flex-end' },
				}}
			>
				{showRowsPerPage && (
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1,
							flexWrap: 'wrap',
						}}
					>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ fontSize: { xs: '12px', sm: '14px' } }}
						>
							Show
						</Typography>
						<FormControl size="small">
							<StyledSelect
								value={rowsPerPage}
								onChange={handleRowsPerPageChange}
								displayEmpty
								variant="outlined"
							>
								{rowsPerPageOptions.map((option) => (
									<MenuItem key={option} value={option}>
										{option}
									</MenuItem>
								))}
							</StyledSelect>
						</FormControl>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ fontSize: { xs: '12px', sm: '14px' } }}
						>
							entries
						</Typography>
					</Box>
				)}

				<StyledPagination
					count={totalPages}
					page={page}
					onChange={handlePageChange}
					shape="rounded"
					color="primary"
					showFirstButton
					showLastButton
					size="medium"
				/>
			</Box>
		</Box>
	);
};

export default CommonPagination;
