"use client";
import React, { useMemo, useState, useEffect } from "react";
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
    DialogActions,
    TextField,
    Chip,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Badge,
    CircularProgress,
} from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import CountUp from "react-countup";
import { useDispatch } from "react-redux";
import useSnackBar from "@/Redux/hooks/useSnackBar";
import ErrorHandler from "@/lib/errorHandler";
import { complaintsList } from "@/Redux/Actions/AuthUser";
import { BaseUrl } from "@/ApiSetUp/AuthApi";

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
    order_id: string;
}

export default function StaffComplaints() {
    const dispatch = useDispatch();
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

    // complaints state (loaded from ComplaintsList action)
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loadingComplaints, setLoadingComplaints] = useState(false);

    // per-complaint in-flight map to disable buttons / show spinner
    const [inFlight, setInFlight] = useState<Record<string, boolean>>({});

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

    // auth helpers (used by advance API)
    function getAuthToken() {
        return localStorage.getItem("token") || localStorage.getItem("authToken") || "";
    }
    function authHeaders() {
        const token = getAuthToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        return headers;
    }

    // -------------------------
    // helper to call advance API
    // POST /api/complaints/{complaintId}/advance
    // -------------------------
    const advanceComplaint = async (complaintId: string) => {
        if (!complaintId) return { ok: false, message: "Missing complaint id" };

        setInFlight((p) => ({ ...p, [complaintId]: true }));

        try {
            const url = `${BaseUrl}/api/complaints/${encodeURIComponent(complaintId)}/advance`;
            const res = await fetch(url, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({}), // API spec: no body required
            });

            let json: any = null;
            try {
                json = await res.json();
            } catch {
                json = null;
            }

            if (!res.ok) {
                const msg = json?.message ?? `Failed (${res.status})`;
                return { ok: false, message: msg, payload: json };
            }

            return { ok: true, message: json?.message ?? "Advanced successfully", payload: json };
        } catch (err: any) {
            return { ok: false, message: err?.message ?? "Network error" };
        } finally {
            setInFlight((p) => {
                const nxt = { ...p };
                delete nxt[complaintId];
                return nxt;
            });
        }
    };

    // transition: call advance API and update local state only on success
    const transition = async (id: string, to: ComplaintStatus) => {
        // find complaint
        const c0 = complaints.find((x) => x.id === id);
        if (!c0) {
            setSnackBar("error", "Complaint not found");
            return;
        }
        const from = c0.status;

        // allowed rules
        const allowed = (from === "Open" && to === "In Review") || (from === "In Review" && to === "Resolved");
        if (!allowed) {
            setSnackBar("warning", `Not allowed: ${from} → ${to}`);
            return;
        }

        // call API
        const res = await advanceComplaint(id);
        if (!res.ok) {
            setSnackBar("error", res.message ?? "Failed to advance complaint");
            return;
        }

        // update local state using server response if it returns the updated complaint, otherwise apply optimistic update
        // try to extract updated complaint from res.payload (supports { data: { ... } } etc.)
        const updatedFromServer = res.payload?.data ?? res.payload?.complaint ?? res.payload ?? null;

        setComplaints((prev) =>
            prev.map((c) => {
                if (c.id !== id) return c;

                if (updatedFromServer && (updatedFromServer.id === id || updatedFromServer.complaintId === id)) {
                    // map server response shape -> Complaint
                    const statusRaw = (updatedFromServer.complaintStatus ?? updatedFromServer.status ?? "").toString().toUpperCase();
                    const statusMapped: ComplaintStatus =
                        statusRaw === "OPEN" ? "Open" : statusRaw === "IN_REVIEW" ? "In Review" : "Resolved";

                    const orderCode = updatedFromServer.order?.orderCode ?? updatedFromServer.orderCode ?? updatedFromServer.orderId ?? c.order_id;

                    const firstImage =
                        Array.isArray(updatedFromServer.images) && updatedFromServer.images.length > 0
                            ? updatedFromServer.images[0].imageUrl ?? updatedFromServer.images[0]
                            : updatedFromServer.attachment ?? c.attachment;

                    const mapped: Complaint = {
                        id: updatedFromServer.id ?? id,
                        ticket_no: updatedFromServer.ticket_no ?? updatedFromServer.ticketNo ?? c.ticket_no,
                        title: updatedFromServer.title ?? c.title,
                        description: updatedFromServer.description ?? updatedFromServer.msg ?? c.description,
                        category: updatedFromServer.category ?? c.category,
                        status: (statusMapped as ComplaintStatus) ?? to,
                        created_at: updatedFromServer.createdAt ?? updatedFromServer.created_at ?? c.created_at,
                        updated_at: updatedFromServer.updatedAt ?? updatedFromServer.updated_at ?? new Date().toISOString(),
                        attachment: firstImage,
                        order_id: orderCode,
                    };
                    // keep dialog in sync
                    setViewCmp((v) => (v && v.id === id ? mapped : v));
                    setSnackBar("success", res.message ?? `Updated: ${from} → ${to}`);
                    return mapped;
                }

                // fallback: optimistic local update
                const updated = { ...c, status: to, updated_at: new Date().toISOString() };
                setViewCmp((v) => (v && v.id === id ? updated : v));
                setSnackBar("success", res.message ?? `Updated: ${from} → ${to}`);
                return updated;
            })
        );
    };

    // derived: filtered complaints
    const filteredComplaints = useMemo(() => {
        const base = statusFilter === "All" ? complaints : complaints.filter((c) => c.status === statusFilter);

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
            { total: 0, Open: 0, "In Review": 0, Resolved: 0 } as Record<"total" | ComplaintStatus, number>
        );
    }, [complaints]);

    // -----------------------
    // Load complaints via action
    // -----------------------
    const loadComplaints = async () => {
        setLoadingComplaints(true);
        try {
            const res: any = await (dispatch as any)(complaintsList() as any);

            const ok = ErrorHandler(res, setSnackBar);
            if (!ok) {
                setComplaints([]);
                return;
            }

            const body = res?.payload ?? res?.data ?? res;
            const arr = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : body?.complaints ?? [];

            const mapped: Complaint[] = (arr || []).map((c: any, idx: number) => {
                const statusRaw = (c.complaintStatus ?? c.status ?? "OPEN").toString().toUpperCase();
                const statusMapped: ComplaintStatus = statusRaw === "OPEN" ? "Open" : statusRaw === "IN_REVIEW" ? "In Review" : "Resolved";

                const orderCode = c.order?.orderCode ?? c.orderCode ?? c.orderId ?? c.order_id ?? "";

                const ticket_no = c.ticket_no ?? c.ticketNo ?? `CMP-${String(idx + 1).padStart(5, "0")}`;

                const firstImage =
                    Array.isArray(c.images) && c.images.length > 0 ? (c.images[0].imageUrl ?? c.images[0]) : c.attachment ?? undefined;

                return {
                    id: c.id ?? `cmp_${idx}_${Date.now()}`,
                    ticket_no,
                    title: c.title ?? `Issue with order ${orderCode || "(unknown)"}`,
                    description: c.description ?? c.msg ?? "",
                    category: (c.category as any) ?? "Maintenance",
                    status: statusMapped,
                    created_at: c.createdAt ?? c.created_at ?? new Date().toISOString(),
                    updated_at: c.updatedAt ?? c.updated_at ?? new Date().toISOString(),
                    attachment: firstImage,
                    order_id: orderCode,
                } as Complaint;
            });

            setComplaints(mapped);
        } catch (err: any) {
            console.error("loadComplaints error:", err);
            setSnackBar("error", err?.message ?? "Failed to load complaints");
            setComplaints([]);
        } finally {
            setLoadingComplaints(false);
        }
    };

    useEffect(() => {
        loadComplaints();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                                {(
                                    [
                                        { label: "All", value: "All", color: "#64748b", count: complaintCounts.total },
                                        { label: "Open", value: "Open", color: BRAND.open, count: complaintCounts["Open"] },
                                        { label: "In Review", value: "In Review", color: BRAND.review, count: complaintCounts["In Review"] },
                                        { label: "Resolved", value: "Resolved", color: BRAND.resolved, count: complaintCounts["Resolved"] },
                                    ] as const
                                ).map((f) => (
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
                                    {loadingComplaints ? (
                                        <Box py={6} textAlign="center">
                                            <CircularProgress />
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                Loading complaints…
                                            </Typography>
                                        </Box>
                                    ) : filteredComplaints.length === 0 ? (
                                        <Box py={6} textAlign="center">
                                            <Typography variant="body1" color="text.secondary">
                                                No complaints match your filter.
                                            </Typography>
                                        </Box>
                                    ) : (
                                        filteredComplaints.map((c) => {
                                            const busy = Boolean(inFlight[c.id]);
                                            return (
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
                                                        <Stack
                                                            direction="row"
                                                            spacing={1}
                                                            alignItems="center"
                                                            sx={{ flexWrap: "wrap", rowGap: 1 }}
                                                            justifyContent="flex-end"
                                                        >
                                                            {/* linked order id */}
                                                            <Chip size="small" variant="outlined" label={c.order_id} sx={{ fontWeight: 600 }} />

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
                                                                    <span>
                                                                        <Button
                                                                            size="small"
                                                                            variant="outlined"
                                                                            startIcon={busy ? undefined : <PlayCircleFilledWhiteIcon />}
                                                                            onClick={() => transition(c.id, "In Review")}
                                                                            disabled={busy}
                                                                        >
                                                                            {busy ? <CircularProgress size={16} /> : "Start Review"}
                                                                        </Button>
                                                                    </span>
                                                                </Tooltip>
                                                            )}

                                                            {c.status === "In Review" && (
                                                                <Tooltip title="Mark as Resolved (after review)">
                                                                    <span>
                                                                        <Button
                                                                            size="small"
                                                                            variant="contained"
                                                                            startIcon={busy ? undefined : <AssignmentTurnedInIcon />}
                                                                            onClick={() => transition(c.id, "Resolved")}
                                                                            disabled={busy}
                                                                        >
                                                                            {busy ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Resolve"}
                                                                        </Button>
                                                                    </span>
                                                                </Tooltip>
                                                            )}

                                                            <Tooltip title="View details">
                                                                <IconButton onClick={() => openView(c)} disabled={busy}>
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
                                            );
                                        })
                                    )}
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
                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#f8fafc", border: "1px solid #e5e7eb", whiteSpace: "pre-wrap" }}>
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
                                <Box sx={{ p: 1, borderRadius: 2, border: "1px solid #e5e7eb", display: "inline-block", bgcolor: "#fff" }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={viewCmp.attachment} alt="Complaint attachment" style={{ maxWidth: "100%", borderRadius: 8, display: "block" }} />
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
                            disabled={Boolean(inFlight[viewCmp?.id ?? ""])}
                        >
                            {inFlight[viewCmp?.id ?? ""] ? <CircularProgress size={16} /> : "Start Review"}
                        </Button>
                    )}
                    {viewCmp?.status === "In Review" && (
                        <Button
                            variant="contained"
                            startIcon={<AssignmentTurnedInIcon />}
                            onClick={() => viewCmp && transition(viewCmp.id, "Resolved")}
                            disabled={Boolean(inFlight[viewCmp?.id ?? ""])}
                        >
                            {inFlight[viewCmp?.id ?? ""] ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Mark Resolved"}
                        </Button>
                    )}
                    <Button onClick={closeView}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
