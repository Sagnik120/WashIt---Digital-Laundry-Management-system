"use client";
import React, { useMemo, useState } from "react";
import {
    Box,
    Grid,
    Card,
    Typography,
    Avatar,
    Button,
    Stack,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Chip,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Badge,
} from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import CountUp from "react-countup";
import useSnackBar from "@/Redux/hooks/useSnackBar";

type ComplaintStatus = "Open" | "In Review" | "Resolved";

interface Complaint {
    id: string;
    ticket_no: string;
    title: string;
    description: string;
    category: "Maintenance" | "Hostel" | "Mess" | "Academics" | "Other";
    status: ComplaintStatus;
    created_at: string; // ISO
    updated_at: string; // ISO
    attachment?: string;
    order_id: string; // linked order (always present for staff view)
}

export default function StaffComplaints() {
    const { setSnackBar } = useSnackBar();

    // branding/colors
    const BRAND = {
        open: "#f59e0b",
        review: "#3b82f6",
        resolved: "#10b981",
        chipBg(alpha = "22") {
            return {
                Open: `${this.open}${alpha}`,
                "In Review": `${this.review}${alpha}`,
                Resolved: `${this.resolved}${alpha}`,
            } as Record<ComplaintStatus, string>;
        },
        color() {
            return {
                Open: this.open,
                "In Review": this.review,
                Resolved: this.resolved,
            } as Record<ComplaintStatus, string>;
        },
    };

    // sample complaints (wire to API later)
    const [complaints, setComplaints] = useState<Complaint[]>([
        {
            id: "c1",
            ticket_no: "CMP-25001",
            title: "Issue with order LDR-2025-0007",
            description: "Water leakage noticed near delivery area.",
            category: "Maintenance",
            status: "Open",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
            updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
            order_id: "LDR-2025-0007",
        },
        {
            id: "c2",
            ticket_no: "CMP-25002",
            title: "Damaged button on shirt",
            description: "One button missing after wash.",
            category: "Maintenance",
            status: "In Review",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
            updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            order_id: "LDR-2025-0012",
        },
        {
            id: "c3",
            ticket_no: "CMP-25003",
            title: "Late delivery for LDR-2025-0015",
            description: "Delivery exceeded expected time by 24 hours.",
            category: "Other",
            status: "Open",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
            updated_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
            order_id: "LDR-2025-0015",
        },
        {
            id: "c4",
            ticket_no: "CMP-25004",
            title: "Color faded (black jeans)",
            description: "Significant fading observed.",
            category: "Maintenance",
            status: "In Review",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
            updated_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
            order_id: "LDR-2025-0018",
        },
        {
            id: "c5",
            ticket_no: "CMP-25005",
            title: "Incorrect item count",
            description: "One towel missing in the returned items.",
            category: "Hostel",
            status: "Resolved",
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
            updated_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
            order_id: "LDR-2025-0020",
        },
    ]);

    // search & filter
    const [statusFilter, setStatusFilter] = useState<"All" | ComplaintStatus>("All");
    const [search, setSearch] = useState("");

    // view dialog state
    const [viewOpen, setViewOpen] = useState(false);
    const [viewCmp, setViewCmp] = useState<Complaint | null>(null);

    const openView = (c: Complaint) => {
        setViewCmp(c);
        setViewOpen(true);
    };
    const closeView = () => {
        setViewOpen(false);
        setViewCmp(null);
    };

    // transition guards: Open -> In Review -> Resolved (no direct Open->Resolved)
    const transition = (id: string, to: ComplaintStatus) => {
        setComplaints((prev) =>
            prev.map((c) => {
                if (c.id !== id) return c;
                const from = c.status;

                // allowed rules
                const allowed =
                    (from === "Open" && to === "In Review") ||
                    (from === "In Review" && to === "Resolved");

                if (!allowed) {
                    setSnackBar("warning", `Not allowed: ${from} → ${to}`);
                    return c;
                }

                const updated = { ...c, status: to, updated_at: new Date().toISOString() };
                // keep dialog in sync if open on same record
                setViewCmp((v) => (v && v.id === id ? updated : v));
                setSnackBar("success", `Updated: ${from} → ${to}`);
                return updated;
            })
        );
    };

    // derived: filtered complaints
    const filteredComplaints = useMemo(() => {
        const base =
            statusFilter === "All"
                ? complaints
                : complaints.filter((c) => c.status === statusFilter);

        if (!search.trim()) return base;
        const q = search.toLowerCase();
        return base.filter(
            (c) =>
                c.title.toLowerCase().includes(q) ||
                c.ticket_no.toLowerCase().includes(q) ||
                c.order_id.toLowerCase().includes(q) ||
                c.category.toLowerCase().includes(q) ||
                c.description.toLowerCase().includes(q)
        );
    }, [complaints, statusFilter, search]);

    // counts
    const complaintCounts = useMemo(() => {
        return complaints.reduce(
            (acc, c) => {
                acc.total += 1;
                acc[c.status] = (acc[c.status] || 0) + 1;
                return acc;
            },
            { total: 0, Open: 0, "In Review": 0, Resolved: 0 } as Record<
                "total" | ComplaintStatus,
                number
            >
        );
    }, [complaints]);

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
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                    🛠️ Complaint Management
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    These are complaints submitted by students for pending orders. Please review the complaint and then resolve it.
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
                            {/* Header */}
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                mb={2}
                                gap={2}
                            >
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                    >
                                        <Avatar sx={{ bgcolor: BRAND.review, width: 40, height: 40 }}>
                                            <ReportProblemIcon />
                                        </Avatar>
                                    </Badge>
                                    <Typography variant="h6" fontWeight={700}>
                                        Complaints
                                    </Typography>
                                </Stack>

                                <TextField
                                    size="small"
                                    placeholder="Search by title, ticket, order, category..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    sx={{ minWidth: { xs: 160, sm: 260 } }}
                                />
                            </Box>

                            {/* Status Counters */}
                            <Grid container spacing={2} mb={2}>
                                {([
                                    { label: "All", value: "All", color: "#64748b", count: complaintCounts.total },
                                    { label: "Open", value: "Open", color: BRAND.open, count: complaintCounts["Open"] },
                                    { label: "In Review", value: "In Review", color: BRAND.review, count: complaintCounts["In Review"] },
                                    { label: "Resolved", value: "Resolved", color: BRAND.resolved, count: complaintCounts["Resolved"] },
                                ] as const).map((f) => (
                                    <Grid item xs={6} sm={3} key={f.value as string}>
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
                                                <CountUp start={0} end={f.count} duration={1} />
                                            </Typography>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Complaints List */}
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
                                    {filteredComplaints.length === 0 && (
                                        <Box py={6} textAlign="center">
                                            <Typography variant="body1" color="text.secondary">
                                                No complaints match your filter.
                                            </Typography>
                                        </Box>
                                    )}

                                    {filteredComplaints.map((c) => (
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
                                                    {/* linked order id */}
                                                    <Chip
                                                        size="small"
                                                        variant="outlined"
                                                        label={c.order_id}
                                                        sx={{ fontWeight: 600 }}
                                                    />
                                                    {/* complaint status */}
                                                    <Chip
                                                        size="small"
                                                        label={c.status}
                                                        sx={{
                                                            backgroundColor: BRAND.chipBg()[c.status],
                                                            color: BRAND.color()[c.status],
                                                            fontWeight: 700,
                                                        }}
                                                    />
                                                    {/* linked order status - always Pending */}
                                                    <Chip size="small" color="warning" label="Order: Pending" />

                                                    {/* actions based on status */}
                                                    {c.status === "Open" && (
                                                        <Tooltip title="Move to In Review">
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                startIcon={<PlayCircleFilledWhiteIcon />}
                                                                onClick={() => transition(c.id, "In Review")}
                                                            >
                                                                Start Review
                                                            </Button>
                                                        </Tooltip>
                                                    )}
                                                    {c.status === "In Review" && (
                                                        <Tooltip title="Mark as Resolved (after review)">
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                startIcon={<AssignmentTurnedInIcon />}
                                                                onClick={() => transition(c.id, "Resolved")}
                                                            >
                                                                Resolve
                                                            </Button>
                                                        </Tooltip>
                                                    )}

                                                    <Tooltip title="View details">
                                                        <IconButton onClick={() => openView(c)}>
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                    </Tooltip>
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

            {/* View Complaint Dialog */}
            <Dialog open={viewOpen} onClose={closeView} fullWidth maxWidth="sm">
                <DialogTitle>Complaint Details</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        {/* Top meta: title + ticket */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" fontWeight={700}>
                                {viewCmp?.title}
                            </Typography>
                            <Chip size="small" label={viewCmp?.ticket_no} variant="outlined" sx={{ fontWeight: 600 }} />
                        </Stack>

                        {/* Status + Order */}
                        <Stack direction="row" spacing={1} alignItems="center">
                            {viewCmp?.status && (
                                <Chip
                                    size="small"
                                    label={viewCmp.status}
                                    sx={{
                                        backgroundColor: viewCmp ? BRAND.chipBg()[viewCmp.status] : undefined,
                                        color: viewCmp ? BRAND.color()[viewCmp.status] : undefined,
                                        fontWeight: 700,
                                    }}
                                />
                            )}
                            {/* order id + order status (always pending) */}
                            {viewCmp?.order_id && (
                                <>
                                    <Chip size="small" variant="outlined" label={viewCmp.order_id} sx={{ fontWeight: 600 }} />
                                    <Chip size="small" color="warning" label="Order: Pending" />
                                </>
                            )}
                            <Box sx={{ flex: 1 }} />
                            {viewCmp?.created_at && (
                                <Typography variant="caption" color="text.secondary">
                                    Created: {new Date(viewCmp.created_at).toLocaleString()}
                                    {viewCmp?.updated_at && ` • Updated: ${new Date(viewCmp.updated_at).toLocaleString()}`}
                                </Typography>
                            )}
                        </Stack>

                        {/* Description */}
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: "#f8fafc",
                                border: "1px solid #e5e7eb",
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            <Typography variant="subtitle2" gutterBottom>
                                Description
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {viewCmp?.description || "—"}
                            </Typography>
                        </Box>

                        {/* Attachment (if any) */}
                        {viewCmp?.attachment && (
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Attachment
                                </Typography>
                                <Box
                                    sx={{
                                        p: 1,
                                        borderRadius: 2,
                                        border: "1px solid #e5e7eb",
                                        display: "inline-block",
                                        bgcolor: "#fff",
                                    }}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={viewCmp.attachment}
                                        alt="Complaint attachment"
                                        style={{ maxWidth: "100%", borderRadius: 8, display: "block" }}
                                    />
                                </Box>
                            </Box>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    {/* Actions in dialog must follow the same rule */}
                    {viewCmp?.status === "Open" && (
                        <Button
                            variant="outlined"
                            startIcon={<PlayCircleFilledWhiteIcon />}
                            onClick={() => viewCmp && transition(viewCmp.id, "In Review")}
                        >
                            Start Review
                        </Button>
                    )}
                    {viewCmp?.status === "In Review" && (
                        <Button
                            variant="contained"
                            startIcon={<AssignmentTurnedInIcon />}
                            onClick={() => viewCmp && transition(viewCmp.id, "Resolved")}
                        >
                            Mark Resolved
                        </Button>
                    )}
                    <Button onClick={closeView}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
