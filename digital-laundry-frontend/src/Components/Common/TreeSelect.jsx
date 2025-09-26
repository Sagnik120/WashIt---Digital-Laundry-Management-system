import React, { useState, useRef, useEffect } from 'react';
import {
	Box,
	Typography,
	List,
	ListItem,
	ListItemText,
	Collapse,
	Checkbox,
	IconButton,
	Paper,
	useTheme,
	ClickAwayListener,
} from '@mui/material';
import { ExpandMore, ExpandLess, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const NestedDropdown = ({
	data,
	width,
	text,
	valid,
	fontWeight,
	labelSize,
	labelColor,
	error,
	helperText,
	sx = {},
	placeholder = 'Select categories',
	selectedItems,
	setSelectedItems,
	onChange = () => {},
}) => {
	const theme = useTheme();
	const [openItems, setOpenItems] = useState({});
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);

	const handleToggle = (id) => {
		setOpenItems((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	const handleSelect = (item) => {
		const newSelected = isItemSelected(item._id) ? [] : [item];
		setSelectedItems(newSelected);
		onChange(newSelected.length > 0 ? newSelected[0]._id : '');
	};

	const isItemSelected = (id) => {
		return selectedItems.some((item) => item._id === id);
	};

	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};

	const handleClickAway = () => {
		setDropdownOpen(false);
	};

	const commonSxStyles = {
		borderRadius: '6px',
		'&:hover .MuiOutlinedInput-notchedOutline': {
			borderColor: error ? theme.palette.error.main : theme?.palette?.primary?.main,
		},
		'& .MuiOutlinedInput-notchedOutline': {
			border: `1px solid ${error ? theme.palette.error.main : theme?.palette?.bgSkyBlue?.main}`,
		},
		...sx,
	};

	const renderItems = (items, level = 0) => {
		return items.map((item) => (
			<React.Fragment key={item._id}>
				<ListItem
					sx={{
						pl: level * 4,
						backgroundColor: level === 0 ? '#f5f5f5' : 'inherit',
						borderBottom: level === 0 ? '1px solid #e0e0e0' : 'none',
						py: 0.5,
						'&:hover': {
							backgroundColor: theme.palette.action.hover,
						},
					}}
				>
					{item.children && item.children.length > 0 ? (
						<IconButton
							onClick={(e) => {
								e.stopPropagation();
								handleToggle(item._id);
							}}
							size="small"
							sx={{ color: theme.palette.text.secondary }}
						>
							{openItems[item._id] ? <ExpandLess /> : <ExpandMore />}
						</IconButton>
					) : (
						<Box width={40} display="inline-block" />
					)}

					<Checkbox
						checked={isItemSelected(item._id)}
						onChange={() => handleSelect(item)}
						size="small"
						sx={{
							color: theme.palette.primary.main,
							'&.Mui-checked': {
								color: theme.palette.primary.main,
							},
						}}
					/>

					<ListItemText
						primary={item.name}
						primaryTypographyProps={{
							fontWeight: level === 0 ? 'bold' : 'normal',
							fontSize: level === 0 ? '0.875rem' : '0.8125rem',
							color: theme.palette.text.primary,
						}}
					/>
				</ListItem>

				{item.children && item.children.length > 0 && (
					<Collapse in={openItems[item._id]} timeout="auto" unmountOnExit>
						<List
							component="div"
							disablePadding
							sx={{ bgcolor: theme.palette.background.paper }}
						>
							{renderItems(item.children, level + 1)}
						</List>
					</Collapse>
				)}
			</React.Fragment>
		));
	};

	return (
		<ClickAwayListener onClickAway={handleClickAway}>
			<Box width={width || '100%'} position="relative" ref={dropdownRef}>
				{text && (
					<Box mb={0.5} display="flex" flexDirection="row">
						<Typography
							variant="body2"
							sx={{
								mb: { lg: '4px', xl: '8px' },
								fontWeight: fontWeight || 500,
								fontSize: labelSize || '16px',
								color: error
									? theme.palette.error.main
									: labelColor || theme.palette.text.secondary,
							}}
						>
							{text}
						</Typography>
						{valid && (
							<Typography color={theme.palette.error.main} variant="body2">
								*
							</Typography>
						)}
					</Box>
				)}

				<Paper
					onClick={toggleDropdown}
					elevation={0}
					sx={{
						border: `1px solid ${error ? theme.palette.error.main : theme.palette.bgSkyBlue.main}`,
						borderRadius: '6px',
						overflow: 'hidden',
						cursor: 'pointer',
						py: 1,
						px: 2,
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						'&:hover': {
							borderColor: error
								? theme.palette.error.main
								: theme.palette.primary.main,
						},
					}}
				>
					<Typography
						variant="body2"
						sx={{
							color:
								selectedItems.length > 0
									? theme.palette.text.primary
									: theme.palette.text.secondary,
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						{selectedItems.length > 0
							? selectedItems[0].name // Only show first selected
							: placeholder}
					</Typography>
					<IconButton size="small" sx={{ p: 0 }}>
						{dropdownOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
					</IconButton>
				</Paper>

				{dropdownOpen && (
					<Paper
						elevation={4}
						sx={{
							position: 'absolute',
							top: '100%',
							left: 0,
							right: 0,
							zIndex: 1300,
							border: `1px solid ${theme.palette.divider}`,
							borderRadius: '6px',
							maxHeight: 300,
							overflowY: 'auto',
							mt: 0.5,
						}}
					>
						<List dense disablePadding>
							{renderItems(data)}
						</List>
					</Paper>
				)}

				{helperText && (
					<Typography
						variant="caption"
						sx={{
							color: error ? theme.palette.error.main : theme.palette.text.secondary,
							ml: 1,
							mt: 0.5,
							display: 'block',
						}}
					>
						{helperText}
					</Typography>
				)}
			</Box>
		</ClickAwayListener>
	);
};

export default NestedDropdown;
