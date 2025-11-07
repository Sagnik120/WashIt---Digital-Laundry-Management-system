"use client";
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
    CardContent,
    Chip,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Badge,
} from "@mui/material";
import {
    LocalLaundryService,
    CheckCircle,
    HourglassBottom,
    AddCircle,
    PhotoCamera,
} from "@mui/icons-material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CountUp from "react-countup";
import React, { useMemo, useState } from "react";
import usePageLoader from "@/Redux/hooks/usePageLoader";
import useSnackBar from "@/Redux/hooks/useSnackBar";
import { useDispatch } from "react-redux";

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
    attachment?: string;
    order_id?: string; // linked order (required in your flow)
}

interface PendingOrder {
    order_id: string;
    submission_date: string;
    items_count: number;
}

export default function StudentDashboard() {
    const dispatch = useDispatch();
    const setFullPageLoader = usePageLoader();
    const { setSnackBar } = useSnackBar();

    // branding colors
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

    // 🔹 Pending orders from History (mock; plug in your API later)
    const [pendingOrders] = useState<PendingOrder[]>([
        {
            order_id: "LDR-2025-0007",
            submission_date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
            items_count: 3,
        },
        {
            order_id: "LDR-2025-0012",
            submission_date: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
            items_count: 5,
        },
    ]);

    // existing complaints (mock)
    const [complaints, setComplaints] = useState<Complaint[]>([
        {
            id: "c1",
            ticket_no: "CMP-24001",
            title: "Issue with order LDR-2025-0007",
            description: "Water leakage in bathroom after laundry delivery.",
            category: "Maintenance",
            status: "Open",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            order_id: "LDR-2025-0007",
        },
        {
            id: "c2",
            ticket_no: "CMP-24002",
            title: "WiFi not working on 2nd floor",
            description: "Frequent disconnects since last night.",
            category: "Hostel",
            status: "In Review",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: "c3",
            ticket_no: "CMP-24003",
            title: "Quality of lunch (mess)",
            description: "Undercooked rice observed for the past 2 days.",
            category: "Mess",
            status: "Resolved",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: "c4",
            ticket_no: "CMP-24004",
            title: "Issue with order LDR-2025-0012",
            description: "Some clothes came back damp.",
            category: "Maintenance",
            status: "Closed",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            order_id: "LDR-2025-0012",
        },
    ]);

    // filters & search
    const [statusFilter, setStatusFilter] = useState<"All" | ComplaintStatus>("All");
    const [search, setSearch] = useState("");

    // raise-complaint dialog state — order is REQUIRED and LOCKED
    const [openRaise, setOpenRaise] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [description, setDescription] = useState("");
    const [attachmentPreview, setAttachmentPreview] = useState<string | undefined>(undefined);

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

    const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                setAttachmentPreview(reader.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // open dialog prefilled with selected order; order cannot be changed
    const raiseComplaintForOrder = (order_id: string) => {
        setSelectedOrderId(order_id);
        setDescription("");
        setAttachmentPreview(undefined);
        setOpenRaise(true);
    };

    // create complaint (status always "Open", order locked, title auto-generated)
    const createComplaint = () => {
        if (!selectedOrderId) {
            setSnackBar("warning", "Please select an order from Pending Orders.");
            return;
        }
        if (!description.trim()) {
            setSnackBar("warning", "Please add a brief description.");
            return;
        }

        const id = (globalThis as any)?.crypto?.randomUUID?.() ?? `cmp_${Date.now()}`;
        const now = new Date().toISOString();
        const ticket_no = `CMP-${String(complaints.length + 1).padStart(5, "0")}`;

        const newC: Complaint = {
            id,
            ticket_no,
            title: `Issue with order ${selectedOrderId}`, // auto
            description: description.trim(),
            category: "Maintenance", // default; backend can ignore or infer
            status: "Open", // ALWAYS Open
            created_at: now,
            updated_at: now,
            attachment: attachmentPreview,
            order_id: selectedOrderId,
        };
        setComplaints((prev) => [newC, ...prev]);
        setOpenRaise(false);
        setSnackBar("success", "Complaint raised successfully.");
    };

    // ✅ allow only Resolved -> Closed transition
    const markAsClosed = (id: string) => {
        let changed = false;
        const nowIso = new Date().toISOString();

        setComplaints((prev) =>
            prev.map((c) => {
                if (c.id === id && c.status === "Resolved") {
                    changed = true;
                    return { ...c, status: "Closed", updated_at: nowIso };
                }
                return c;
            })
        );

        // keep dialog in sync if it's showing the same complaint
        setViewCmp((v) => {
            if (v && v.id === id && v.status === "Resolved") {
                return { ...v, status: "Closed", updated_at: nowIso };
            }
            return v;
        });

        if (changed) {
            setSnackBar("success", "Complaint marked as Closed.");
        } else {
            setSnackBar("warning", "Only complaints in Resolved status can be closed.");
        }
    };

    // derived: filtered complaints
    const filteredComplaints = useMemo(() => {
        const base =
            statusFilter === "All" ? complaints : complaints.filter((c) => c.status === statusFilter);
        if (!search.trim()) return base;
        const q = search.toLowerCase();
        return base.filter(
            (c) =>
                c.title.toLowerCase().includes(q) ||
                c.ticket_no.toLowerCase().includes(q) ||
                (c.order_id || "").toLowerCase().includes(q) ||
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
            { total: 0, Open: 0, "In Review": 0, Resolved: 0, Closed: 0 } as Record<
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
                    📝 Submit a Complaint
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    First select an order from <b>Pending Orders</b>, then describe the issue and attach an optional photo for confirmation.
                    New complaints are created as <b>Open</b>.
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
                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} gap={2}>
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <Badge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                                        <Avatar sx={{ bgcolor: BRAND.review, width: 40, height: 40 }}>
                                            <ReportProblemIcon />
                                        </Avatar>
                                    </Badge>
                                    <Typography variant="h6" fontWeight={700}>Complaints</Typography>
                                </Stack>

                                <TextField
                                    size="small"
                                    placeholder="Search by title, ticket, order, category..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    sx={{ minWidth: { xs: 160, sm: 260 } }}
                                />
                            </Box>

                            {/* 🔸 Pending Orders (must choose here) */}
                            {pendingOrders.length > 0 && (
                                <Card
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 4,
                                        p: 2,
                                        mb: 2.5,
                                        borderColor: "#e5e7eb",
                                        background: "linear-gradient(180deg,#ffffff,#fbfdff)",
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight={700} mb={1}>
                                        Pending Orders
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {pendingOrders.map((o) => (
                                            <Grid item xs={12} md={6} key={o.order_id}>
                                                <Card
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 3,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        border: "1px solid #e5e7eb",
                                                    }}
                                                >
                                                    <Stack spacing={0.5}>
                                                        <Typography variant="body1" fontWeight={700}>
                                                            {o.order_id}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Date: {new Date(o.submission_date).toLocaleString()} • Items: {o.items_count}
                                                        </Typography>
                                                    </Stack>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        onClick={() => raiseComplaintForOrder(o.order_id)}
                                                        sx={{
                                                            borderRadius: 2,
                                                            background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                                                        }}
                                                    >
                                                        Raise Complaint
                                                    </Button>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Card>
                            )}

                            {/* Status Counters */}
                            <Grid container spacing={2} mb={2}>
                                {([
                                    { label: "All", value: "All", color: "#64748b", count: complaintCounts.total },
                                    { label: "Open", value: "Open", color: BRAND.open, count: complaintCounts["Open"] },
                                    { label: "In Review", value: "In Review", color: BRAND.review, count: complaintCounts["In Review"] },
                                    { label: "Resolved", value: "Resolved", color: BRAND.resolved, count: complaintCounts["Resolved"] },
                                    { label: "Closed", value: "Closed", color: BRAND.closed, count: complaintCounts["Closed"] },
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
                                                    {c.order_id && (
                                                        <Chip size="small" variant="outlined" label={c.order_id} sx={{ fontWeight: 600 }} />
                                                    )}
                                                    <Chip
                                                        size="small"
                                                        label={c.status}
                                                        sx={{
                                                            backgroundColor: BRAND.chipBg()[c.status],
                                                            color: BRAND.color()[c.status],
                                                            fontWeight: 700,
                                                        }}
                                                    />
                                                    {/* 👇 Only show when the complaint is Resolved */}
                                                    {c.status === "Resolved" && (
                                                        <Tooltip title="Change status to Closed">
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                onClick={() => markAsClosed(c.id)}
                                                            >
                                                                Mark as Closed
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
                                                            sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
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

            {/* Raise Complaint Dialog (Order locked, only Description + Photo) */}
            <Dialog open={openRaise} onClose={() => setOpenRaise(false)} fullWidth maxWidth="sm">
                <DialogTitle>Raise a Complaint</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        {/* Order is preselected & locked */}
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2" color="text.secondary">Order</Typography>
                            <Chip color="primary" variant="outlined" label={selectedOrderId} />
                            <Chip size="small" label="Open" sx={{ ml: "auto", background: BRAND.chipBg().Open, color: BRAND.color().Open, fontWeight: 700 }} />
                        </Stack>

                        {/* Description only */}
                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label="Describe the issue"
                            placeholder="Describe the problem you faced with this order..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        {/* Attach photo */}
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Button variant="outlined" component="label" startIcon={<PhotoCamera />}>
                                Attach Photo
                                <input hidden accept="image/*" type="file" onChange={handleAttachment} />
                            </Button>
                            {attachmentPreview && (
                                <Avatar
                                    variant="rounded"
                                    src={attachmentPreview}
                                    sx={{ width: 64, height: 64, border: "1px solid #e5e7eb" }}
                                />
                            )}
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRaise(false)}>Cancel</Button>
                    <Button variant="contained" onClick={createComplaint}>Submit</Button>
                </DialogActions>
            </Dialog>

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
                            <Chip
                                size="small"
                                label={viewCmp?.ticket_no}
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                            />
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
                            {viewCmp?.order_id && (
                                <Chip size="small" variant="outlined" label={viewCmp.order_id} sx={{ fontWeight: 600 }} />
                            )}
                            <Box sx={{ flex: 1 }} />
                            {viewCmp?.created_at && (
                                <Typography variant="caption" color="text.secondary">
                                    Created: {new Date(viewCmp.created_at).toLocaleString()}
                                    {viewCmp?.updated_at &&
                                        ` • Updated: ${new Date(viewCmp.updated_at).toLocaleString()}`}
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
                    {/* 👇 Only show when current complaint is Resolved */}
                    {viewCmp?.status === "Resolved" && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => viewCmp && markAsClosed(viewCmp.id)}
                        >
                            Mark as Closed
                        </Button>
                    )}
                    <Button onClick={closeView}>Close</Button>
                </DialogActions>
            </Dialog>

        </>
    );
}
