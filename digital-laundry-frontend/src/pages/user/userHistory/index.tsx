"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import {
    Box, Typography, Grid, Card, CardContent, Chip, Stack, Collapse, Divider,
    TextField, MenuItem, Pagination, InputAdornment, Select, FormControl,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton,
    Tooltip, CircularProgress
} from "@mui/material";
import {
    LocalLaundryService, CheckCircle, HourglassBottom, Search as SearchIcon,
    Download as DownloadIcon, Close as CloseIcon, QrCode2 as QrCode2Icon,
} from "@mui/icons-material";
import { QRCodeCanvas } from "qrcode.react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import usePageLoader from "@/Redux/hooks/usePageLoader";
import useSnackBar from "@/Redux/hooks/useSnackBar";
import ErrorHandler from "@/lib/errorHandler";
import { OrdersList } from "@/Redux/Actions/AuthUser";
import { BaseUrl } from "@/ApiSetUp/AuthApi";

// ---------- Status config ----------
const STATUS_STEPS = ["qr not scan", "in progress", "pending", "completed"] as const;
type StatusKey = (typeof STATUS_STEPS)[number];

const ICONS: Record<StatusKey, JSX.Element> = {
    "qr not scan": <QrCode2Icon fontSize="small" />,
    "in progress": <LocalLaundryService fontSize="small" />,
    pending: <HourglassBottom fontSize="small" />,
    completed: <CheckCircle fontSize="small" />,
};

const COLORS = { primary: "#2563eb", primaryLight: "rgba(37,99,235,0.15)", slate: "#cbd5e1", baseLine: "#e5e7eb" };

const stepIndex = (status: string): number => {
    const i = STATUS_STEPS.indexOf(status.toLowerCase() as StatusKey);
    return i >= 0 ? i : 0;
};

