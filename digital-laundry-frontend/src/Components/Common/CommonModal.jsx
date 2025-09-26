import { Modal, Box, Typography, IconButton, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CommonModal = ({
	open,
	onClose,
	title,
	children,
	maxWidth = 'xs', // xs, sm, md, lg, xl
	fullWidth = true,
	actions,
}) => {
	const theme = useTheme();

	return (
		<Modal
			open={open}
			onClose={onClose}
			aria-labelledby="modal-title"
			aria-describedby="modal-description"
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Box
				sx={{
					backgroundColor: 'background.paper',
					borderRadius: 2,
					boxShadow: 24,
					p: 4,
					maxWidth: {
						xs: '95%',
						sm: '500px',
						md: '600px',
						lg: '700px',
						xl: '800px',
					}[maxWidth],
					width: fullWidth ? '100%' : undefined,
					maxHeight: '90vh',
					overflowY: 'auto',
					border: `2px solid ${theme.palette.primary.main}`,
					'&::-webkit-scrollbar': {
						display: 'none', // Safari and Chrome
					},
					scrollbarWidth: 'none', // Firefox
					msOverflowStyle: 'none', // IE and Edge
				}}
			>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						mb: 2,
						borderBottom: `1px solid ${theme.palette.divider}`,
						pb: 1,
					}}
				>
					<Typography
						id="modal-title"
						variant="h6"
						sx={{ fontWeight: 600, color: theme.palette.primary.main }}
					>
						{title}
					</Typography>
					<IconButton onClick={onClose} size="small">
						<CloseIcon fontSize="small" />
					</IconButton>
				</Box>

				{children}

				{actions && (
					<Box
						sx={{
							mt: 3,
							display: 'flex',
							justifyContent: 'flex-end',
							gap: 2,
							borderTop: `1px solid ${theme.palette.divider}`,
							pt: 2,
						}}
					>
						{actions}
					</Box>
				)}
			</Box>
		</Modal>
	);
};

export default CommonModal;
