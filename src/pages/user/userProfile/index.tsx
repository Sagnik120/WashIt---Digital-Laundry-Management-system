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
import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

export default function StudentDashboard() {
    const stats = [
        { name: "Pending", value: 2, color: "#f59e0b", icon: <HourglassBottom /> },
        {
            name: "In Progress",
            value: 1,
            color: "#3b82f6",
            icon: <LocalLaundryService />,
        },
        { name: "Completed", value: 5, color: "#10b981", icon: <CheckCircle /> },
    ];
    const [openEdit, setOpenEdit] = useState(false);

    // Mock profile data
    const [profile, setProfile] = useState({
        name: "Shreeval Paladiya",
        rollNo: "21BCP123",
        email: "shreeval@example.com",
        hostel: "A-Block",
        roomNo: "205",
        department: "Computer Science",
        year: "3rd Year",
        phone: "+91 9876543210",
        photo: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // 📸 Handle profile photo upload
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfile({ ...profile, photo: reader.result as string });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // Greeting message
    const hours = new Date().getHours();
    const greeting =
        hours < 12 ? "Good Morning" : hours < 18 ? "Good Afternoon" : "Good Evening";

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
                    {greeting}, {profile.name.split(" ")[0]} 👋
                </Typography>

                <Grid container spacing={4}>
                    {/* Profile Card */}
                    <Grid item xs={12} md={4}>
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
                                    src={profile.photo || ""}
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        bgcolor: "#3b82f6",
                                        fontSize: 32,
                                        border: "3px solid #fff",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    {profile.name.charAt(0)}
                                </Avatar>

                                <Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {profile.name}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        {profile.department} • {profile.year}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Profile Details */}
                            <CardContent>
                                <Grid container spacing={2}>
                                    {[
                                        { title: "Email", value: profile.email, full: true }, // ✅ full width
                                        { title: "Roll Number", value: profile.rollNo, full: false },
                                        { title: "Hostel", value: profile.hostel, full: false },
                                        { title: "Room No", value: profile.roomNo, full: false },
                                        { title: "Phone", value: profile.phone, full: false },
                                        { title: "Department", value: profile.department, full: false },
                                        { title: "Year", value: profile.year, full: false },
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
                                    fullWidth // ✅ makes button full width
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
                                            background: "linear-gradient(135deg,#1e40af,#1e3a8a)", // darker hover
                                            transform: "translateY(-2px)", // subtle lift
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
                    <Grid item xs={12} md={8}>

                        {/* Summary Cards */}
                        <Grid container spacing={3}>
                            {stats.map((stat, index) => (
                                <Grid item xs={12} sm={4} key={index}>
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
                                            {stat.name === "Pending" && (
                                                <HourglassBottom sx={{ color: stat.color }} fontSize="large" />
                                            )}
                                            {stat.name === "In Progress" && (
                                                <LocalLaundryService sx={{ color: stat.color }} fontSize="large" />
                                            )}
                                            {stat.name === "Completed" && (
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
                                            sx={{
                                                letterSpacing: 0.5,
                                                color: "#374151",
                                            }}
                                        >
                                            {stat.name}
                                        </Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>



                        {/* Pie Chart */}
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
                                Order Status Overview
                            </Typography>
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={stats}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {stats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <ReTooltip
                                        contentStyle={{
                                            backgroundColor: "white",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "8px",
                                            padding: "8px 12px",
                                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
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
                            src={profile.photo || ""}
                            sx={{ width: 100, height: 100, bgcolor: "#3b82f6", fontSize: 32 }}
                        >
                            {profile.name.charAt(0)}
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
                                        bgcolor: "white", // keep same background on hover
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)", // only shadow change
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
                    <Button variant="contained" onClick={() => setOpenEdit(false)}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
