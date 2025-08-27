// pages/auth/register.jsx
import React, { useState } from "react";
import {
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Card,
    CardContent,
    Autocomplete,
    Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import AuthWrapper from "@/Components/AuthLayout/AuthLayout";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";

const Register = () => {
    const router = useRouter();
    const [role, setRole] = useState("student");
    const [hostel, setHostel] = useState<any>('Hostel A');

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const handleSendOtp = async () => {
        // API call to send OTP
        console.log("OTP sent to", email);
        setIsOtpSent(true);
    };

    const handleVerifyOtp = async () => {
        // API call to verify OTP
        if (otp === "123456") {
            setIsVerified(true);
            alert("✅ Email verified!");
        } else {
            alert("❌ Invalid OTP!");
        }
    };

    const DarkPaper = (props: any) => (
        <Paper
            {...props}
            sx={{
                backgroundColor: "rgba(30,41,59,0.95)", // dark bluish background
                color: "white",
                "& .MuiAutocomplete-option": {
                    color: "white",
                    "&[aria-selected='true']": {
                        backgroundColor: "rgba(59,130,246,0.3)", // selected bg
                    },
                    "&:hover": {
                        backgroundColor: "rgba(59,130,246,0.5)", // hover bg
                    },
                },
            }}
        />
    );

    return (
        <AuthWrapper>
            {/* Title */}
            <Typography variant="h4" fontWeight="700" gutterBottom>
                📝 Register
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1, opacity: 0.9 }}>
                Create a new account
            </Typography>

            {/* Role Selection */}
            <Typography variant="subtitle1" sx={{ mb: 2, opacity: 0.9 }}>
                Select your role to continue
            </Typography>

            <Grid container spacing={4} justifyContent="center" sx={{ mb: 4 }}>
                {/* Student Card */}
                <Grid item xs={12} md={5}>
                    <Card
                        sx={{
                            px: 4,
                            py: 3,
                            fontWeight: 600,
                            borderRadius: "20px",
                            background:
                                role === "student"
                                    ? "linear-gradient(135deg, #1e3a8a, #2563eb)" // active
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
                            Register to request and manage your laundry easily
                        </Typography>
                    </Card>
                </Grid>

                {/* Staff Card */}
                <Grid item xs={12} md={5}>
                    <Card
                        sx={{
                            px: 4,
                            py: 3,
                            fontWeight: 600,
                            borderRadius: "20px",
                            background:
                                role === "staff"
                                    ? "linear-gradient(135deg, #9333ea, #ec4899)" // active
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
                            Register to manage student laundry requests
                        </Typography>
                    </Card>
                </Grid>
            </Grid>

            {/* Register Form */}
            <CardContent sx={{
                textAlign: "left",
                "&:last-child": {
                    pb: 0,
                },
            }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {role === "student" ? "Register as Student" : "Register as Laundry Staff"}
                </Typography>

                {role === "student" ? (
                    <Grid container spacing={2}>
                        {/* Full Name */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                type="text"
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{ style: { color: "white" } }}
                                required
                                InputProps={{
                                    style: {
                                        color: "white",
                                        background: "rgba(255,255,255,0.15)",
                                        borderRadius: "8px",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Roll Number */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Roll Number"
                                type="text"
                                variant="outlined"
                                margin="normal"
                                required
                                InputLabelProps={{ style: { color: "white" } }}
                                InputProps={{
                                    style: {
                                        color: "white",
                                        background: "rgba(255,255,255,0.15)",
                                        borderRadius: "8px",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Email */}
                        <Grid item container xs={12} spacing={1}>
                            <Grid item   {...(!isVerified && { sm: 10 })} xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    variant="outlined"
                                    margin="normal"
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isVerified}
                                    required
                                    InputLabelProps={{ style: { color: "white" } }}
                                    InputProps={{
                                        style: {
                                            color: "white",
                                            background: "rgba(255,255,255,0.15)",
                                            borderRadius: "8px",
                                        },
                                    }}
                                />
                            </Grid>
                            {/* Send OTP button */}

                            {!isVerified && (
                                <Grid item sm={2} xs={12} sx={{ alignContent: 'center' }}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            borderRadius: "50px",
                                            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                                        }}
                                        onClick={handleSendOtp}
                                        disabled={!email}
                                    >
                                        Send OTP
                                    </Button>
                                </Grid>
                            )}
                        </Grid>

                        {/* OTP field + Verify button */}
                        {isOtpSent && !isVerified && (
                            <Grid item container xs={12} spacing={1}>
                                <Grid item sm={10} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
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
                                </Grid>
                                <Grid item sm={2} xs={12} sx={{ alignContent: 'center' }}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            mt: 1,
                                            mb: 2,
                                            borderRadius: "50px",
                                            background: "linear-gradient(135deg, #22c55e, #16a34a)",
                                        }}
                                        onClick={handleVerifyOtp}
                                    >
                                        Verify OTP
                                    </Button>
                                </Grid>
                            </Grid>
                        )}

                        {/* Hostel */}
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={[
                                    "Hostel A",
                                    "Hostel B",
                                    "Hostel C",
                                    "Hostel D",
                                    "Hostel E",
                                ]}
                                value={hostel} // state variable
                                PaperComponent={DarkPaper}
                                onChange={(e, newValue) => setHostel(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Hostel"
                                        margin="normal"
                                        required
                                        variant="outlined"
                                        InputLabelProps={{ style: { color: "white" } }}
                                        InputProps={{
                                            ...params.InputProps,
                                            style: {
                                                color: "white",
                                                background: "rgba(255,255,255,0.15)",
                                                borderRadius: "8px",
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Hostel Room Number */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Hostel Room Number"
                                type="text"
                                variant="outlined"
                                margin="normal"
                                required
                                InputLabelProps={{ style: { color: "white" } }}
                                InputProps={{
                                    style: {
                                        color: "white",
                                        background: "rgba(255,255,255,0.15)",
                                        borderRadius: "8px",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Password */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                variant="outlined"
                                margin="normal"
                                required
                                InputLabelProps={{ style: { color: "white" } }}
                                InputProps={{
                                    style: {
                                        color: "white",
                                        background: "rgba(255,255,255,0.15)",
                                        borderRadius: "8px",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Confirm Password */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                type="password"
                                variant="outlined"
                                margin="normal"
                                required
                                InputLabelProps={{ style: { color: "white" } }}
                                InputProps={{
                                    style: {
                                        color: "white",
                                        background: "rgba(255,255,255,0.15)",
                                        borderRadius: "8px",
                                    },
                                }}
                            /></Grid>
                    </Grid>) : (<><Grid container spacing={2}>
                        {/* Full Name */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                type="text"
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{ style: { color: "white" } }}
                                required
                                InputProps={{
                                    style: {
                                        color: "white",
                                        background: "rgba(255,255,255,0.15)",
                                        borderRadius: "8px",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Email */}
                        <Grid item container xs={12} spacing={1}>
                            <Grid item   {...(!isVerified && { sm: 10 })} xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    variant="outlined"
                                    margin="normal"
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isVerified}
                                    required
                                    InputLabelProps={{ style: { color: "white" } }}
                                    InputProps={{
                                        style: {
                                            color: "white",
                                            background: "rgba(255,255,255,0.15)",
                                            borderRadius: "8px",
                                        },
                                    }}
                                />
                            </Grid>
                            {/* Send OTP button */}

                            {!isVerified && (
                                <Grid item sm={2} xs={12} sx={{ alignContent: 'center' }}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            borderRadius: "50px",
                                            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                                        }}
                                        onClick={handleSendOtp}
                                        disabled={!email}
                                    >
                                        Send OTP
                                    </Button>
                                </Grid>
                            )}
                        </Grid>

                        {/* OTP field + Verify button */}
                        {isOtpSent && !isVerified && (
                            <Grid item container xs={12} spacing={1}>
                                <Grid item sm={10} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
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
                                </Grid>
                                <Grid item sm={2} xs={12} sx={{ alignContent: 'center' }}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            mt: 1,
                                            mb: 2,
                                            borderRadius: "50px",
                                            background: "linear-gradient(135deg, #22c55e, #16a34a)",
                                        }}
                                        onClick={handleVerifyOtp}
                                    >
                                        Verify OTP
                                    </Button>
                                </Grid>
                            </Grid>
                        )}


                        {/* Staff Code */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Staff Code"
                                type="text"
                                variant="outlined"
                                margin="normal"
                                required
                                InputLabelProps={{ style: { color: "white" } }}
                                InputProps={{
                                    style: {
                                        color: "white",
                                        background: "rgba(255,255,255,0.15)",
                                        borderRadius: "8px",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Password */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                variant="outlined"
                                margin="normal"
                                required
                                InputLabelProps={{ style: { color: "white" } }}
                                InputProps={{
                                    style: {
                                        color: "white",
                                        background: "rgba(255,255,255,0.15)",
                                        borderRadius: "8px",
                                    },
                                }}
                            />
                        </Grid>

                        {/* Confirm Password */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                type="password"
                                variant="outlined"
                                margin="normal"
                                required
                                InputLabelProps={{ style: { color: "white" } }}
                                InputProps={{
                                    style: {
                                        color: "white",
                                        background: "rgba(255,255,255,0.15)",
                                        borderRadius: "8px",
                                    },
                                }}
                            /></Grid>
                    </Grid></>)}


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
                                : "linear-gradient(135deg, #9333ea, #ec4899)",
                        "&:hover": { opacity: 0.9 },
                    }}
                >
                    {role === "student" ? "Register as Student" : "Register as Staff"}
                </Button>

                {/* Login Link */}
                <Box mt={2} textAlign="center">
                    <Typography variant="body2" sx={{ color: "white" }}>
                        Already have an account?{" "}
                        <Typography
                            component="span"
                            sx={{
                                color: "white",
                                fontWeight: 700,
                                cursor: "pointer",
                                "&:hover": {
                                    textDecoration: "underline",
                                    transform: "scale(1.05)",
                                    color: role === "student" ? "#06274f" : "#5d0934",
                                },
                            }}
                            onClick={() => router.push("/auth/login")}
                        >
                            Login
                        </Typography>
                    </Typography>
                </Box>
            </CardContent>
        </AuthWrapper>
    );
};

export default Register;
