"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Stack,
    Collapse,
    Divider,
    TextField,
    MenuItem,
    Pagination,
    InputAdornment,
    Select,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Tooltip,
} from "@mui/material";
import {
    LocalLaundryService,
    CheckCircle,
    HourglassBottom,
    Search as SearchIcon,
    Download as DownloadIcon,
    Close as CloseIcon,
    QrCode2 as QrCode2Icon,
} from "@mui/icons-material";
import { QRCodeCanvas } from "qrcode.react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import usePageLoader from "@/Redux/hooks/usePageLoader";
import useSnackBar from "@/Redux/hooks/useSnackBar";
import { StudentHistory } from "@/Redux/Actions/AuthUser";
import ErrorHandler from "@/lib/errorHandler";

// ---------- Status config ----------
const STATUS_STEPS = ["qr not scan", "pending", "in progress", "completed"] as const;
type StatusKey = (typeof STATUS_STEPS)[number];

const ICONS: Record<StatusKey, JSX.Element> = {
    "qr not scan": <QrCode2Icon fontSize="small" />,
    pending: <HourglassBottom fontSize="small" />,
    "in progress": <LocalLaundryService fontSize="small" />,
    completed: <CheckCircle fontSize="small" />,
};

const COLORS = {
    primary: "#2563eb",
    primaryLight: "rgba(37,99,235,0.15)",
    slate: "#cbd5e1",
    baseLine: "#e5e7eb",
};

const stepIndex = (status: string): number => {
    const i = STATUS_STEPS.indexOf(status.toLowerCase() as StatusKey);
    return i >= 0 ? i : 0;
};

// ---------- Fancy progress UI with icons + labels ----------
function StatusProgress({ status }: { status: string }) {
    const currentIdx = stepIndex(status);

    return (
        <Box sx={{ mt: 2.5, position: "relative" }}>
            {/* Connector line */}
            <Box
                sx={{
                    position: "relative",
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: COLORS.baseLine,
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        height: "100%",
                        width: `${(currentIdx / (STATUS_STEPS.length - 1)) * 100}%`,
                        background: "linear-gradient(90deg,#2563eb,#3b82f6)",
                    }}
                />
            </Box>

            {/* Steps */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mt: 1.5 }}>
                {STATUS_STEPS.map((step, i) => {
                    const state = i < currentIdx ? "done" : i === currentIdx ? "current" : "todo";
                    const isDone = state === "done";
                    const isCurrent = state === "current";

                    return (
                        <Stack key={step} alignItems="center" spacing={0.75} sx={{ minWidth: 0 }}>
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: isDone || isCurrent ? "#fff" : "#475569",
                                    background:
                                        isDone
                                            ? "linear-gradient(135deg,#2563eb,#3b82f6)"
                                            : isCurrent
                                                ? "linear-gradient(135deg,#1e40af,#2563eb)"
                                                : "#f1f5f9",
                                    boxShadow: isCurrent
                                        ? `0 0 0 6px ${COLORS.primaryLight}, 0 8px 18px rgba(0,0,0,0.12)`
                                        : isDone
                                            ? "0 4px 12px rgba(37,99,235,0.25)"
                                            : "inset 0 -1px 0 rgba(0,0,0,0.04)",
                                    border: isDone || isCurrent ? "none" : "1px solid #e2e8f0",
                                    transition: "transform 0.2s ease",
                                    "&:hover": { transform: "translateY(-2px)" },
                                }}
                            >
                                {ICONS[step as StatusKey]}
                            </Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    textTransform: "capitalize",
                                    color: isCurrent ? "#111827" : "text.secondary",
                                    fontWeight: isCurrent ? 700 : 500,
                                    maxWidth: 92,
                                    textAlign: "center",
                                    lineHeight: 1.2,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {step}
                            </Typography>
                        </Stack>
                    );
                })}
            </Stack>
        </Box>
    );
}

