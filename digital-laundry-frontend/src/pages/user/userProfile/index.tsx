"use client";
import {
    AppBar,
    Toolbar,
    Box,
    Grid,
    Card,
    Typography,
    Avatar,
    Divider,
    Button,
    LinearProgress,
    Stack,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    CardContent,
} from "@mui/material";
import {
    LocalLaundryService,
    CheckCircle,
    HourglassBottom,
    Edit,
    AddCircle,
    Notifications,
    Phone,
    Home,
    PhotoCamera,
} from "@mui/icons-material";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip as ReTooltip,
} from "recharts";
import CountUp from "react-countup";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import usePageLoader from "@/Redux/hooks/usePageLoader";
import useSnackBar from "@/Redux/hooks/useSnackBar";
import ErrorHandler from "@/lib/errorHandler";
import { useDispatch } from "react-redux";
import { BaseUrl } from "@/ApiSetUp/AuthApi";
import { StudentDashboardData } from "@/Redux/Actions/AuthUser";
import { QrCode2 } from "@mui/icons-material";

export default function StudentDashboard() {
    const dispatch = useDispatch();
    const router = useRouter();
    const setFullPageLoader = usePageLoader();
    const { setSnackBar } = useSnackBar();

    const [orderStats, setOrderStats] = useState([
        { key: "QR_NOT_SCANNED", label: "QR Not Scanned", value: 0, color: "#f87171", icon: <QrCode2 /> },
        { key: "PENDING", label: "Pending", value: 0, color: "#f59e0b", icon: <HourglassBottom /> },
        { key: "IN_PROGRESS", label: "In Progress", value: 0, color: "#3b82f6", icon: <LocalLaundryService /> },
        { key: "COMPLETED", label: "Completed", value: 0, color: "#10b981", icon: <CheckCircle /> },
    ]);

    const [complaintStats, setComplaintStats] = useState([
        { key: "OPEN", label: "Open", value: 0, color: "#f59e0b" },
        { key: "IN_REVIEW", label: "In Review", value: 0, color: "#3b82f6" },
        { key: "RESOLVED", label: "Resolved", value: 0, color: "#10b981" },
        { key: "CLOSED", label: "Closed", value: 0, color: "#64748b" },
    ]);

    const pieOrderData = orderStats.map(s => ({ name: s.label, value: s.value, color: s.color }));
    const pieComplaintData = complaintStats.map(s => ({ name: s.label, value: s.value, color: s.color }));


    const [openEdit, setOpenEdit] = useState(false);
    const [userData, setUserData] = useState<any>({
        full_name: "",
        roll_number: "",
        email: "",
        hostel_name: "",
        room_number: "",
        department_name: "",
        passing_year: "",
        phone_number: "",
        profile_picture: "",
    });

    const [profile, setProfile] = useState<any>({
        full_name: "",
        roll_number: "",
        email: "",
        hostel_name: "",
        room_number: "",
        department_name: "",
        passing_year: "",
        phone_number: "",
        profile_picture: "",
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        try {
            const raw = localStorage.getItem("userData");   
            if (raw) {  
                const parsed = JSON.parse(raw);
                setUserData(parsed);
                // map or normalize keys if needed
                setProfile((p: any) => ({ ...p, ...parsed }));
            }
        } catch (e) {
            // ignore parse errors
        }
    }, []);

    // 📸 Handle profile photo upload
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfile({ ...profile, profile_picture: reader.result as string });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // Greeting message
    const hours = new Date().getHours();
    const greeting =
        hours < 12 ? "Good Morning" : hours < 18 ? "Good Afternoon" : "Good Evening";

    // Auth helpers
    function getAuthToken() {
        return localStorage.getItem("token") || localStorage.getItem("authToken") || "";
    }
    function authHeaders() {
        const token = getAuthToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        return headers;
    }

    // Save profile -> PUT /api/me
    const saveProfile = async () => {
        try {
            setFullPageLoader(true);
            // map UI profile -> API body
            const body = {
                fullName: profile.full_name,
                phone: profile.phone_number,
                passingYear: Number(profile.passing_year) || 0,
                roomNo: profile.room_number,
                profileImageUrl: profile.profile_picture,
            };

            const url = `${BaseUrl}/api/me`;
            const res = await fetch(url, {
                method: "PUT",
                headers: authHeaders(),
                body: JSON.stringify(body),
            });

            const json = await (async () => {
                try { return await res.json(); } catch { return null; }
            })();

            if (!res.ok) {
                const msg = json?.message || `Request failed (${res.status})`;
                throw new Error(msg);
            }

            // update UI state
            const updatedProfile = { ...profile };
            setProfile((p: any) => ({ ...p, ...profile }));
            setUserData((u: any) => ({ ...u, ...profile }));
            try { localStorage.setItem("userData", JSON.stringify({ ...userData, ...updatedProfile })); } catch { }
            setSnackBar("success", "Profile updated successfully");
            setOpenEdit(false);
        } catch (err: any) {
            console.error(err);
            setSnackBar("error", err.message || "Failed to update profile");
        } finally {
            setFullPageLoader(false);
        }
    };

    const _StudentDashboardData = async () => {
            setFullPageLoader(true);
            try {
                const res: any = await dispatch(StudentDashboardData());
                const ok = ErrorHandler(res, setSnackBar);
                if (ok) {
                    const payload = res?.payload ?? res?.data ?? res ?? {};
                    const orders = payload.orders ?? {};
                    const complaints = payload.complaints ?? {};
                    
                    setOrderStats((prev) =>
                        prev.map((s) => ({
                            ...s,
                            value: Number(orders[s.key] ?? 0),
                        }))
                    );
                    setComplaintStats((prev) =>
                        prev.map((s) => ({
                            ...s,
                            value: Number(complaints[s.key] ?? 0),
                        }))
                    );
                }
            } catch (err: any) {
                console.error(err);
                setSnackBar("error", err.message || "Failed to load hostels");
            } finally {
                setFullPageLoader(false);
            }
        };

    // keep profile in sync if userData changes
    useEffect(() => {
        setProfile((p: any) => ({ ...p, ...userData }));
    }, [userData]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("userData");
            if (raw) {
                const parsed = JSON.parse(raw);
                setUserData(parsed);
                // map or normalize keys if needed
                setProfile((p: any) => ({ ...p, ...parsed }));
            }
        } catch (e) {
            // ignore parse errors
        }
    }, []);

    useEffect(() => {
        _StudentDashboardData();
    }, []);


    return (
        <>
            <Box
                sx={{
                    flexGrow: 1,
                    minHeight: "82vh",
                    px: { xs: 2, md: 4 },
                    py: 3,
                    background: "linear-gradient(135deg, #e0f2fe, #f0fdfa)",
                    backgroundAttachment: "fixed",
                }}
            >
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary" mb={3}>
                    {greeting}, {profile.full_name.split(" ")[0]} 👋
                </Typography>

                <Grid container spacing={4}>
                    {/* Profile Card */}
                    <Grid item xs={12} lg={6}>
                        <Card
                            sx={{
                                width: "100%",
                                maxWidth: 600,
                                borderRadius: 3,
                                boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                                p: 3,
                                position: "relative",
                            }}
                        >
                            {/* Profile Header */}
                            <Box display="flex" alignItems="center" gap={3}>
                                <Avatar
                                    src={profile.profile_picture || ""}
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        bgcolor: "#3b82f6",
                                        fontSize: 32,
                                        border: "3px solid #fff",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    {profile.full_name.charAt(0)}
                                </Avatar>

                                <Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {profile.full_name}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        {profile.department_name} • {profile.passing_year}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Profile Details */}
                            <CardContent>
                                <Grid container spacing={2}>
                                    {[
                                        { title: "Email", value: profile.email, full: true }, // ✅ full width
                                        { title: "Roll Number", value: profile.roll_number, full: false },
                                        { title: "Hostel", value: profile.hostel_name, full: false },
                                        { title: "Room No", value: profile.room_number, full: false },
                                        { title: "Phone", value: profile.phone_number, full: false },
                                        { title: "Department", value: profile.department_name, full: false },
                                        { title: "Passing Year", value: profile.passing_year, full: false },
                                    ].map((item, index) => (
                                        <Grid item xs={12} sm={item.full ? 12 : 6} key={index}>
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    bgcolor: "rgba(59,130,246,0.05)",
                                                    transition: "all 0.3s ease",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    height: "80px",
                                                    overflow: "hidden",
                                                    "&:hover": {
                                                        bgcolor: "rgba(59,130,246,0.1)",
                                                        transform: "translateY(-2px)",
                                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                                    },
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: "text.secondary", fontWeight: 500, mb: 0.5 }}
                                                >
                                                    {item.title}
                                                </Typography>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: "text.primary",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item.value}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>

                            {/* 🔥 Modern Edit Button at Bottom */}
                            <Box mt={2}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    startIcon={<EditIcon />}
                                    onClick={() => setOpenEdit(true)}
                                    sx={{
                                        borderRadius: 2,
                                        py: 1,
                                        fontWeight: 600,
                                        fontSize: "1rem",
                                        background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                                        boxShadow: "0 4px 12px rgba(37,99,235,0.4)",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            background: "linear-gradient(135deg,#1e40af,#1e3a8a)",
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 6px 16px rgba(30,58,138,0.6)",
                                        },
                                    }}
                                >
                                    Edit Profile
                                </Button>
                            </Box>
                        </Card>
                    </Grid>

                    {/* Dashboard Content */}
                    <Grid item xs={12} md={6}>
                        {/* Summary Cards */}
                        <Typography variant="h6" fontWeight={700} mb={2}>
                            Order Status Overview
                        </Typography>
                        <Grid container spacing={3}>
                            {orderStats.map((stat, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                    <Card
                                        sx={{
                                            borderRadius: 5,
                                            textAlign: "center",
                                            p: 4,
                                            background: `linear-gradient(145deg, ${stat.color}22, #ffffff)`,
                                            border: `1px solid ${stat.color}33`,
                                            boxShadow: "8px 8px 20px rgba(0,0,0,0.1), -8px -8px 20px #fff",
                                            transition: "0.35s",
                                            position: "relative",
                                            overflow: "hidden",
                                            "&:hover": {
                                                transform: "translateY(-8px) scale(1.04)",
                                                boxShadow: `0 10px 30px ${stat.color}55`,
                                            },
                                        }}
                                    >
                                        {/* Glowing icon badge */}
                                        <Box
                                            sx={{
                                                width: 70,
                                                height: 70,
                                                borderRadius: "50%",
                                                mx: "auto",
                                                mb: 2,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                background: `radial-gradient(circle at 30% 30%, ${stat.color}99, ${stat.color}44)`,
                                                boxShadow: `0 0 20px ${stat.color}55`,
                                                transition: "0.3s",
                                                "&:hover": {
                                                    boxShadow: `0 0 30px ${stat.color}`,
                                                    transform: "scale(1.1)",
                                                },
                                            }}
                                        >
                                            {stat.label === "QR Not Scanned" && (
                                                <QrCode2 sx={{ color: stat.color }} fontSize="large" />
                                            )}
                                            {stat.label === "Pending" && (
                                                <HourglassBottom sx={{ color: stat.color }} fontSize="large" />
                                            )}
                                            {stat.label === "In Progress" && (
                                                <LocalLaundryService sx={{ color: stat.color }} fontSize="large" />
                                            )}
                                            {stat.label === "Completed" && (
                                                <CheckCircle sx={{ color: stat.color }} fontSize="large" />
                                            )}
                                        </Box>

                                        {/* Animated number with CountUp */}
                                        <Typography
                                            variant="h3"
                                            fontWeight="bold"
                                            color={stat.color}
                                            sx={{ mb: 1 }}
                                        >
                                            <CountUp start={0} end={stat.value} duration={1.5} />
                                        </Typography>

                                        {/* Status Name */}
                                        <Typography
                                            variant="h6"
                                            sx={{ letterSpacing: 0.5, color: "#374151" }}
                                        >
                                            {stat.label}
                                        </Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Complaint Counts (below Summary Cards) */}
                        <Box mt={4}>
                            <Typography variant="h6" fontWeight={700} mb={2}>
                                Complaint Status
                            </Typography>
                            <Grid container spacing={3}>
                                {complaintStats.map((stat, index) => (
                                    <Grid item xs={12} sm={6} key={`cmp-${index}`}>
                                        <Card
                                            sx={{
                                                borderRadius: 5,
                                                textAlign: "center",
                                                p: 4,
                                                background: `linear-gradient(145deg, ${stat.color}22, #ffffff)`,
                                                border: `1px solid ${stat.color}33`,
                                                boxShadow: "8px 8px 20px rgba(0,0,0,0.1), -8px -8px 20px #fff",
                                                transition: "0.35s",
                                                position: "relative",
                                                overflow: "hidden",
                                                "&:hover": {
                                                    transform: "translateY(-8px) scale(1.04)",
                                                    boxShadow: `0 10px 30px ${stat.color}55`,
                                                },
                                            }}
                                        >
                                            <Typography
                                                variant="h3"
                                                fontWeight="bold"
                                                sx={{ mb: 1, color: stat.color }}
                                            >
                                                <CountUp start={0} end={stat.value} duration={1.2} />
                                            </Typography>
                                            <Typography variant="h6" sx={{ letterSpacing: 0.5, color: "#374151" }}>
                                                {stat.label}
                                            </Typography>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        {/* Pie charts container omitted for brevity (unchanged) */}
                        <Card
                            sx={{
                                borderRadius: 5,
                                mt: 4,
                                p: 3,
                                background: "linear-gradient(135deg,#ffffff,#f9fafb)",
                                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                            }}
                        >
                            <Typography variant="h6" textAlign="center" gutterBottom>
                                Status Overviews
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card
                                        variant="outlined"
                                        sx={{ borderRadius: 4, p: 2, background: "linear-gradient(180deg,#ffffff,#fbfdff)" }}
                                    >
                                        <Typography variant="subtitle1" textAlign="center" mb={1.5}>
                                            Order Status Overview
                                        </Typography>
                                        <Box sx={{ width: "100%", height: 280 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={pieOrderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                                                        {pieOrderData.map((entry, index) => <Cell key={`o-cell-${index}`} fill={entry.color} />)}
                                                    </Pie>
                                                    <ReTooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Card
                                        variant="outlined"
                                        sx={{ borderRadius: 4, p: 2, background: "linear-gradient(180deg,#ffffff,#fbfdff)" }}
                                    >
                                        <Typography variant="subtitle1" textAlign="center" mb={1.5}>
                                            Complaint Status Overview
                                        </Typography>
                                        <Box sx={{ width: "100%", height: 280 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={pieComplaintData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                                                        {pieComplaintData.map((entry, index) => <Cell key={`c-cell-${index}`} fill={entry.color} />)}
                                                    </Pie>
                                                    <ReTooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* Edit Dialog */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" justifyContent="center" mb={2}>
                        <Avatar
                            src={profile.profile_picture || ""}
                            sx={{ width: 100, height: 100, bgcolor: "#3b82f6", fontSize: 32 }}
                        >
                            {profile.full_name.charAt(0)}
                        </Avatar>
                        <input
                            accept="image/*"
                            style={{ display: "none" }}
                            id="upload-photo"
                            type="file"
                            onChange={handlePhotoUpload}
                        />
                        <label htmlFor="upload-photo">
                            <IconButton
                                color="primary"
                                component="span"
                                sx={{
                                    ml: -4,
                                    mt: 7,
                                    bgcolor: "white",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                    "&:hover": {
                                        bgcolor: "white",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                                    },
                                }}
                            >
                                <PhotoCamera />
                            </IconButton>
                        </label>
                    </Box>

                    <Grid container spacing={2} mt={1}>
                        {Object.keys(profile).map((key) =>
                            key !== "photo" ? (
                                <Grid item xs={12} sm={6} key={key}>
                                    <TextField
                                        fullWidth
                                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                                        name={key}
                                        value={(profile as any)[key]}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            ) : null
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
                    <Button variant="contained" onClick={saveProfile}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
