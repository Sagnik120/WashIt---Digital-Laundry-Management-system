import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function CommonCard({ title, onClick, onDelete, theme, customStyles = {} }) {
	return (
		<Card
			sx={{
				cursor: 'pointer',
				transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
				'&:hover': {
					transform: 'translateY(-4px)',
					boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
				},
				background: `linear-gradient(135deg, ${theme.palette.primary.light.main} 0%, ${theme.palette.primary.main} 100%)`,
				borderRadius: '12px',
				...customStyles,
			}}
			onClick={onClick}
		>
			<CardContent
				sx={{
					padding: {
						xs: '10px',
						sm: '12px',
						md: '14px',
						lg: '16px',
					},
					'&:last-child': {
						paddingBottom: {
							xs: '10px',
							sm: '12px',
							md: '14px',
							lg: '16px',
						},
					},
				}}
			>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						gap: {
							xs: 1,
							sm: 1.5,
							md: 2,
						},
					}}
				>
					<Typography
						sx={{
							color: 'white',
							fontWeight: 600,
							wordBreak: 'break-word',
							fontSize: {
								xs: '13px',
								sm: '14px',
								md: '15px',
								lg: '16px',
							},
							lineHeight: {
								xs: 1.3,
								sm: 1.4,
								md: 1.5,
							},
						}}
					>
						{title}
					</Typography>
					<Box
						sx={{
							display: 'flex',
							gap: {
								xs: 0.5,
								sm: 0.75,
								md: 1,
							},
						}}
					>
						<IconButton
							size="small"
							onClick={(e) => {
								e.stopPropagation();
								onDelete();
							}}
							sx={{
								color: 'white',
								padding: {
									xs: '3px',
									sm: '4px',
									md: '5px',
								},
								'&:hover': {
									backgroundColor: 'rgba(255,255,255,0.2)',
								},
							}}
						>
							<DeleteIcon
								sx={{
									fontSize: {
										xs: '16px',
										sm: '18px',
										md: '20px',
									},
								}}
							/>
						</IconButton>
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
}

export default CommonCard;
