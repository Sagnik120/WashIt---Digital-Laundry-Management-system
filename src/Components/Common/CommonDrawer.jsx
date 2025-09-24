import { Drawer, Box, IconButton, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CommonDrawer = ({
	open,
	onClose,
	width = 1000,
	children,
	title = 'Drawer Title',
	onSubmit,
	showClose,
	showSubmit,
	sumbitButtonText = 'Submit',
	showBack = false,
	handleBack,
}) => {
	return (
		<Drawer
			anchor="right"
			open={open}
			onClose={onClose}
			variant="temporary"
			PaperProps={{
				sx: {
					width: { xs: '100vw', sm: width },
					maxWidth: '100vw',
					p: 0,
					bgcolor: 'background.paper',
					boxSizing: 'border-box',
					marginTop: '65px',
					height: 'calc(100% - 65px)',
					display: 'flex',
					flexDirection: 'column',
				},
			}}
			ModalProps={{
				sx: {
					'& .MuiBackdrop-root': {
						marginTop: '65px',
					},
				},
			}}
		>
			{/* Title Bar */}
			<Box
				sx={{
					position: 'relative',
					borderBottom: '1px solid #ddd',
					p: 2,
				}}
			>
				<Typography variant="h6">{title}</Typography>
				<IconButton
					onClick={onClose}
					aria-label="Close drawer"
					sx={{
						position: 'absolute',
						right: 16,
						top: 16,
						color: 'text.primary',
					}}
				>
					<CloseIcon />
				</IconButton>
			</Box>

			{/* Scrollable Content */}
			<Box
				sx={{
					flex: 1,
					overflowY: 'auto',
					p: { xs: 2, sm: 3 },
					'&::-webkit-scrollbar': {
						display: 'none',
					},
					scrollbarWidth: 'none',
					msOverflowStyle: 'none',
				}}
			>
				{children}
			</Box>

			{/* Fixed Footer */}
			<Box
				sx={{
					p: 1,
					borderTop: '1px solid #ddd',
					position: 'sticky',
					bottom: 0,
					bgcolor: 'background.paper',
					textAlign: 'right',
					display: 'flex',
					gap: '20px',
					justifyContent: 'flex-end',
				}}
			>
				{showClose && (
					<Button variant="contained" onClick={onClose}>
						Close
					</Button>
				)}
				{showBack && (
					<Button variant="contained" onClick={handleBack}>
						Back
					</Button>
				)}
				{showSubmit && (
					<Button variant="contained" onClick={onSubmit}>
						{sumbitButtonText}
					</Button>
				)}
			</Box>
		</Drawer>
	);
};

export default CommonDrawer;
