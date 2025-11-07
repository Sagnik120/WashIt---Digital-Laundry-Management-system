import React, { useState } from "react";
import { Typography, TextField, Button, Box, useTheme } from "@mui/material";
import AuthWrapper from "@/Components/AuthLayout/AuthLayout";
import usePageLoader from "@/Redux/hooks/usePageLoader";
import useSnackBar from "@/Redux/hooks/useSnackBar";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const ChangePassword = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const router = useRouter();
    const setFullPageLoader = usePageLoader();
    const { setSnackBar } = useSnackBar();


    const [data, setData] = useState<any>({
        email: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState<any>({
        email: "",
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
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

        if (name === "newPassword") {
            if (!value) {
                tempErrors.newPassword = "New password is required";
            } else if (value.length < 6) {
                tempErrors.newPassword = "New password must be at least 6 characters";
            } else {
                tempErrors.newPassword = "";
            }
        }

        if (name === "confirmPassword") {
            if (!value) {
                tempErrors.confirmPassword = "Confirm password is required";
            } else if (data?.newPassword !== value) {
                tempErrors.confirmPassword = "Confirm password must be equal to new password";
            } else {
                tempErrors.confirmPassword = "";
            }
        }

        if (name === "oldPassword") {
            if (!value) {
                tempErrors.oldPassword = "Old password is required";
            } else if (value.length < 6) {
                tempErrors.oldPassword = "Please enter correct Old password";
            } else {
                tempErrors.oldPassword = "";
            }
        }

        setErrors(tempErrors);
    };

    const validate = () => {
        let tempErrors = { email: "", newPassword: "", confirmPassword: "", oldPassword: "" };
        let isValid = true;

        if (!data?.email) {
            tempErrors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(data?.email)) {
            tempErrors.email = "Email is invalid";
            isValid = false;
        }

        if (!data?.newPassword) {
            tempErrors.newPassword = "New password is required";
            isValid = false;
        } else if (data?.length < 6) {
            tempErrors.newPassword = "New password must be at least 6 characters";
            isValid = false;
        }

        if (!data?.confirmPassword) {
            tempErrors.confirmPassword = "Confirm password is required";
            isValid = false;
        } else if (data?.newPassword !== data?.confirmPassword) {
            tempErrors.confirmPassword = "Confirm password must be equal to new password";
            isValid = false;
        }

        if (!data?.oldPassword) {
            tempErrors.oldPassword = "Old password is required";
            isValid = false;
        } else if (data?.oldPassword?.length < 6) {
            tempErrors.oldPassword = "Please enter correct Old password";
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleChangePassword = () => {
        if (validate()) {
            // Proceed with login
            setSnackBar("success", "Password changed successfully!");
            // Add your login API call here
        } else {
            setSnackBar("error", "Please fix the errors before submitting");
        }
    };

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
                    label="Email"
                    type="Email"
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

                <TextField
                    fullWidth
                    label="Old Password"
                    type="password"
                    name='oldPassword'
                    value={data?.oldPassword}
                    error={Boolean(errors?.oldPassword)}
                    helperText={errors?.oldPassword}
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

                <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    name='newPassword'
                    value={data?.newPassword}
                    error={Boolean(errors?.newPassword)}
                    helperText={errors?.newPassword}
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

                <TextField
                    fullWidth
                    label="Confirm New Password"
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
                    onClick={() => handleChangePassword()}
                >
                    Update Password
                </Button>
            </Box>
        </AuthWrapper>
    );
};

export default ChangePassword;
