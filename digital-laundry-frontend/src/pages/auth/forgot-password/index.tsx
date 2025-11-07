// pages/auth/forgot-password.jsx
import React, { useState } from "react";
import { Typography, TextField, Button, Box, useTheme } from "@mui/material";
import AuthWrapper from "@/Components/AuthLayout/AuthLayout";
import usePageLoader from "@/Redux/hooks/usePageLoader";
import useSnackBar from "@/Redux/hooks/useSnackBar";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const ForgotPassword = () => {

    const dispatch = useDispatch();
    const theme = useTheme();
    const router = useRouter();
    const setFullPageLoader = usePageLoader();
    const { setSnackBar } = useSnackBar();


    const [data, setData] = useState<any>({
        email: '',
    })
    const [errors, setErrors] = useState<any>({
        email: "",
    });

    const handleChangeInput = (e: any) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });

        // Real-time validation
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

        setErrors(tempErrors);
    };

    const validate = () => {
        let tempErrors = { email: "" };
        let isValid = true;

        if (!data?.email) {
            tempErrors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(data?.email)) {
            tempErrors.email = "Email is invalid";
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validate()) {
            // Proceed with login
            setSnackBar("success", "Temporary password has been sent to your email!");
            // Add your login API call here
        } else {
            setSnackBar("error", "Please fix the errors before submitting");
        }
    };

    return (
        <AuthWrapper>
            <Box p={2}>
                <Typography variant="h4" fontWeight="700" gutterBottom>
                    🔒 Forgot Password
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 3, opacity: 0.9 }}>
                    Enter your registered email, and we’ll send you a
                    <strong> temporary password</strong> to log in.
                </Typography>

                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    name='email'
                    value={data?.email}
                    error={Boolean(errors?.email)}
                    helperText={errors?.email}
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

                <Button
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: 3,
                        py: 1.5,
                        borderRadius: "50px",
                        background: "linear-gradient(135deg, #9333ea, #ec4899)",
                    }}
                    onClick={() => handleSubmit()}
                >
                    Send Temporary Password
                </Button>
            </Box>
        </AuthWrapper>
    );
};

export default ForgotPassword;
