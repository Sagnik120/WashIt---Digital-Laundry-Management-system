// pages/auth/forgot-password.jsx
import React from "react";
import { Typography, TextField, Button, Box } from "@mui/material";
import AuthWrapper from "@/Components/AuthLayout/AuthLayout";

const ForgotPassword = () => {
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
                >
                    Send Temporary Password
                </Button>
            </Box>
        </AuthWrapper>
    );
};

export default ForgotPassword;
