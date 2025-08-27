import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import usePageLoader from "@/Redux/hooks/usePageLoader";
import useSnackBar from "@/Redux/hooks/useSnackBar";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import AuthWrapper from "../../../Components/AuthLayout/AuthLayout";

const Login = () => {
  // ================ Hooks ================
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();
  const setFullPageLoader = usePageLoader();
  const { setSnackBar } = useSnackBar();

  const [role, setRole] = useState("student");

  const handleRoleChange = ({ _, newRole }: any) => {
    if (newRole !== null) setRole(newRole);
  };

  return (
    <AuthWrapper>
      <Typography variant="h4" fontWeight="700" gutterBottom>
        🔑 Login
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3, opacity: 0.9 }}>
        Select your role to continue
      </Typography>

      {/* Role Selection */}
      <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              px: 4,
              py: 3,
              fontWeight: 600,
              borderRadius: "20px",
              background:
                role === "student"
                  ? "linear-gradient(135deg, #1e3a8a, #2563eb)" // Indigo → Blue
                  : "rgba(255,255,255,0.1)",
              color: "white",
              cursor: "pointer",
              textAlign: "center",
              boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 6px 20px rgba(0,0,0,0.4)",
              },
            }}
            onClick={() => setRole("student")}
          >
            <Typography variant="h5">👤 Student</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Access student dashboard & manage laundry requests
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              px: 4,
              py: 3,
              fontWeight: 600,
              borderRadius: "20px",
              background:
                role === "staff"
                  ? "linear-gradient(135deg, #9333ea, #ec4899)" // ✅ Purple-Pink Active
                  : "rgba(255,255,255,0.1)",
              color: "white",
              cursor: "pointer",
              textAlign: "center",
              boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 6px 20px rgba(0,0,0,0.4)",
              },
            }}
            onClick={() => setRole("staff")}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <LocalLaundryServiceIcon sx={{ fontSize: 28 }} />
              <Typography variant="h6">🧑 Laundry Staff</Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Access staff dashboard & handle student laundry
            </Typography>
          </Card>
        </Grid>

        {/* Admin */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              px: 4,
              py: 3,
              fontWeight: 600,
              borderRadius: "20px",
              background:
                role === "admin"
                  ? "linear-gradient(135deg, #dc2626, #f97316)" // 🔥 Red → Orange
                  : "rgba(255,255,255,0.1)",
              color: "white",
              cursor: "pointer",
              textAlign: "center",
              boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 6px 20px rgba(0,0,0,0.4)",
              },
            }}
            onClick={() => setRole("admin")}
          >
            <Typography variant="h5">🛠️ Admin</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Manage users, staff & overall laundry system
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Login Form - Only Show After Role Selection */}
      {role && (
        <CardContent
          sx={{
            textAlign: "left",
            "&:last-child": {
              pb: 0,
            },
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            {role === "student"
              ? "Login as Student"
              : role === "staff"
                ? "Login as Laundry Staff"
                : "Login as Admin"}
          </Typography>

          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{
              style: {
                color: "white",
                background: "rgba(255,255,255,0.15)",
                borderRadius: "8px",
              },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{
              style: {
                color: "white",
                background: "rgba(255,255,255,0.15)",
                borderRadius: "8px",
              },
            }}
          />

          <Box display={'flex'} justifyContent={'space-between'} mt={1}>
            {/* Change Password */}
            <Box
              sx={{
                color: "white",
                cursor: "pointer",
                display: "inline-block",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: role === "student" ? "#06274f" : "#5d0934",
                  textDecoration: "underline",
                  transform: "scale(1.02)",
                },
              }}
              onClick={() => router.push("/auth/change-password")}
            >
              <Typography variant="body2">Change Password</Typography>
            </Box>

            {/* Forgot Password */}
            <Box
              sx={{
                color: "white",
                cursor: "pointer",
                display: "inline-block",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: role === "student" ? "#06274f" : "#5d0934",
                  textDecoration: "underline",
                  transform: "scale(1.02)",
                },
              }}
              onClick={() => router.push("/auth/forgot-password")}
            >
              <Typography variant="body2">Forgot your password?</Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: 600,
              borderRadius: "50px",
              background:
                role === "student"
                  ? "linear-gradient(135deg, #1e3a8a, #2563eb)"
                  : role === "staff"
                    ? "linear-gradient(135deg, #9333ea, #ec4899)"
                    : "linear-gradient(135deg, #dc2626, #f97316)", // admin theme
              "&:hover": { opacity: 0.9 },
            }}
          >
            {role === "student"
              ? "Login as Student"
              : role === "staff"
                ? "Login as Staff"
                : "Login as Admin"}
          </Button>


          {/* Signup Link */}
          <Box mt={2} textAlign="center">
            <Typography variant="body2" sx={{ color: "white" }}>
              Don’t have an account?{" "}
              <Typography
                component="span"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: role === "student" ? "#06274f" : "#5d0934",
                    textDecoration: "underline",
                    transform: "scale(1.05)",
                  },
                }}
                onClick={() => router.push("/auth/register")}
              >
                Create one
              </Typography>
            </Typography>
          </Box>
        </CardContent>
      )}
    </AuthWrapper>
  );
};

export default Login;
