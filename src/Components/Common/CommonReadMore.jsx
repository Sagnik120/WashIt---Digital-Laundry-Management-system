import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';

const CommonReadMore = ({ text = '', maxLength = 100 }) => {
	const [showFull, setShowFull] = useState(false);

	if (!text) return '-';

	const stringText = String(text).trim();

	const isLong = stringText.length > maxLength;
	const displayText =
		!showFull && isLong ? `${stringText.substring(0, maxLength)}...` : stringText;

	const handleToggle = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setShowFull((prev) => !prev);
	};

	return (
		<Box sx={{ maxWidth: '100%' }}>
			<Typography
				variant="body2"
				sx={{
					wordBreak: 'break-word',
					whiteSpace: 'pre-wrap',
				}}
			>
				{displayText}
			</Typography>

			{isLong && (
				<Typography
					variant="body2"
					onClick={handleToggle}
					sx={{
						color: 'primary.main',
						cursor: 'pointer',
						fontWeight: 500,
						mt: 0.5,
						display: 'inline-block',
						'&:hover': {
							textDecoration: 'underline',
						},
					}}
				>
					{showFull ? 'Read less' : 'Read more'}
				</Typography>
			)}
		</Box>
	);
};

export default CommonReadMore;
