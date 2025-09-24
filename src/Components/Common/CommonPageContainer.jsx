// import { Paper, Typography, useTheme } from "@mui/material";

const { Box } = require('@mui/material');

// const CommonPageContainer = ({
//   children,
//   title,
//   maxWidth = "lg",
//   elevation = 1,
//   ...props
// }) => {
//   const theme = useTheme();

//   return (
//     <Paper
//       elevation={elevation}
//       sx={{
//         // Responsive vertical and horizontal padding using breakpoints
//         [theme.breakpoints.up("xs")]: {
//           paddingTop: theme.spacing(4),
//           paddingBottom: theme.spacing(0),
//           paddingLeft: theme.spacing(3),
//           paddingRight: theme.spacing(3),
//         },
//         [theme.breakpoints.up("sm")]: {
//           paddingTop: theme.spacing(4),
//           paddingBottom: theme.spacing(0),
//           paddingLeft: theme.spacing(3),
//           paddingRight: theme.spacing(5),
//         },
//         [theme.breakpoints.up("md")]: {
//           paddingTop: theme.spacing(5),
//           paddingBottom: theme.spacing(0),
//           paddingLeft: theme.spacing(5),
//           paddingRight: theme.spacing(8),
//         },
//         [theme.breakpoints.up("lg")]: {
//           paddingTop: theme.spacing(4),
//           paddingBottom: theme.spacing(4),
//           paddingLeft: theme.spacing(3),
//           paddingRight: theme.spacing(5),
//         },
//         [theme.breakpoints.up("xl")]: {
//           paddingTop: theme.spacing(4),
//           paddingBottom: theme.spacing(4),
//           paddingLeft: theme.spacing(3),
//           paddingRight: theme.spacing(3),
//         },

//         // Margin and styling
//         mt: 2,
//         mb: 2,
//         borderRadius: 2,
//         backgroundColor: theme.palette.bgWhite.main,
//         boxShadow: "none",
//       }}
//       {...props}
//     >
//       {title && (
//         <Typography
//           fontWeight={800}
//           fontSize="18px"
//           gutterBottom
//           sx={{ mb: 2 }}
//         >
//           {title}
//         </Typography>
//       )}
//       {children}
//     </Paper>
//   );
// };

// export default CommonPageContainer;

const CommonPageContainer = ({ children }) => {
	return <Box>{children}</Box>;
};

export default CommonPageContainer;
