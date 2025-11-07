"use client";
import { useState } from "react";
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Paper,
} from "@mui/material";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import SecurityIcon from "@mui/icons-material/Security";

export default function AdminConfigTabs() {
    const [tab, setTab] = useState(0);

    const handleChange = (_: any, newValue: number) => setTab(newValue);

    return (
        <Box sx={{ p: 3, minHeight: "82vh", background: "linear-gradient(135deg,#e0f2fe,#f0fdfa)" }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                ⚙️ Admin Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                Manage Hostels and Staff Access Codes.
            </Typography>

            <Paper
                elevation={2}
                sx={{
                    borderRadius: 2,
                    mb: 3,
                    overflow: "hidden",
                }}
            >
                <Tabs
                    value={tab}
                    onChange={handleChange}
                    variant="fullWidth"
                    sx={{
                        background: "#ffffff",
                        "& .MuiTab-root": { textTransform: "none", fontWeight: 600, py: 1.2 },
                    }}
                >
                    <Tab icon={<HomeWorkIcon />} iconPosition="start" label="Hostels" />
                    <Tab icon={<SecurityIcon />} iconPosition="start" label="Staff Codes" />
                </Tabs>
            </Paper>

            {/* 🔹 Unmount on Change (Option A) */}
            {tab === 0 && <HostelConfig />}
            {tab === 1 && <StaffConfig />}
        </Box>
    );
}

/* Lazy-loaded wrapper so component unmounts & re-mounts (fresh data) */
function HostelConfig() {
    const HostelConfigPage = require("./../../../Components/Admin/Configuration/HostelConfigPage").default;
    return <HostelConfigPage />;
}

function StaffConfig() {
    const StaffConfigPage = require("./../../../Components/Admin/Configuration/StaffConfigPage").default;
    return <StaffConfigPage />;
}