function StatusProgress({ status }: { status: string }) {
    const currentIdx = stepIndex(status);
    return (
        <Box sx={{ mt: 2.5, position: "relative" }}>
            <Box sx={{ position: "relative", height: 8, borderRadius: 999, backgroundColor: COLORS.baseLine, overflow: "hidden" }}>
                <Box sx={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(currentIdx / (STATUS_STEPS.length - 1)) * 100}%`, background: "linear-gradient(90deg,#2563eb,#3b82f6)" }} />
            </Box>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mt: 1.5 }}>
                {STATUS_STEPS.map((step, i) => {
                    const state = i < currentIdx ? "done" : i === currentIdx ? "current" : "todo";
                    const isDone = state === "done";
                    const isCurrent = state === "current";
                    return (
                        <Stack key={step} alignItems="center" spacing={0.75} sx={{ minWidth: 0 }}>
                            <Box sx={{
                                width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                color: isDone || isCurrent ? "#fff" : "#475569",
                                background: isDone ? "linear-gradient(135deg,#2563eb,#3b82f6)" : isCurrent ? "linear-gradient(135deg,#1e40af,#2563eb)" : "#f1f5f9",
                                boxShadow: isCurrent ? `0 0 0 6px ${COLORS.primaryLight}, 0 8px 18px rgba(0,0,0,0.12)` : isDone ? "0 4px 12px rgba(37,99,235,0.25)" : "inset 0 -1px 0 rgba(0,0,0,0.04)",
                                border: isDone || isCurrent ? "none" : "1px solid #e2e8f0", transition: "transform 0.2s ease", "&:hover": { transform: "translateY(-2px)" }
                            }}>
                                {ICONS[step as StatusKey]}
                            </Box>
                            <Typography variant="caption" sx={{ textTransform: "capitalize", color: isCurrent ? "#111827" : "text.secondary", fontWeight: isCurrent ? 700 : 500, maxWidth: 92, textAlign: "center", lineHeight: 1.2, whiteSpace: "nowrap" }}>
                                {step}
                            </Typography>
                        </Stack>
                    );
                })}
            </Stack>
        </Box>
    );
}

const chipStyleMap: Record<string, { bg: string; color: string; icon: JSX.Element }> = {
    "qr not scan": { bg: "linear-gradient(135deg,#64748b,#94a3b8)", color: "#fff", icon: <QrCode2Icon /> },
    "in progress": { bg: "linear-gradient(135deg,#3b82f6,#60a5fa)", color: "#fff", icon: <LocalLaundryService /> },
    pending: { bg: "linear-gradient(135deg,#facc15,#f59e0b)", color: "#fff", icon: <HourglassBottom /> },
    completed: { bg: "linear-gradient(135deg,#10b981,#34d399)", color: "#fff", icon: <CheckCircle /> },
};

function mapStatus(apiStatus: string | undefined) {
    if (!apiStatus) return "qr not scan";
    const s = apiStatus.toUpperCase();
    switch (s) {
        case "QR_NOT_SCANNED": return "qr not scan";
        case "IN_PROGRESS": return "in progress";
        case "PENDING": return "pending";
        case "COMPLETED": return "completed";
        default: return "qr not scan";
    }
}

export default function LaundryHistory() {
    const dispatch = useDispatch();
    const router = useRouter();
    const setFullPageLoader = usePageLoader();
    const { setSnackBar } = useSnackBar();

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<string | "All">("All");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);

    const [qrOpen, setQrOpen] = useState(false);
    const [qrValue, setQrValue] = useState("");
    const [qrMeta, setQrMeta] = useState<{ orderId: string; status: string } | null>(null);
    const [qrLoading, setQrLoading] = useState(false);
    const qrRef = useRef<HTMLCanvasElement | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmOrderId, setConfirmOrderId] = useState<string | null>(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [isAbleToCompleted, setIsAbleTOCompleted] = useState<boolean>(false);

    // server data
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    function getAuthToken() {
        return localStorage.getItem("token") || localStorage.getItem("authToken") || "";
    }
    function authHeaders() {
        const token = getAuthToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        return headers;
    }

    const handleQrClick = async (internalOrderId: string, status: string, existingQrPayload?: string) => {
        setQrMeta({ orderId: internalOrderId, status });
        setQrOpen(true);
        setQrLoading(true);

        try {
            // call the single-order QR endpoint that returns { qrPayload, orderCode }
            const url = `${BaseUrl}/api/orders/${internalOrderId}/qrcode`;
            const r = await fetch(url, { method: "GET", headers: authHeaders() });
            let json = null;
            try { json = await r.json(); } catch { json = null; }

            if (r.ok && json?.qrPayload) {
                setQrValue(String(json.qrPayload));
            } else if (existingQrPayload) {
                setQrValue(String(existingQrPayload));
            } else {
                setQrValue(`ORDER:${internalOrderId}`);
            }
        } catch (e) {
            console.error("Failed to load QR payload:", e);
            if (existingQrPayload) setQrValue(String(existingQrPayload));
            else setQrValue(`ORDER:${internalOrderId}`);
        } finally {
            setQrLoading(false);
        }
    };

    const downloadPng = () => {
        const canvasAny: any = qrRef.current as any;
        const canvas = canvasAny && canvasAny.toDataURL ? canvasAny : (canvasAny?.querySelector ? canvasAny.querySelector("canvas") : null);
        if (!canvas) return;
        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = `${qrMeta?.orderId || "laundry-qr"}.png`;
        a.click();
    };

    const requestMarkCompleted = (orderId: string, currentStatus: string) => {
        if (currentStatus.toLowerCase() !== "pending") {
            setSnackBar("warning", "Only pending orders can be marked as completed.");
            return;
        }
        setConfirmOrderId(orderId);
        setConfirmOpen(true);
    };

    const confirmMarkCompleted = async () => {
        if (!confirmOrderId) return;
        if (confirmLoading) return;
        setConfirmLoading(true);
        setFullPageLoader(true);

        try {
            const url = `${BaseUrl}/api/orders/${confirmOrderId}/complete`;
            const res = await fetch(url, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({}),
            });

            let json: any = null;
            try { json = await res.json(); } catch { json = null; }

            if (!res.ok) {
                const msg = json?.message ?? `Failed to mark completed (${res.status})`;
                setSnackBar("error", msg);
                console.warn("complete order failed:", json);
            } else {
                loadOrders();
                setSnackBar("success", json?.message ?? "Order marked as completed.");
                setConfirmOpen(false);
                setConfirmOrderId(null);
            }
        } catch (err: any) {
            console.error("confirmMarkCompleted error:", err);
            setSnackBar("error", err?.message ?? "Network error while marking completed.");
        } finally {
            setConfirmLoading(false);
            setFullPageLoader(false);
        }
    };

    // load orders from server (no q/search)
    const loadOrders = async () => {
        setLoading(true);
        setFullPageLoader(true);
        try {
            const payload: any = { page, pageSize };
            if (filter && filter !== "All") {
                const f = filter.toLowerCase();
                if (f === "qr not scan") payload.status = "QR_NOT_SCANNED";
                else if (f === "pending") payload.status = "PENDING";
                else if (f === "in progress") payload.status = "IN_PROGRESS";
                else if (f === "completed") payload.status = "COMPLETED";
            }

            const res: any = await dispatch(OrdersList(payload));
            const ok = ErrorHandler(res, setSnackBar);
            if (!ok) { setHistoryData([]); setTotal(0); return; }

            const body = res?.payload ?? res?.payload?.data ?? res?.data ?? res;
            const arr = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : (body?.orders ?? []);
            const totalFromRes = body?.total ?? body?.meta?.total ?? (Array.isArray(arr) ? arr.length : 0);

            const mapped = (arr || []).map((o: any) => ({
                id: o.id,
                order_id: o.orderCode || o.order_id || o.external_id || o.id,
                submission_date: o.orderDate || o.createdAt || new Date().toISOString(),
                status: mapStatus(o.orderStatus),
                items: Array.isArray(o.items) ? o.items.map((it: any) => ({ item_name: it.itemType || it.item_name, quantity: it.quantity })) : [],
                qrPayload: o.qrCode?.qrPayload ?? o.qrPayload ?? null,
                isAbleToComplete: (o?.complaints?.length === 0 ? true : o?.complaints?.[0]?.complaintStatus === "CLOSED" ? true : false),
            }));

            setHistoryData(mapped);
            setTotal(Number(totalFromRes) || mapped.length);
        } catch (err: any) {
            console.error(err);
            setSnackBar("error", err.message || "Failed to load orders");
        } finally {
            setLoading(false);
            setFullPageLoader(false);
        }
    };

    const filteredData = useMemo(() => {
        const q = search.trim().toLowerCase();
        return historyData.filter((order) => {
            const matchesSearch = !q || order.order_id.toLowerCase().includes(q) || order.items.some((it: any) => it.item_name.toLowerCase().includes(q));
            const matchesFilter = filter === "All" || order.status.toLowerCase() === filter.toLowerCase();
            return matchesSearch && matchesFilter;
        });
    }, [historyData, search, filter]);

    const pageCount = Math.max(1, Math.ceil(filteredData.length / pageSize));
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

    useEffect(() => {
        loadOrders();
    }, [page, pageSize, filter]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    console.log(historyData , 'shreeval')

    return (
        <>
            <Box sx={{ px: { xs: 2, md: 4 }, py: 3, background: "linear-gradient(135deg, #e0f2fe, #f0fdfa)", minHeight: "82vh" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">📜 Laundry History</Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>Review your complete laundry order history. Generate a QR code for orders that are still in process and track them with ease.</Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2} alignItems={{ xs: "stretch", sm: "center" }}>
                    <TextField
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by Order ID or item"
                        fullWidth variant="outlined" size="small"
                        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
                        sx={{ borderRadius: 2, backgroundColor: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }} />

                    <TextField
                        select label="Filter by Status" value={filter}
                        onChange={(e) => { setFilter(e.target.value); setPage(1); }}
                        size="small" sx={{ minWidth: 180, borderRadius: 2, backgroundColor: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}>
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="qr not scan">QR not scan</MenuItem>
                        <MenuItem value="in progress">In Progress</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                    </TextField>

                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <Select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                            sx={{ borderRadius: 2, backgroundColor: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}>
                            {[5, 8, 10, 15, 20].map((size) => (<MenuItem key={size} value={size}>{size} per page</MenuItem>))}
                        </Select>
                    </FormControl>
                </Stack>

                <Box sx={{ maxHeight: "55vh", overflowY: "auto", pr: 1 }}>
                    {loading ? (
                        <Box sx={{ py: 6, display: "grid", placeItems: "center" }}><CircularProgress /></Box>
                    ) : paginatedData.length === 0 ? (
                        <Typography align="center" sx={{ py: 5, color: "text.secondary", fontStyle: "italic" }}>No orders found.</Typography>
                    ) : (
                        <Grid container spacing={3}>
                            {paginatedData.map((order, index) => {
                                const gIdx = (page - 1) * pageSize + index;
                                const isExpanded = expandedIndex === gIdx;
                                const statusKey = (order.status || "").toLowerCase() as StatusKey;
                                const chipStyle = chipStyleMap[statusKey] || chipStyleMap["pending"];

                                return (
                                    <Grid item xs={12} key={order.id}>
                                        <Card sx={{ borderRadius: 3, p: 2, background: index % 2 === 0 ? "#fff" : "#f9fafb", boxShadow: "0 6px 20px rgba(0,0,0,0.05)" }}>
                                            <CardContent>
                                                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center">
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight={700}>Order ID: {order.order_id}</Typography>
                                                        <Typography variant="body2" color="text.secondary">Date: {new Date(order.submission_date).toLocaleDateString()}</Typography>
                                                    </Box>

                                                    <Stack direction="row" alignItems="center" spacing={1} mt={{ xs: 1, sm: 0 }}>
                                                        {statusKey === "qr not scan" && (
                                                            <Button variant="contained" size="small" onClick={() => handleQrClick(order.id, order.status, order.qrPayload)}>Show QR</Button>
                                                        )}

                                                        {statusKey === "pending" && (
                                                            <Button variant="contained" size="small" color="success" startIcon={<CheckCircle />}
                                                                onClick={() => {requestMarkCompleted(order.id, order.status), setIsAbleTOCompleted(order?.isAbleToComplete)}}
                                                                sx={{ background: "linear-gradient(135deg,#10b981,#34d399)", "&:hover": { background: "linear-gradient(135deg,#059669,#10b981)" } }}>
                                                                Mark Completed
                                                            </Button>
                                                        )}

                                                        <Chip label={order.status} icon={chipStyle.icon} sx={{ background: chipStyle.bg, color: chipStyle.color, fontWeight: 700, px: 2, py: 0.5, borderRadius: 2, textTransform: "capitalize" }} />
                                                        <Button variant="outlined" size="small" onClick={(e) => { e.stopPropagation(); setExpandedIndex(isExpanded ? null : gIdx); }}>{isExpanded ? "Collapse" : "Expand"}</Button>
                                                    </Stack>
                                                </Stack>

                                                <StatusProgress status={statusKey} />

                                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                    <Divider sx={{ my: 2 }} />
                                                    <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "#c1dff4", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                                                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>Items in this order:</Typography>
                                                        <Grid container spacing={2}>
                                                            {order.items.map((item: any, idx: number) => (
                                                                <Grid item xs={12} sm={6} md={4} key={idx}>
                                                                    <Card sx={{ p: 1.5, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                        <Typography variant="body2" fontWeight={600}>{item.item_name}</Typography>
                                                                        <Chip label={`Qty: ${item.quantity}`} size="small" sx={{ backgroundColor: COLORS.primary, color: "#fff", fontWeight: 600 }} />
                                                                    </Card>
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                    </Box>
                                                </Collapse>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </Box>

                <Stack direction="row" justifyContent="center" mt={3}>
                    <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} color="primary" />
                </Stack>
            </Box>

            <Dialog open={qrOpen} onClose={() => setQrOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, overflow: "hidden", backdropFilter: "blur(8px)", background: "linear-gradient(180deg, #ffffff 60%, #f8fbff 100%)", boxShadow: "0 20px 60px rgba(2,6,23,0.25)" } }}>
                <Box sx={{ px: 3, py: 2.5, background: "linear-gradient(135deg,#2563eb 0%,#60a5fa 100%)", color: "white", position: "relative" }}>
                    <Typography variant="h6" fontWeight={800}>Scan to Track</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Show this at the laundry desk to update status.</Typography>
                    <IconButton onClick={() => setQrOpen(false)} sx={{ position: "absolute", right: 8, top: 8, color: "white", bgcolor: "rgba(255,255,255,0.12)", "&:hover": { bgcolor: "rgba(255,255,255,0.22)" } }}><CloseIcon /></IconButton>
                </Box>

                <DialogContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Stack spacing={0}>
                            <Typography variant="subtitle2" color="text.secondary">Order ID</Typography>
                            <Typography variant="body1" fontWeight={700}>{qrMeta?.orderId}</Typography>
                        </Stack>
                        {qrMeta?.status && <Chip label={qrMeta.status} size="small" sx={{ textTransform: "capitalize", fontWeight: 700, color: "#fff", background: chipStyleMap[qrMeta.status.toLowerCase()]?.bg || "linear-gradient(135deg,#64748b,#94a3b8)" }} icon={chipStyleMap[qrMeta.status.toLowerCase()]?.icon || <QrCode2Icon />} />}
                    </Stack>

                    <Box sx={{ display: "grid", placeItems: "center", p: 2, position: "relative" }}>
                        {qrLoading && (
                            <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", zIndex: 10, background: "rgba(255,255,255,0.6)" }}>
                                <CircularProgress />
                            </Box>
                        )}

                        <Box sx={{ p: 1.5, borderRadius: 3, background: "linear-gradient(135deg,#eef2ff,#f0f9ff)", boxShadow: "0 10px 30px rgba(2,6,23,0.08)", position: "relative" }}>
                            <Box sx={{ position: "absolute", inset: -8, borderRadius: 3, background: "conic-gradient(from 180deg, #2563eb33, transparent 60%)", zIndex: 0, filter: "blur(12px)" }} />
                            <QRCodeCanvas value={qrValue} size={220} level="H" includeMargin ref={qrRef as any} style={{ position: "relative", zIndex: 1 }} />
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, pt: 0, gap: 1.5 }}>
                    <Tooltip title="Download QR as PNG"><Button variant="outlined" startIcon={<DownloadIcon />} onClick={downloadPng}>Download</Button></Tooltip>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Mark as Completed?</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" color="text.secondary">This will change the status from <b>Pending</b> to <b>Completed</b>. You can’t set any other status from here. If you have complaint regarding this order then add it from complaint section.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} disabled={confirmLoading}>Cancel</Button>
                    <Button variant="text" onClick={() => { setConfirmOpen(false); router.push("/user/userComplaint"); }} disabled={confirmLoading}>Go to Complaints</Button>
                    <Button variant="contained" color="success" startIcon={<CheckCircle />} onClick={confirmMarkCompleted} disabled={isAbleToCompleted ? confirmLoading : true }>
                        {confirmLoading ? <CircularProgress size={18} color="inherit" /> : "Confirm"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
