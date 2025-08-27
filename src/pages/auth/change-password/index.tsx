import React from "react";
import { Typography, TextField, Button, Box } from "@mui/material";
import AuthWrapper from "@/Components/AuthLayout/AuthLayout";

const ChangePassword = () => {
    return (
        <AuthWrapper>
            <Box p={2}>
                <Typography variant="h4" fontWeight="700" gutterBottom>
                    🔑 Change Password
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 3, opacity: 0.9 }}>
                    Enter your old password and create a new one.
                </Typography>

                <TextField
                    fullWidth
                    label="Old Password"
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

                <TextField
                    fullWidth
                    label="New Password"
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

                <TextField
                    fullWidth
                    label="Confirm New Password"
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
                    Update Password
                </Button>
            </Box>
        </AuthWrapper>
    );
};

export default ChangePassword;
