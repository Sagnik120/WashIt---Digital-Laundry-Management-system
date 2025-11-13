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
import ErrorHandler from "../../../lib/errorHandler";
import { LoginFunction, ProfileDetails } from "@/Redux/Actions/AuthUser";
import cookieUtils from "@/ApiSetUp/CookieUtils";


const Login = () => {
  // ================ Hooks ================
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();
  const setFullPageLoader = usePageLoader();
  const { setSnackBar } = useSnackBar();

  const [role, setRole] = useState("student");
  const [data, setData] = useState<any>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<any>({
    email: "",
    password: "",
  });

  const handleChangeInput = (e: any) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    let tempErrors: any = { ...errors };

    if (name === "email") {
      if (!value) {
        tempErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        tempErrors.email = "Email is invalid";
      } else {
        tempErrors.email = "";
      }
    }

    if (name === "password") {
      if (!value) {
        tempErrors.password = "Password is required";
      } else if (value.length < 6) {
        tempErrors.password = "Password must be at least 6 characters";
      } else {
        tempErrors.password = "";
      }
    }
    setErrors(tempErrors);
  };

  const validate = () => {
    let tempErrors = { email: "", password: "" };
    let isValid = true;

    if (!data.email) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      tempErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!data.password) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (data.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    try {
      const isFormValid = await validate();
      if (!isFormValid) return;

      setFullPageLoader(true);

      const body = {
        email: data?.email,
        password: data?.password,
      };

      const loginRes: any = await dispatch(LoginFunction(body));
      const loginError = ErrorHandler(loginRes, setSnackBar);

      if (!loginError) {
        setSnackBar('error', loginRes?.payload?.data?.message || 'Login failed');
        setFullPageLoader(false);
        return;
      }

      const { token, role } = loginRes?.payload || {};
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      cookieUtils.setCookie('token', token, 1);

      const profileRes: any = await dispatch(ProfileDetails());
      const profileError = ErrorHandler(profileRes, setSnackBar);

      if (!profileError) {
        setSnackBar('error', profileRes?.payload?.data?.message || 'Failed to load profile');
        setFullPageLoader(false);
        return;
      }

      console.log(profileRes?.payload, 'Profile response');
      localStorage.setItem('userData', JSON.stringify({email : profileRes?.payload?.email}));
      cookieUtils.setCookie('userData', JSON.stringify(profileRes?.payload), 1);

      setSnackBar('success', 'Login successful');

      const routeForRole = (() => {
        switch (role) {
          case 'ADMIN':
            return '/admin/dashboard';
          case 'STUDENT':
            return '/user/userProfile';
          case 'STAFF':
            return '/staff/staffScanEntry';
          default:
            return '/';
        }
      })();

      await router.push(routeForRole);
      setFullPageLoader(false);

    } catch (error: any) {
      console.error('Login error:', error);
      setSnackBar('error', error?.message || 'Something went wrong during login');
      setFullPageLoader(false);
    }
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
            name='email'
            type="email"
            variant="outlined"
            margin="normal"
            value={data?.email}
            error={Boolean(errors?.email)}
            helperText={errors?.email}
            onChange={(e) => handleChangeInput(e)}
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
            name='password'
            type="password"
            variant="outlined"
            margin="normal"
            value={data?.password}
            onChange={(e) => handleChangeInput(e)}
            error={Boolean(errors?.password)}
            helperText={errors?.password}
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
            onClick={() => handleSubmit()}
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
