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
    Chip,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Badge,
    CircularProgress,
} from "@mui/material";
import {
    PhotoCamera,
} from "@mui/icons-material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CountUp from "react-countup";
import React, { useMemo, useState, useEffect } from "react";
import usePageLoader from "@/Redux/hooks/usePageLoader";
import useSnackBar from "@/Redux/hooks/useSnackBar";
import { useDispatch } from "react-redux";
import { complaintsList, OrdersList } from "@/Redux/Actions/AuthUser";
import ErrorHandler from "@/lib/errorHandler";
import { BaseUrl } from "@/ApiSetUp/AuthApi";

type ComplaintStatus = "Open" | "In Review" | "Resolved" | "Closed";

interface Complaint {
    id: string;
    ticket_no: string;
    title: string;
    description: string;
    category: "Maintenance" | "Hostel" | "Mess" | "Academics" | "Other";
    status: ComplaintStatus;
    created_at: string; 
    updated_at: string; 
    attachment?: string;
    order_id?: string; 
    order_internal_id?: string; 
}

interface PendingOrder {
    id: string; 
    order_id: string; 
    submission_date: string;
    items_count: number;
    isComplaintRaised: boolean;
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

    const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
    const [loadingPending, setLoadingPending] = useState(false);

    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loadingComplaints, setLoadingComplaints] = useState(false);

    const [inFlight, setInFlight] = useState<Record<string, boolean>>({});

    const [statusFilter, setStatusFilter] = useState<"All" | ComplaintStatus>("All");
    const [search, setSearch] = useState("");

    const [openRaise, setOpenRaise] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null); 
    const [selectedOrderDisplayId, setSelectedOrderDisplayId] = useState<string | null>(null); 
    const [description, setDescription] = useState("");
    const [attachmentPreview, setAttachmentPreview] = useState<string | undefined>(undefined);

    const [submittingComplaint, setSubmittingComplaint] = useState(false);

    const [viewOpen, setViewOpen] = useState(false);
    const [viewCmp, setViewCmp] = useState<Complaint | null>(null);

    // helpers for auth header
    function getAuthToken() {
        return localStorage.getItem("token") || localStorage.getItem("authToken") || "";
    }
    function authHeaders() {
        const token = getAuthToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        return headers;
    }

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

    const loadComplaints = async () => {
        setLoadingComplaints(true);
        setFullPageLoader(true);
        try {
            const payload: any = { page: 1, pageSize: 100 };
            const res: any = await dispatch(complaintsList(payload) as any);
            const ok = ErrorHandler(res, setSnackBar);
            if (!ok) {
                setComplaints([]);
                return;
            }

            const body = res?.payload ?? res?.data ?? res;
            const arr = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : body?.complaints ?? [];

            const mapped: Complaint[] = (arr || []).map((c: any) => {
                const orderObj = c.order ?? c.orderDetails ?? null;
                const displayOrderCode = orderObj?.orderCode ?? c.orderCode ?? null;
                const internalOrderId = c.orderId ?? orderObj?.id ?? null;
                // normalize status
                const statusRaw = (c.complaintStatus ?? c.status ?? "OPEN").toString().toUpperCase();
                let status: ComplaintStatus = "Open";
                if (statusRaw === "IN_REVIEW") status = "In Review";
                else if (statusRaw === "RESOLVED") status = "Resolved";
                else if (statusRaw === "CLOSED") status = "Closed";

                const img = Array.isArray(c.images) && c.images.length > 0 ? c.images[0]?.imageUrl ?? undefined : undefined;

                return {
                    id: c.id,
                    ticket_no: c.ticket_no ?? c.ticketNo ?? `CMP-${String((c.id ?? "").slice(0, 8)).toUpperCase()}`,
                    title: c.title ?? `Issue with order ${displayOrderCode ?? internalOrderId ?? c.orderId}`,
                    description: c.description ?? c.desc ?? "",
                    category: c.category ?? "Maintenance",
                    status,
                    created_at: c.createdAt ?? c.created_at ?? new Date().toISOString(),
                    updated_at: c.updatedAt ?? c.updated_at ?? new Date().toISOString(),
                    attachment: img,
                    order_id: displayOrderCode ?? undefined,
                    order_internal_id: internalOrderId ?? undefined,
                };
            });

            setComplaints(mapped);
        } catch (err: any) {
            console.error("loadComplaints error:", err);
            setComplaints([]);
            setSnackBar("error", err?.message ?? "Failed to load complaints");
        } finally {
            setLoadingComplaints(false);
            setFullPageLoader(false);
        }
    };

    const loadPendingOrders = async () => {
        setLoadingPending(true);
        setFullPageLoader(true);
        try {
            const payload: any = { status: "PENDING", page: 1, pageSize: 50 };
            const res: any = await dispatch(OrdersList(payload) as any);
            const ok = ErrorHandler(res, setSnackBar);
            if (!ok) {
                setPendingOrders([]);
                return;
            }

            const body = res?.payload ?? res?.data ?? res;
            const arr = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : body?.orders ?? [];

            const mapped: PendingOrder[] = (arr || []).map((o: any) => {
                const displayCode = o.orderCode ?? o.order_code ?? o.order_id ?? o.id;
                const internalId = o.id ?? o.orderId ?? o.order_id;
                const itemsCount = Array.isArray(o.items) ? o.items.reduce((acc: number, it: any) => acc + (Number(it.quantity) || 0), 0) : 0;
                const isRaised = complaints.some((c) => {
                    return c.order_internal_id === internalId || c.order_id === displayCode || c.order_internal_id === o.id;
                }) || (o?.complaints && o.complaints.length > 0);

                return {
                    id: internalId,
                    order_id: displayCode,
                    submission_date: o.orderDate ?? o.createdAt ?? new Date().toISOString(),
                    items_count: itemsCount,
                    isComplaintRaised: Boolean(isRaised),
                };
            });

            setPendingOrders(mapped);
        } catch (err: any) {
            console.error("loadPendingOrders error:", err);
            setPendingOrders([]);
            setSnackBar("error", err?.message ?? "Failed to load pending orders");
        } finally {
            setLoadingPending(false);
            setFullPageLoader(false);
        }
    };

    useEffect(() => {
        (async () => {
            await loadComplaints();
            await loadPendingOrders();
        })();
    }, []);

    useEffect(() => {
        if (pendingOrders.length === 0 || complaints.length === 0) return;
        setPendingOrders((prev) =>
            prev.map((o) => {
                const raised = complaints.some((c) => c.order_internal_id === o.id || c.order_id === o.order_id);
                return { ...o, isComplaintRaised: raised };
            })
        );
    }, [complaints]); 

    const hasComplaintForOrder = (internalOrderId: string, displayOrderId?: string) => {
        return complaints.some((c) => c.order_internal_id === internalOrderId || (displayOrderId && c.order_id === displayOrderId));
    };

    const createComplaint = async () => {
        if (!selectedOrderId) {
            setSnackBar("warning", "Please select an order from Pending Orders.");
            return;
        }
        if (!description.trim()) {
            setSnackBar("warning", "Please add a brief description.");
            return;
        }

        setSubmittingComplaint(true);
        setFullPageLoader(true);

        try {
            const createUrl = `${BaseUrl}/api/complaints/${encodeURIComponent(selectedOrderId)}`;
            const createRes = await fetch(createUrl, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({ description: description.trim() }),
            });

            let createJson: any = null;
            try { createJson = await createRes.json(); } catch { createJson = null; }

            if (!createRes.ok) {
                const msg = createJson?.message ?? `Failed to raise complaint (${createRes.status})`;
                setSnackBar("error", msg);
                return;
            }

            await loadComplaints();

            const createdComplaint = createJson?.data ?? createJson?.complaint ?? createJson ?? null;
            const complaintId = createdComplaint?.id ?? createdComplaint?.complaintId ?? createdComplaint?.complaint_id ?? null;

            if (attachmentPreview && (complaintId || createdComplaint?.id)) {
                const targetId = complaintId ?? createdComplaint?.id;
                const imagesUrl = `${BaseUrl}/api/complaints/${encodeURIComponent(targetId)}/images`;
                try {
                    const imgRes = await fetch(imagesUrl, {
                        method: "POST",
                        headers: authHeaders(),
                        body: JSON.stringify({ images: [attachmentPreview] }),
                    });
                    let imgJson: any = null;
                    try { imgJson = await imgRes.json(); } catch { imgJson = null; }

                    if (!imgRes.ok) {
                        const msg = imgJson?.message ?? `Image upload failed (${imgRes.status})`;
                        setSnackBar("warning", msg);
                    } else {
                        await loadComplaints();
                    }
                } catch (imgErr: any) {
                    console.error("Image upload error:", imgErr);
                    setSnackBar("warning", "Complaint created but image upload failed.");
                }
            }

            await loadPendingOrders();

            setOpenRaise(false);
            setSelectedOrderId(null);
            setSelectedOrderDisplayId(null);
            setDescription("");
            setAttachmentPreview(undefined);
            setSnackBar("success", (createJson?.message ?? "Complaint raised successfully."));
        } catch (err: any) {
            console.error("createComplaint error:", err);
            setSnackBar("error", err?.message ?? "Failed to raise complaint.");
        } finally {
            setSubmittingComplaint(false);
            setFullPageLoader(false);
        }
    };

    const closeComplaintOnServer = async (complaintId: string) => {
        setInFlight((p) => ({ ...p, [complaintId]: true }));
        setFullPageLoader(true);
        try {
            const url = `${BaseUrl}/api/complaints/${encodeURIComponent(complaintId)}/close`;
            const res = await fetch(url, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({}), 
            });
            let json: any = null;
            try { json = await res.json(); } catch { json = null; }

            if (!res.ok) {
                const msg = json?.message ?? `Failed to close complaint (${res.status})`;
                setSnackBar("error", msg);
                return { ok: false, json };
            }

            setSnackBar("success", json?.message ?? "Complaint closed.");
            return { ok: true, json };
        } catch (err: any) {
            console.error("closeComplaintOnServer error:", err);
            setSnackBar("error", err?.message ?? "Network error while closing complaint.");
            return { ok: false, err };
        } finally {
            setInFlight((p) => {
                const next = { ...p };
                delete next[complaintId];
                return next;
            });
            setFullPageLoader(false);
        }
    };

    const markAsClosed = async (id: string) => {
        const target = complaints.find((c) => c.id === id);
        if (!target) {
            setSnackBar("error", "Complaint not found.");
            return;
        }
        if (target.status !== "Resolved") {
            setSnackBar("warning", "Only complaints in Resolved status can be closed.");
            return;
        }

        const res = await closeComplaintOnServer(id);
        if (!res.ok) return;

        const returned = res.json?.data ?? res.json?.complaint ?? res.json ?? null;
        if (returned && (returned.id || returned.complaintId)) {
            await loadComplaints();
        } else {
            const nowIso = new Date().toISOString();
            setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status: "Closed", updated_at: nowIso } : c)));
            setViewCmp((v) => (v && v.id === id ? { ...v, status: "Closed", updated_at: nowIso } : v));
        }
    };

    const filteredComplaints = useMemo(() => {
        const base = statusFilter === "All" ? complaints : complaints.filter((c) => c.status === statusFilter);
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
            { total: 0, Open: 0, "In Review": 0, Resolved: 0, Closed: 0 } as Record<"total" | ComplaintStatus, number>
        );
    }, [complaints]);

    const raiseComplaintForOrder = (internalId: string) => {
        const po = pendingOrders.find((p) => p.id === internalId) ?? pendingOrders.find((p) => p.order_id === internalId);
        setSelectedOrderId(internalId);
        setSelectedOrderDisplayId(po?.order_id ?? null);
        setDescription("");
        setAttachmentPreview(undefined);
        setOpenRaise(true);
    };

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

                            {/* 🔸 Pending Orders (from API) */}
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

                                {loadingPending ? (
                                    <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
                                        <CircularProgress />
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Loading pending orders…</Typography>
                                    </Box>
                                ) : pendingOrders.length === 0 ? (
                                    <Box py={4} textAlign="center">
                                        <Typography variant="body2" color="text.secondary">No pending orders found.</Typography>
                                    </Box>
                                ) : (
                                    <Grid container spacing={2}>
                                        {pendingOrders.map((o) => {
                                            const disabled = o?.isComplaintRaised;
                                            return (
                                                <Grid item xs={12} md={6} key={o.id}>
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
                                                            onClick={() => raiseComplaintForOrder(o.id)}
                                                            sx={{
                                                                borderRadius: 2,
                                                                background: disabled ? "#9ca3af" : "linear-gradient(135deg,#2563eb,#1d4ed8)",
                                                                "&:hover": {
                                                                    background: disabled ? "#9ca3af" : "linear-gradient(135deg,#1e40af,#1e3a8a)",
                                                                },
                                                            }}
                                                            disabled={disabled}
                                                        >
                                                            {disabled ? "Complaint Raised" : "Raise Complaint"}
                                                        </Button>
                                                    </Card>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                )}
                            </Card>

                            {/* Status Counters */}
                            <Grid container spacing={2} mb={2}>
                                {(
                                    [
                                        { label: "All", value: "All", color: "#64748b", count: complaintCounts.total },
                                        { label: "Open", value: "Open", color: BRAND.open, count: complaintCounts["Open"] },
                                        { label: "In Review", value: "In Review", color: BRAND.review, count: complaintCounts["In Review"] },
                                        { label: "Resolved", value: "Resolved", color: BRAND.resolved, count: complaintCounts["Resolved"] },
                                        { label: "Closed", value: "Closed", color: BRAND.closed, count: complaintCounts["Closed"] },
                                    ] as const
                                ).map((f) => (
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
                                                    {c.order_id && <Chip size="small" variant="outlined" label={c.order_id} sx={{ fontWeight: 600 }} />}
                                                    <Chip
                                                        size="small"
                                                        label={c.status}
                                                        sx={{
                                                            backgroundColor: BRAND.chipBg()[c.status],
                                                            color: BRAND.color()[c.status],
                                                            fontWeight: 700,
                                                        }}
                                                    />
                                                    {c.status === "Resolved" && (
                                                        <Tooltip title="Change status to Closed">
                                                            <span>
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    onClick={() => markAsClosed(c.id)}
                                                                    disabled={Boolean(inFlight[c.id])}
                                                                    startIcon={inFlight[c.id] ? undefined : undefined}
                                                                >
                                                                    {inFlight[c.id] ? <CircularProgress size={16} /> : "Mark as Closed"}
                                                                </Button>
                                                            </span>
                                                        </Tooltip>
                                                    )}
                                                    <Tooltip title="View details">
                                                        <IconButton onClick={() => openView(c)} disabled={Boolean(inFlight[c.id])}>
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
                            <Chip color="primary" variant="outlined" label={selectedOrderDisplayId ?? selectedOrderId} />
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
                    <Button onClick={() => setOpenRaise(false)} disabled={submittingComplaint}>Cancel</Button>
                    <Button variant="contained" onClick={createComplaint} disabled={submittingComplaint}>
                        {submittingComplaint ? <CircularProgress size={18} /> : "Submit"}
                    </Button>
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
                            {viewCmp?.order_id && (
                                <Chip size="small" variant="outlined" label={viewCmp.order_id} sx={{ fontWeight: 600 }} />
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
                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#f8fafc", border: "1px solid #e5e7eb", whiteSpace: "pre-wrap" }}>
                            <Typography variant="subtitle2" gutterBottom>Description</Typography>
                            <Typography variant="body2" color="text.secondary">{viewCmp?.description || "—"}</Typography>
                        </Box>

                        {/* Attachment (if any) */}
                        {viewCmp?.attachment && (
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>Attachment</Typography>
                                <Box sx={{ p: 1, borderRadius: 2, border: "1px solid #e5e7eb", display: "inline-block", bgcolor: "#fff" }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={viewCmp.attachment} alt="Complaint attachment" style={{ maxWidth: "100%", borderRadius: 8, display: "block" }} />
                                </Box>
                            </Box>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    {viewCmp?.status === "Resolved" && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => viewCmp && markAsClosed(viewCmp.id)}
                            disabled={Boolean(inFlight[viewCmp?.id ?? ""])}
                        >
                            {inFlight[viewCmp?.id ?? ""] ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Mark as Closed"}
                        </Button>
                    )}
                    <Button onClick={closeView}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
