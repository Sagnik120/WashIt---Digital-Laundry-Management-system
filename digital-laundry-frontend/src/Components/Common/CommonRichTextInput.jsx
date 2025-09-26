'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Box, InputLabel, Typography, useTheme } from '@mui/material';
import 'react-quill-new/dist/quill.snow.css';

// SSR-safe dynamic import for Next.js
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function CommonRichTextInput({
	text,
	valid,
	value,
	onChange,
	placeholder,
	labelSize,
	labelColor,
	fontWeight,
	whiteSpace,
	borderRadius = '6px',
	error,
	helperText,
	height = 150,
	sx = {},
}) {
	const theme = useTheme();

	const modules = {
		toolbar: [
			[{ header: [1, 2, 3, false] }],
			['bold', 'italic', 'underline', 'strike'],
			[{ list: 'ordered' }, { list: 'bullet' }],
			[{ align: [] }],
			['blockquote', 'code-block', 'link'],
			['clean'],
		],
	};

	const formats = [
		'header',
		'bold',
		'italic',
		'underline',
		'strike',
		'list',
		'bullet',
		'align',
		'blockquote',
		'code-block',
		'link',
	];

	return (
		<Box width="100%">
			{/* Label */}
			{text && (
				<Box mb={0.5} display="flex" flexDirection="row" alignItems="center">
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

			{/* Quill Editor */}
			<Box
				sx={{
					border: `1px solid ${
						error
							? theme.palette.error.main
							: theme?.palette?.bgSkyBlue?.main || theme.palette.divider
					}`,
					borderRadius: borderRadius,
					overflow: 'hidden',
					'& .ql-toolbar': {
						border: 'none',
						borderBottom: `1px solid ${
							error
								? theme.palette.error.main
								: theme?.palette?.bgSkyBlue?.main || theme.palette.divider
						}`,
						backgroundColor: theme.palette.background.paper,
					},
					'& .ql-container': {
						border: 'none',
						fontSize: '14px',
						minHeight: height,
						'& .ql-editor': {
							padding: '10px 12px',
						},
					},
					...sx,
				}}
			>
				<ReactQuill
					theme="snow"
					value={value}
					onChange={onChange}
					modules={modules}
					formats={formats}
					placeholder={placeholder}
				/>
			</Box>

			{/* Helper text */}
			{helperText && (
				<Typography
					sx={{
						fontSize: '12px',
						mt: '4px',
						color: error ? theme.palette.error.main : theme.palette.text.secondary,
					}}
				>
					{helperText}
				</Typography>
			)}
		</Box>
	);
}
