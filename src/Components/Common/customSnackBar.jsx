import * as React from "react";
import { Slide, useTheme } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useAppDispatch, useAppSelector } from "../../Redux/app/hooks";
import { AppActions } from "../../Redux/CommonApp/appSlice";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={5} ref={ref} {...props} />;
});

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

export default function CustomSnackBar() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const snackBar = useAppSelector((state) => state?.app?.common?.snackBar);

  const handleClose = (event) => {
    dispatch(
      AppActions.actions.setSnackBar({
        open: false,
        type: snackBar.type,
        message: snackBar.message,
      })
    );
  };

  const color = theme.palette[snackBar.type || "success"]?.light;

  return (
    <Snackbar
      open={snackBar.open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      TransitionComponent={SlideTransition}
      disableWindowBlurListener
      sx={{
        maxWidth: "500px",
        "&>.MuiPaper-root::after": {
          content: `""`,
          position: "absolute",
          height: "2px",
          width: "calc(100% - 8px)",
          backgroundColor: color,
          bottom: 0,
          left: "4px",
          animation: "width-animation 6s forwards",
        },
      }}
      style={{
        left: "auto",
        right: "24px",
      }}
    >
      <Alert
        onClose={handleClose}
        severity={snackBar.type}
        sx={{
          borderLeft: `4px solid ${color}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        {snackBar.message}
      </Alert>
    </Snackbar>
  );
}
