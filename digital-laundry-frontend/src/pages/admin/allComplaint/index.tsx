"use client";
import React, { useMemo, useState } from "react";
import {
    Box,
    Grid,
    Card,
    Typography,
    Avatar,
    Stack,
    Chip,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Badge,
    Button,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CountUp from "react-countup";

type ComplaintStatus = "Open" | "In Review" | "Resolved" | "Closed";

interface Complaint {
    id: string;
    ticket_no: string;
    title: string;
    description: string;
    category: "Maintenance" | "Hostel" | "Mess" | "Academics" | "Other";
    status: ComplaintStatus;
    created_at: string; // ISO
    updated_at: string; // ISO
    order_id: string;
    hostel: string;
    laundry_id: string;
}

const STATUS_STEPS = ["Open", "In Review", "Resolved", "Closed"] as const;

export default function AdminComplaintsPage() {
    // brand palette
    const BRAND = {
        open: "#f59e0b",
        review: "#3b82f6",
        resolved: "#10b981",
        closed: "#64748b",
        chipBg(alpha = "22") {
            return {
                Open: `${this.open}${alpha}`,
                "In Review": `${this.review}${alpha}`,
                Resolved: `${this.resolved}${alpha}`,
                Closed: `${this.closed}${alpha}`,
            } as Record<ComplaintStatus, string>;
        },
        color() {
            return {
                Open: this.open,
                "In Review": this.review,
                Resolved: this.resolved,
                Closed: this.closed,
            } as Record<ComplaintStatus, string>;
        },
    };

    // sample data (replace with API)
    const [complaints] = useState<Complaint[]>([
        {
            id: "c1",
            ticket_no: "CMP-25001",
            title: "Damaged button on shirt",
            description: "One button missing after wash.",
            category: "Maintenance",
            status: "Open",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
            updated_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
            order_id: "LDR-2025-0007",
            hostel: "A-Block",
            laundry_id: "STU-101",
        },
        {
            id: "c2",
            ticket_no: "CMP-25002",
            title: "Late delivery for order",
            description: "Delivery exceeded expected time by 24 hours.",
            category: "Other",
            status: "In Review",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
            updated_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
            order_id: "LDR-2025-0015",
            hostel: "A-Block",
            laundry_id: "STU-098",
        },
        {
            id: "c3",
            ticket_no: "CMP-25003",
            title: "Color faded (black jeans)",
            description: "Significant fading observed.",
            category: "Maintenance",
            status: "Resolved",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
            updated_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
            order_id: "LDR-2025-0018",
            hostel: "B-Block",
            laundry_id: "STU-110",
        },
        {
            id: "c4",
            ticket_no: "CMP-25004",
            title: "Issue with LDR-2025-0020",
            description: "Some clothes came back damp.",
            category: "Maintenance",
            status: "Closed",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(),
            updated_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
            order_id: "LDR-2025-0020",
            hostel: "B-Block",
            laundry_id: "STU-102",
        },
        {
            id: "c5",
            ticket_no: "CMP-25005",
            title: "WiFi not working near laundry area",
            description: "Frequent disconnects affecting QR scan.",
            category: "Hostel",
            status: "Open",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
            updated_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
            order_id: "LDR-2025-0023",
            hostel: "C-Block",
            laundry_id: "STU-087",
        },
    ]);

    // filters
    const [statusFilter, setStatusFilter] = useState<"All" | ComplaintStatus>("All");
    const [hostelFilter, setHostelFilter] = useState<string>("All");

    const hostelOptions = useMemo(() => {
        const set = new Set<string>();
        complaints.forEach((c) => set.add(c.hostel));
        return ["All", ...Array.from(set).sort()];
    }, [complaints]);

    // base filters (hostel + laundry id)
    const baseFiltered = useMemo(() => {
        let data = complaints;
        if (hostelFilter !== "All") data = data.filter((c) => c.hostel === hostelFilter);
        return data;
    }, [complaints, hostelFilter]);

    // counts reflect base filters
    const counts = useMemo(() => {
        return baseFiltered.reduce(
            (acc, c) => {
                acc.total++;
                acc[c.status]++;
                return acc;
            },
            { total: 0, Open: 0, "In Review": 0, Resolved: 0, Closed: 0 } as Record<
                "total" | ComplaintStatus,
                number
            >
        );
    }, [baseFiltered]);

    // final list after clicking a counter (status filter applied over base filters)
    const finalList = useMemo(() => {
        return statusFilter === "All"
            ? baseFiltered
            : baseFiltered.filter((c) => c.status === statusFilter);
    }, [baseFiltered, statusFilter]);

    const clearFilters = () => {
        setHostelFilter("All");
        setStatusFilter("All");
    };

    // ---------- Static info pipeline (top) ----------
    const InfoPipeline = ({
        counts,
    }: {
        counts: Record<"total" | ComplaintStatus, number>;
    }) => {
        const ICONS: Record<ComplaintStatus, JSX.Element> = {
            Open: <ReportProblemIcon fontSize="small" />,
            "In Review": <ManageSearchIcon fontSize="small" />,
            Resolved: <TaskAltIcon fontSize="small" />,
            Closed: <CheckCircleIcon fontSize="small" />,
        };

        const stepColor: Record<ComplaintStatus, string> = BRAND.color();
        const baseLine = "#e5e7eb";

        return (
            <Card
                sx={{
                    borderRadius: 4,
                    p: 2.5,
                    mb: 2.5,
                    background: "linear-gradient(135deg,#ffffff,#f9fafb)",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                }}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle1" fontWeight={800}>
                        Complaints Progress (Info)
                    </Typography>
                    <Chip
                        size="small"
                        label={`Total: ${counts.total}`}
                        sx={{ fontWeight: 700, backgroundColor: "#f1f5f9" }}
                    />
                </Stack>

                {/* connector line (decorative/static) */}
                <Box sx={{ position: "relative", height: 8, borderRadius: 999, backgroundColor: baseLine }}>
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(90deg,#94a3b8,#93c5fd,#86efac,#cbd5e1)",
                            opacity: 0.35,
                            borderRadius: 999,
                        }}
                    />
                </Box>

                {/* steps with icons + counts (pure info) */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{ mt: 1.5 }}
                >
                    {STATUS_STEPS.map((s) => (
                        <Stack key={s} alignItems="center" spacing={0.75} sx={{ minWidth: 0 }}>
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    background: stepColor[s],
                                    boxShadow: `0 6px 16px ${stepColor[s]}55`,
                                }}
                            >
                                {ICONS[s]}
                            </Box>
                            <Typography
                                variant="caption"
                                sx={{ fontWeight: 700, color: "#111827", whiteSpace: "nowrap" }}
                            >
                                {s}
                            </Typography>
                            <Chip
                                size="small"
                                label={`${counts[s] || 0}`}
                                sx={{
                                    height: 22,
                                    "& .MuiChip-label": { px: 1, fontWeight: 700, fontSize: 12 },
                                    backgroundColor: `${stepColor[s]}22`,
                                    color: stepColor[s],
                                }}
                            />
                        </Stack>
                    ))}
                </Stack>
            </Card>
        );
    };

    return (
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
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                🧾 All Complaint Orders
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                Complaint statuses: <b>Open</b>, <b>In Review</b>, <b>Resolved</b>, <b>Closed</b>. All linked order statuses are shown as{" "}
                <Chip label="Pending" size="small" color="warning" />.
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Card
                        sx={{
                            borderRadius: 5,
                            p: 3,
                            background: "linear-gradient(135deg,#ffffff,#f9fafb)",
                            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                        }}
                    >
                        {/* Header: title + filters (right) */}
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} gap={2}>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Badge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                                    <Avatar sx={{ bgcolor: BRAND.review, width: 40, height: 40 }}>
                                        <ReportProblemIcon />
                                    </Avatar>
                                </Badge>
                                <Typography variant="h6" fontWeight={700}>
                                    Complaints
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                <Select
                                    size="small"
                                    value={hostelFilter}
                                    onChange={(e) => setHostelFilter(e.target.value as string)}
                                    sx={{ minWidth: 160 }}
                                >
                                    {hostelOptions.map((h) => (
                                        <MenuItem key={h} value={h}>
                                            {h}
                                        </MenuItem>
                                    ))}
                                </Select>

                                {hostelFilter !== "All" && (
                                    <Button size="small" variant="outlined" color="inherit" onClick={clearFilters}>
                                        Reset
                                    </Button>
                                )}
                            </Stack>
                        </Box>

                        {/* Status counters (reflect base filters) */}
                        <Grid container spacing={2} mb={2}>
                            {/* 🔝 Static info progress (top-only) */}
                            <Grid item xs={12}>
                                <InfoPipeline counts={counts} />
                            </Grid>
                            {([
                                { label: "All", value: "All", color: "#64748b", count: counts.total },
                                { label: "Open", value: "Open", color: BRAND.open, count: counts["Open"] },
                                { label: "In Review", value: "In Review", color: BRAND.review, count: counts["In Review"] },
                                { label: "Resolved", value: "Resolved", color: BRAND.resolved, count: counts["Resolved"] },
                                { label: "Closed", value: "Closed", color: BRAND.closed, count: counts["Closed"] },
                            ] as const).map((f) => (
                                <Grid item xs={6} sm={12 / 5} key={f.value as string}>
                                    <Card
                                        onClick={() => setStatusFilter(f.value as any)}
                                        sx={{
                                            p: 2,
                                            borderRadius: 4,
                                            cursor: "pointer",
                                            border: `1px solid ${f.color}33`,
                                            background: `linear-gradient(145deg, ${f.color}12, #ffffff)`,
                                            transition: "0.25s",
                                            "&:hover": {
                                                transform: "translateY(-3px)",
                                                boxShadow: `0 8px 24px ${f.color}44`,
                                            },
                                            outline: statusFilter === f.value ? `2px solid ${f.color}` : "none",
                                        }}
                                    >
                                        <Typography variant="overline" sx={{ color: f.color, fontWeight: 700 }}>
                                            {f.label}
                                        </Typography>
                                        <Typography variant="h5" fontWeight={800}>
                                            <CountUp start={0} end={f.count} duration={0.6} />
                                        </Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* List (final filtered) */}
                        <Card
                            variant="outlined"
                            sx={{
                                borderRadius: 4,
                                p: 1,
                                borderColor: "#e5e7eb",
                                background: "linear-gradient(180deg,#ffffff,#fbfdff)",
                            }}
                        >
                            <List sx={{ width: "100%" }}>
                                {finalList.length === 0 && (
                                    <Box py={6} textAlign="center">
                                        <Typography variant="body1" color="text.secondary">
                                            No complaints match your filter.
                                        </Typography>
                                    </Box>
                                )}

                                {finalList.map((c) => (
                                    <ListItem
                                        key={c.id}
                                        alignItems="flex-start"
                                        sx={{
                                            px: 2,
                                            py: 1.5,
                                            borderRadius: 3,
                                            "&:hover": { backgroundColor: "#f8fafc" },
                                        }}
                                        secondaryAction={
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Chip size="small" variant="outlined" label={c.order_id} sx={{ fontWeight: 600 }} />
                                                <Chip size="small" variant="outlined" label={c.laundry_id} />
                                                <Chip size="small" variant="outlined" label={c.hostel} />
                                                <Chip
                                                    size="small"
                                                    label={c.status}
                                                    sx={{
                                                        backgroundColor: BRAND.chipBg()[c.status],
                                                        color: BRAND.color()[c.status],
                                                        fontWeight: 700,
                                                    }}
                                                />
                                                {/* Order status is ALWAYS Pending (read-only) */}
                                                <Chip size="small" color="warning" label="Order: Pending" />
                                            </Stack>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: BRAND.color()[c.status] }}>
                                                <ReportProblemIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="subtitle1" fontWeight={700}>
                                                        {c.title}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        • {c.ticket_no}
                                                    </Typography>
                                                </Stack>
                                            }
                                            secondary={
                                                <Stack spacing={0.5}>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: "vertical",
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        {c.description}
                                                    </Typography>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Chip size="small" variant="outlined" label={c.category} />
                                                        <Typography variant="caption" color="text.secondary">
                                                            Created: {new Date(c.created_at).toLocaleString()}
                                                            {" • "}
                                                            Updated: {new Date(c.updated_at).toLocaleString()}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
