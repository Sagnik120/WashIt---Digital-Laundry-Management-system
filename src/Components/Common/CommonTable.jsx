import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	useTheme,
	CircularProgress,
	IconButton,
	Tooltip,
	Paper,
} from '@mui/material';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const CommonTable = ({
	data = [],
	columns = [],
	title = 'Data Table',
	loading = false,
	onEdit,
	onDelete = () => {},
	onView = () => {},
}) => {
	const theme = useTheme();

	const renderCellContent = (column, row) => {
		const value = row[column.field];

		switch (column.type) {
			case 'date':
				return value ? dayjs(value).format('DD MMM YYYY') : '-';
			case 'actions':
				return (
					<Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
						{column.showEdit !== false && (
							<Tooltip title="Edit">
								<IconButton
									size="small"
									color="primary"
									onClick={() => onEdit && onEdit(row)}
								>
									<EditIcon
										fontSize="small"
										sx={{ color: theme.palette.primary.main }}
									/>
								</IconButton>
							</Tooltip>
						)}

						{column.showDelete !== false && (
							<Tooltip title="Delete">
								<IconButton
									size="small"
									color="error"
									onClick={() => onDelete && onDelete(row)}
								>
									<DeleteIcon
										fontSize="small"
										sx={{ color: theme.palette.error.main }}
									/>
								</IconButton>
							</Tooltip>
						)}
						{column.showView !== false && (
							<Tooltip title="View Details">
								<IconButton
									size="small"
									color="error"
									onClick={() => onView && onView(row)}
								>
									<VisibilityIcon
										fontSize="small"
										sx={{ color: theme.palette.primary.main }}
									/>
								</IconButton>
							</Tooltip>
						)}
					</Box>
				);
			case 'custom':
				return column.renderCell ? column.renderCell(row) : value;
			case 'link':
				return value ? (
					<a
						href={value}
						target="_blank"
						rel="noopener noreferrer"
						style={{ color: '#3366CC', textDecoration: 'none' }}
					>
						{value}
					</a>
				) : (
					'-'
				);
			default:
				return value || '-';
		}
	};

	return (
		<Paper elevation={0} sx={{ borderRadius: 1, overflow: 'hidden' }}>
			<TableContainer sx={{ maxHeight: 600, position: 'relative' }}>
				{loading && (
					<Box
						sx={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							backgroundColor: 'rgba(255, 255, 255, 0.7)',
							zIndex: 1,
						}}
					>
						<CircularProgress color="primary" />
					</Box>
				)}

				<Table stickyHeader aria-label={`${title} table`}>
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell
									key={column.field}
									align={column.align || 'left'}
									sx={{
										backgroundColor: theme.palette.primary.main,
										color: 'white',
										fontWeight: 600,
										whiteSpace: 'nowrap',
										padding: '12px 16px',
										fontSize: '14px',
									}}
									width={column.width}
								>
									{column.headerName}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.map((row, index) => (
							<TableRow
								hover
								key={row.id || index}
								sx={{
									'&:nth-of-type(odd)': {
										backgroundColor: 'rgba(0, 0, 0, 0.02)',
									},
									'&:hover': {
										backgroundColor: 'rgba(0, 0, 0, 0.04)',
									},
									'&:last-child td, &:last-child th': { border: 0 },
								}}
							>
								{columns.map((column) => (
									<TableCell
										key={`${row.id || index}-${column.field}`}
										align={column.align || 'left'}
										sx={{
											padding: '10px 16px',
											fontSize: '14px',
											borderBottom: '1px solid rgba(224, 224, 224, 1)',
										}}
									>
										{renderCellContent(column, row)}
									</TableCell>
								))}
							</TableRow>
						))}
						{!loading && data.length === 0 && (
							<TableRow>
								<TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
									<Typography variant="body1" color="text.secondary">
										No data available
									</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};

export default CommonTable;
