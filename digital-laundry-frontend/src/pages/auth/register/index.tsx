// pages/auth/register.jsx
import React, { useEffect, useState } from "react";
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
    useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import AuthWrapper from "@/Components/AuthLayout/AuthLayout";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import usePageLoader from "@/Redux/hooks/usePageLoader";
import useSnackBar from "@/Redux/hooks/useSnackBar";
import { useDispatch } from "react-redux";

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

const Register = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const router = useRouter();
    const setFullPageLoader = usePageLoader();
    const { setSnackBar } = useSnackBar();

    const [role, setRole] = useState("student");
    const [hostel, setHostel] = useState<any>('Hostel A');

    // const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const handleSendOtp = async () => {
        // API call to send OTP
        console.log("OTP sent to", data?.email);
        setIsOtpSent(true);
    };

    const handleVerifyOtp = async () => {
        // API call to verify OTP
        if (otp === "123456") {
            setIsVerified(true);
            setIsOtpSent(false);
            setOtp('');
            alert("✅ Email verified!");
        } else {
            setIsOtpSent(false);
            setOtp('');
            alert("❌ Invalid OTP!");
        }
    };

    const [data, setData] = useState<any>({
        name: '',
        rollNo: '',
        email: '',
        hostel: '',
        roomNo: '',
        password: '',
        confirmPassword: '',
        staffCode: '',
    })
    const [errors, setErrors] = useState<any>({
        name: '',
        rollNo: '',
        email: '',
        hostel: '',
        roomNo: '',
        password: '',
        confirmPassword: '',
        staffCode: '',
    });

    const handleChangeInput = (e: any, name1?: any, newValue?: any) => {
        const { name, value } = e.target;
        console.log(name, 'name')
        if (newValue) {
            setData({ ...data, [name1]: newValue });
        } else {
            setData({ ...data, [name]: value });
        }

        // Real-time validation
        let tempErrors: any = { ...errors };

        if (name === "name") {
            if (!value) {
                tempErrors.name = "Name is required";
            } else {
                tempErrors.name = "";
            }
        }

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

        if (name === "confirmPassword") {
            if (!value) {
                tempErrors.confirmPassword = "Confirm password is required";
            } else if (data?.password !== value) {
                tempErrors.confirmPassword = "Confirm password must be equal to new password";
            } else {
                tempErrors.confirmPassword = "";
            }
        }

        if (name === "rollNo") {
            if (!value) {
                tempErrors.rollNo = "Roll number is required";
            } else {
                tempErrors.rollNo = "";
            }
        }

        if (name1 === "hostel") {
            if (!newValue) {
                tempErrors.hostel = "Hostel is required";
            } else {
                tempErrors.hostel = "";
            }
        }

        if (name === "roomNo") {
            if (!value) {
                tempErrors.roomNo = "Room number is required";
            } else {
                tempErrors.roomNo = "";
            }
        }

        if (name === "staffCode") {
            if (!value) {
                tempErrors.staffCode = "Staff Code is required";
            } else {
                tempErrors.staffCode = "";
            }
        }

        setErrors(tempErrors);
    };

    const validate = () => {
        let tempErrors = {
            name: '',
            rollNo: '',
            email: '',
            hostel: '',
            roomNo: '',
            password: '',
            confirmPassword: '',
            staffCode: ''
        };
        let isValid = true;


        if (!data?.name) {
            tempErrors.name = "Name is required";
            isValid = false;
        }

        if (!data?.email) {
            tempErrors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(data?.email)) {
            tempErrors.email = "Email is invalid";
            isValid = false;
        }

        if (!data?.password) {
            tempErrors.password = "Password is required";
            isValid = false;
        } else if (data?.length < 6) {
            tempErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        if (!data?.confirmPassword) {
            tempErrors.confirmPassword = "Confirm password is required";
            isValid = false;
        } else if (data?.password !== data?.confirmPassword) {
            tempErrors.confirmPassword = "Confirm password must be equal to new password";
            isValid = false;
        }


        if (!data?.rollNo && role === "student") {
            tempErrors.rollNo = "Roll Number is required";
            isValid = false;
        }
        if (!data?.hostel && role === "student") {
            tempErrors.hostel = "Hostel is required";
            isValid = false;
        }
        if (!data?.roomNo && role === "student") {
            tempErrors.roomNo = "Room Number is required";
            isValid = false;
        }

        if (!data?.staffCode && role === "staff") {
            tempErrors.staffCode = "staff Code is required";
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validate()) {
            // Proceed with login
            setSnackBar("success", "Registered successfully!");
            console.log("Login data:", data);
            // Add your login API call here
        } else {
            setSnackBar("error", "Please fix the errors before submitting");
        }
    };

    useEffect(() => {
        setData({
            name: '',
            rollNo: '',
            email: '',
            hostel: '',
            roomNo: '',
            password: '',
            confirmPassword: '',
            staffCode: '',
        })
        setErrors({
            name: '',
            rollNo: '',
            email: '',
            hostel: '',
            roomNo: '',
            password: '',
            confirmPassword: '',
            staffCode: '',
        })
        setIsVerified(false)
        setIsOtpSent(false)
        setOtp('')
    }, [role])

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
                                name='name'
                                value={data?.name}
                                error={Boolean(errors?.name)}
                                helperText={errors?.name}
                                onChange={(e) => handleChangeInput(e)}
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
                                name='rollNo'
                                value={data?.rollNo}
                                error={Boolean(errors?.rollNo)}
                                helperText={errors?.rollNo}
                                onChange={(e) => handleChangeInput(e)}
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
                                    name='email'
                                    value={data?.email}
                                    error={Boolean(errors?.email)}
                                    helperText={errors?.email}
                                    onChange={(e) => isOtpSent ? {} : handleChangeInput(e)}
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
                                <Grid item sm={2} xs={12}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            mt: 3,
                                            borderRadius: "50px",
                                            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                                        }}
                                        onClick={handleSendOtp}
                                        disabled={!data?.email}
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
                                // value={hostel} // state variable
                                PaperComponent={DarkPaper}
                                value={data?.hostel}
                                onChange={(e, newValue) => handleChangeInput(e, 'hostel', newValue)}
                                // onChange={(e, newValue) => setHostel(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Hostel"
                                        name='hostel'
                                        margin="normal"
                                        required
                                        variant="outlined"
                                        error={Boolean(errors?.hostel)}
                                        helperText={errors?.hostel}
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
                                name='roomNo'
                                value={data?.roomNo}
                                error={Boolean(errors?.roomNo)}
                                helperText={errors?.roomNo}
                                onChange={(e) => handleChangeInput(e)}
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
                                name='password'
                                value={data?.password}
                                error={Boolean(errors?.password)}
                                helperText={errors?.password}
                                onChange={(e) => handleChangeInput(e)}
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
                                name='confirmPassword'
                                value={data?.confirmPassword}
                                error={Boolean(errors?.confirmPassword)}
                                helperText={errors?.confirmPassword}
                                onChange={(e) => handleChangeInput(e)}
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
                                name='name'
                                value={data?.name}
                                error={Boolean(errors?.name)}
                                helperText={errors?.name}
                                onChange={(e) => handleChangeInput(e)}
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
                                    name='email'
                                    value={data?.email}
                                    error={Boolean(errors?.email)}
                                    helperText={errors?.email}
                                    onChange={(e) => isOtpSent ? {} : handleChangeInput(e)}
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
                                <Grid item sm={2} xs={12}>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            mt: 3,
                                            borderRadius: "50px",
                                            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                                        }}
                                        onClick={handleSendOtp}
                                        disabled={!data?.email}
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
                                name='staffCode'
                                value={data?.staffCode}
                                error={Boolean(errors?.staffCode)}
                                helperText={errors?.staffCode}
                                onChange={(e) => handleChangeInput(e)}
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
                                name='password'
                                value={data?.password}
                                error={Boolean(errors?.password)}
                                helperText={errors?.password}
                                onChange={(e) => handleChangeInput(e)}
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
                                name='confirmPassword'
                                value={data?.confirmPassword}
                                error={Boolean(errors?.confirmPassword)}
                                helperText={errors?.confirmPassword}
                                onChange={(e) => handleChangeInput(e)}
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
                    onClick={() => handleSubmit()}
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