// ---------- Chip style for card status ----------
const chipStyleMap: Record<string, { bg: string; color: string; icon: JSX.Element }> = {
    "qr not scan": { bg: "linear-gradient(135deg,#64748b,#94a3b8)", color: "#fff", icon: <QrCode2Icon /> },
    pending: { bg: "linear-gradient(135deg,#facc15,#f59e0b)", color: "#fff", icon: <HourglassBottom /> },
    "in progress": { bg: "linear-gradient(135deg,#3b82f6,#60a5fa)", color: "#fff", icon: <LocalLaundryService /> },
    completed: { bg: "linear-gradient(135deg,#10b981,#34d399)", color: "#fff", icon: <CheckCircle /> },
};

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
    const qrRef = useRef<HTMLCanvasElement | null>(null);

    // Confirm dialog state for marking completed
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmOrderId, setConfirmOrderId] = useState<string | null>(null);

    // TEMP DATA
    const [historyData, setHistoryData] = useState<any[]>([
        {
            id: "ord_001",
            order_id: "LDR-2025-0001",
            submission_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
            status: "qr not scan",
            items: [
                { item_name: "Shirt", quantity: 2 },
                { item_name: "Socks", quantity: 4 },
            ],
        },
        {
            id: "ord_002",
            order_id: "LDR-2025-0002",
            submission_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
            status: "in progress",
            items: [
                { item_name: "T-Shirt", quantity: 5 },
                { item_name: "Jeans", quantity: 1 },
            ],
        },
        {
            id: "ord_003",
            order_id: "LDR-2025-0003",
            submission_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
            status: "completed",
            items: [
                { item_name: "Bedsheet", quantity: 2 },
                { item_name: "Pillow Cover", quantity: 2 },
            ],
        },
        {
            id: "ord_004",
            order_id: "LDR-2025-0004",
            submission_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
            status: "in progress",
            items: [
                { item_name: "Hoodie", quantity: 1 },
                { item_name: "Shorts", quantity: 2 },
            ],
        },
        {
            id: "ord_005",
            order_id: "LDR-2025-0005",
            submission_date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
            status: "pending",
            items: [
                { item_name: "Kurta", quantity: 2 },
                { item_name: "Dupatta", quantity: 1 },
            ],
        },
    ]);

    // Handle QR popup
    const handleQrClick = (orderId: string, status: string) => {
        const orderLink = `https://laundry-tracking/${orderId}`;
        setQrValue(orderLink);
        setQrMeta({ orderId, status });
        setQrOpen(true);
    };

    const downloadPng = () => {
        const canvas = qrRef.current;
        if (!canvas) return;
        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = `${qrMeta?.orderId || "laundry-qr"}.png`;
        a.click();
    };

    // ✅ Only allow pending -> completed
    const requestMarkCompleted = (orderId: string, currentStatus: string) => {
        if (currentStatus.toLowerCase() !== "pending") {
            setSnackBar("warning", "Only pending orders can be marked as completed.");
            return;
        }
        setConfirmOrderId(orderId);
        setConfirmOpen(true);
    };

    const confirmMarkCompleted = () => {
        if (!confirmOrderId) return;
        setHistoryData(prev =>
            prev.map(o =>
                o.order_id === confirmOrderId && o.status.toLowerCase() === "pending"
                    ? { ...o, status: "completed" }
                    : o
            )
        );
        setConfirmOpen(false);
        setConfirmOrderId(null);
        setSnackBar("success", "Order marked as completed.");
    };

    // Filters
    const filteredData = useMemo(() => {
        return historyData.filter((order) => {
            const q = search.toLowerCase();
            const matchesSearch =
                order.order_id.toLowerCase().includes(q) ||
                order.items.some((item: any) => item.item_name.toLowerCase().includes(q));
            const matchesFilter = filter === "All" || order.status.toLowerCase() === filter.toLowerCase();
            return matchesSearch && matchesFilter;
        });
    }, [search, filter, historyData]);

    const pageCount = Math.ceil(filteredData.length / pageSize);
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

    // useEffect(()=>{
    //     setFullPageLoader(true);
    // }, [])

    return (
        <>
            <Box
                sx={{
                    px: { xs: 2, md: 4 },
                    py: 3,
                    background: "linear-gradient(135deg, #e0f2fe, #f0fdfa)",
                    minHeight: "82vh",
                }}
            >
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                    📜 Laundry History
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Review your complete laundry order history. Generate a QR code for orders that are still in process and track them with ease.
                </Typography>

                {/* Search + Filter */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2} alignItems={{ xs: "stretch", sm: "center" }}>
                    <TextField
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search by Order ID or item"
                        fullWidth
                        variant="outlined"
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ borderRadius: 2, backgroundColor: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}
                    />

                    <TextField
                        select
                        label="Filter by Status"
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value);
                            setPage(1);
                        }}
                        size="small"
                        sx={{ minWidth: 180, borderRadius: 2, backgroundColor: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}
                    >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="qr not scan">QR not scan</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="in progress">In Progress</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                    </TextField>

                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <Select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPage(1);
                            }}
                            sx={{ borderRadius: 2, backgroundColor: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}
                        >
                            {[5, 8, 10, 15, 20].map((size) => (
                                <MenuItem key={size} value={size}>
                                    {size} per page
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>

                {/* Data Section */}
                <Box sx={{ maxHeight: "55vh", overflowY: "auto", pr: 1 }}>
                    {paginatedData.length === 0 ? (
                        <Typography align="center" sx={{ py: 5, color: "text.secondary", fontStyle: "italic" }}>
                            No orders found.
                        </Typography>
                    ) : (
                        <Grid container spacing={3}>
                            {paginatedData.map((order, index) => {
                                const gIdx = (page - 1) * pageSize + index;
                                const isExpanded = expandedIndex === gIdx;

                                const statusKey = order.status.toLowerCase() as StatusKey;
                                const chipStyle = chipStyleMap[statusKey] || chipStyleMap["pending"];

                                return (
                                    <Grid item xs={12} key={order.id}>
                                        <Card
                                            sx={{
                                                borderRadius: 3,
                                                p: 2,
                                                background: index % 2 === 0 ? "#fff" : "#f9fafb",
                                                boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                                            }}
                                        >
                                            <CardContent>
                                                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center">
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight={700}>
                                                            Order ID: {order.order_id}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Date: {new Date(order.submission_date).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>

                                                    <Stack direction="row" alignItems="center" spacing={1} mt={{ xs: 1, sm: 0 }}>
                                                        {/* Show QR only for "qr not scan" */}
                                                        {statusKey === "qr not scan" && (
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                onClick={() => handleQrClick(order.order_id, order.status)}
                                                            >
                                                                Show QR
                                                            </Button>
                                                        )}

                                                        {/* ✅ Allow only pending -> completed */}
                                                        {statusKey === "pending" && (
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                color="success"
                                                                startIcon={<CheckCircle />}
                                                                onClick={() => requestMarkCompleted(order.order_id, order.status)}
                                                                sx={{
                                                                    background: "linear-gradient(135deg,#10b981,#34d399)",
                                                                    "&:hover": { background: "linear-gradient(135deg,#059669,#10b981)" },
                                                                }}
                                                            >
                                                                Mark Completed
                                                            </Button>
                                                        )}

                                                        <Chip
                                                            label={order.status}
                                                            icon={chipStyle.icon}
                                                            sx={{
                                                                background: chipStyle.bg,
                                                                color: chipStyle.color,
                                                                fontWeight: 700,
                                                                px: 2,
                                                                py: 0.5,
                                                                borderRadius: 2,
                                                                textTransform: "capitalize",
                                                            }}
                                                        />
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setExpandedIndex(isExpanded ? null : gIdx);
                                                            }}
                                                        >
                                                            {isExpanded ? "Collapse" : "Expand"}
                                                        </Button>
                                                    </Stack>
                                                </Stack>

                                                {/* Progress */}
                                                <StatusProgress status={statusKey} />

                                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                    <Divider sx={{ my: 2 }} />
                                                    <Box
                                                        sx={{
                                                            p: 2,
                                                            borderRadius: 2,
                                                            backgroundColor: "#c1dff4",
                                                            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                                                        }}
                                                    >
                                                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                                            Items in this order:
                                                        </Typography>

                                                        <Grid container spacing={2}>
                                                            {order.items.map((item: any, idx: number) => (
                                                                <Grid item xs={12} sm={6} md={4} key={idx}>
                                                                    <Card
                                                                        sx={{
                                                                            p: 1.5,
                                                                            borderRadius: 2,
                                                                            display: "flex",
                                                                            justifyContent: "space-between",
                                                                            alignItems: "center",
                                                                        }}
                                                                    >
                                                                        <Typography variant="body2" fontWeight={600}>
                                                                            {item.item_name}
                                                                        </Typography>
                                                                        <Chip
                                                                            label={`Qty: ${item.quantity}`}
                                                                            size="small"
                                                                            sx={{ backgroundColor: COLORS.primary, color: "#fff", fontWeight: 600 }}
                                                                        />
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

                {/* Pagination */}
                <Stack direction="row" justifyContent="center" mt={3}>
                    <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} color="primary" />
                </Stack>
            </Box>

            {/* 🌈 Attractive QR Dialog */}
            <Dialog
                open={qrOpen}
                onClose={() => setQrOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        overflow: "hidden",
                        backdropFilter: "blur(8px)",
                        background: "linear-gradient(180deg, #ffffff 60%, #f8fbff 100%)",
                        boxShadow: "0 20px 60px rgba(2,6,23,0.25)",
                    },
                }}
            >
                <Box
                    sx={{
                        px: 3,
                        py: 2.5,
                        background: "linear-gradient(135deg,#2563eb 0%,#60a5fa 100%)",
                        color: "white",
                        position: "relative",
                    }}
                >
                    <Typography variant="h6" fontWeight={800}>
                        Scan to Track
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Show this at the laundry desk to update status.
                    </Typography>

                    <IconButton
                        onClick={() => setQrOpen(false)}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: "white",
                            bgcolor: "rgba(255,255,255,0.12)",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                <DialogContent sx={{ p: 3 }}>
                    {/* Order Meta */}
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Stack spacing={0}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Order ID
                            </Typography>
                            <Typography variant="body1" fontWeight={700}>
                                {qrMeta?.orderId}
                            </Typography>
                        </Stack>
                        {qrMeta?.status && (
                            <Chip
                                label={qrMeta.status}
                                size="small"
                                sx={{
                                    textTransform: "capitalize",
                                    fontWeight: 700,
                                    color: "#fff",
                                    background:
                                        chipStyleMap[qrMeta.status.toLowerCase()]?.bg ||
                                        "linear-gradient(135deg,#64748b,#94a3b8)",
                                }}
                                icon={
                                    chipStyleMap[qrMeta.status.toLowerCase()]?.icon || <QrCode2Icon />
                                }
                            />
                        )}
                    </Stack>

                    {/* Fancy QR ring */}
                    <Box sx={{ display: "grid", placeItems: "center", p: 2 }}>
                        <Box
                            sx={{
                                p: 1.5,
                                borderRadius: 3,
                                background: "linear-gradient(135deg,#eef2ff,#f0f9ff)",
                                boxShadow: "0 10px 30px rgba(2,6,23,0.08)",
                                position: "relative",
                            }}
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    inset: -8,
                                    borderRadius: 3,
                                    background: "conic-gradient(from 180deg, #2563eb33, transparent 60%)",
                                    zIndex: 0,
                                    filter: "blur(12px)",
                                }}
                            />
                            <QRCodeCanvas
                                value={qrValue}
                                size={220}
                                level="H"
                                includeMargin
                                // @ts-ignore
                                ref={qrRef}
                                style={{ position: "relative", zIndex: 1 }}
                            />
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, pt: 0, gap: 1.5 }}>
                    <Tooltip title="Download QR as PNG">
                        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={downloadPng}>
                            Download
                        </Button>
                    </Tooltip>
                </DialogActions>
            </Dialog>

            {/* ✅ Confirm: mark completed */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Mark as Completed?</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" color="text.secondary">
                        This will change the status from <b>Pending</b> to <b>Completed</b>. You can’t set any other status from here. If you have complaint regarding this order then add it from complaint section.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button
                        variant="text"
                        onClick={() => {
                            setConfirmOpen(false);
                            router.push("/user/userComplaint");
                        }}
                    >
                        Go to Complaints
                    </Button>
                    <Button variant="contained" color="success" startIcon={<CheckCircle />} onClick={confirmMarkCompleted}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
