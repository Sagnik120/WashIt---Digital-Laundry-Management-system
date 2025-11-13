"use client";
import React, { useEffect, useMemo, useState } from "react";
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
    CircularProgress,
} from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CountUp from "react-countup";

import { useDispatch } from "react-redux";
import ErrorHandler from "@/lib/errorHandler"; // adjust if needed
import { complaintsList } from "@/Redux/Actions/AuthUser";

type ComplaintStatus = "Open" | "In Review" | "Resolved" | "Closed";

interface ComplaintImage {
    id: string;
    imageUrl: string;
    uploadedAt?: string;
}

interface Complaint {
    id: string;
    ticket_no: string;
    title: string;
    description: string;
    category: "Maintenance" | "Hostel" | "Mess" | "Academics" | "Other";
    status: ComplaintStatus;
    created_at: string; // ISO
    updated_at: string; // ISO
    order_id: string; // order.orderCode (ORD-...)
    order_raw_id?: string; // actual order uuid
    order_status?: string; // PENDING | COMPLETED etc
    hostel: string;
    laundry_id: string; // studentUserId
    studentUserId?: string;
    images?: ComplaintImage[];
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

    const dispatch = useDispatch();

    // complaints loaded from API
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // filters
    const [statusFilter, setStatusFilter] = useState<"All" | ComplaintStatus>("All");
    const [hostelFilter, setHostelFilter] = useState<string>("All");

    // load complaints on mount
    useEffect(() => {
        const loadComplaints = async () => {
            setLoading(true);
            setError(null);
            try {
                // dispatch the redux action that calls the API
                // @ts-ignore
                const res: any = await dispatch(complaintsList());
                try {
                    ErrorHandler(res, () => { });
                } catch {
                    // swallow non-fatal errorHandler throws
                }

                // The API shape you provided: { data: [ ... ], page, pageSize, total }
                const body = res?.payload ?? res?.data ?? res ?? null;
                const arr: any[] = Array.isArray(body?.data)
                    ? body.data
                    : Array.isArray(body)
                        ? body
                        : Array.isArray(body?.complaints)
                            ? body.complaints
                            : [];

                const mapped: Complaint[] = arr.map((n: any) => {
                    // map API complaintStatus -> our ComplaintStatus
                    const statusMap: Record<string, ComplaintStatus> = {
                        OPEN: "Open",
                        IN_REVIEW: "In Review",
                        INREVIEW: "In Review",
                        REVIEW: "In Review",
                        RESOLVED: "Resolved",
                        CLOSED: "Closed",
                    };
                    const apiStatus = String(n.complaintStatus ?? n.status ?? "").toUpperCase();
                    const status = statusMap[apiStatus] ?? (apiStatus === "PENDING" ? "Open" : "Open");

                    // friendly ticket (API doesn't include ticket_no in your sample)
                    const ticket_no = String(
                        n.ticket_no ?? n.ticketNo ?? n.ticket ?? (n.id ? `CMP-${String(n.id).slice(0, 8)}` : `CMP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)
                    );

                    // images mapping
                    const images: ComplaintImage[] = Array.isArray(n.images)
                        ? n.images.map((img: any) => ({
                            id: String(img.id ?? Math.random().toString(36).slice(2)),
                            imageUrl: String(img.imageUrl ?? img.url ?? ""),
                            uploadedAt: img.uploadedAt ?? img.createdAt ?? img.uploaded_at ?? undefined,
                        }))
                        : [];

                    // order code & status
                    const orderCode = n?.order?.orderCode ?? n.orderCode ?? n.orderId ?? (n.order?.id ?? "");
                    const orderRawId = n?.order?.id ?? n.orderId ?? undefined;
                    const orderStatus = n?.order?.orderStatus ?? n.orderStatus ?? undefined;

                    return {
                        id: String(n.id ?? n._id ?? ticket_no),
                        ticket_no,
                        title: String(n.title ?? `Complaint ${ticket_no}`),
                        description: String(n.description ?? n.detail ?? ""),
                        category: (n.category ?? "Other") as Complaint["category"],
                        status,
                        created_at: n.createdAt ?? n.created_at ?? new Date().toISOString(),
                        updated_at: n.updatedAt ?? n.updated_at ?? new Date().toISOString(),
                        order_id: String(orderCode),
                        order_raw_id: orderRawId,
                        order_status: orderStatus,
                        hostel: String(n.hostel ?? "Unknown"),
                        laundry_id: String(n.studentUserId ?? n.laundry_id ?? n.studentId ?? ""),
                        studentUserId: String(n.studentUserId ?? ""),
                        images,
                    } as Complaint;
                });

                setComplaints(mapped);
            } catch (err: any) {
                console.error("loadComplaints error:", err);
                setError(err?.message ?? "Failed to load complaints");
            } finally {
                setLoading(false);
            }
        };

        loadComplaints();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                if (!acc[c.status]) acc[c.status] = 0;
                acc[c.status]++;
                return acc;
            },
            { total: 0, Open: 0, "In Review": 0, Resolved: 0, Closed: 0 } as Record<"total" | ComplaintStatus, number>
        );
    }, [baseFiltered]);

    // final list after clicking a counter (status filter applied over base filters)
    const finalList = useMemo(() => {
        return statusFilter === "All" ? baseFiltered : baseFiltered.filter((c) => c.status === statusFilter);
    }, [baseFiltered, statusFilter]);

    const clearFilters = () => {
        setHostelFilter("All");
        setStatusFilter("All");
    };

    // ---------- Static info pipeline (top) ----------
    const InfoPipeline = ({ counts }: { counts: Record<"total" | ComplaintStatus, number> }) => {
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
                    <Chip size="small" label={`Total: ${counts.total}`} sx={{ fontWeight: 700, backgroundColor: "#f1f5f9" }} />
                </Stack>

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

                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mt: 1.5 }}>
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
                            <Typography variant="caption" sx={{ fontWeight: 700, color: "#111827", whiteSpace: "nowrap" }}>
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
                        </Box>

                        <Grid container spacing={2} mb={2}>
                            <Grid item xs={12}>
                                <InfoPipeline counts={counts} />
                            </Grid>

                            {(
                                [
                                    { label: "All", value: "All", color: "#64748b", count: counts.total },
                                    { label: "Open", value: "Open", color: BRAND.open, count: counts["Open"] },
                                    { label: "In Review", value: "In Review", color: BRAND.review, count: counts["In Review"] },
                                    { label: "Resolved", value: "Resolved", color: BRAND.resolved, count: counts["Resolved"] },
                                    { label: "Closed", value: "Closed", color: BRAND.closed, count: counts["Closed"] },
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
                                {loading && (
                                    <Box py={6} textAlign="center">
                                        <CircularProgress />
                                        <Typography variant="body1" color="text.secondary" mt={1}>
                                            Loading complaints...
                                        </Typography>
                                    </Box>
                                )}

                                {error && !loading && (
                                    <Box py={6} textAlign="center">
                                        <Typography variant="body1" color="error">
                                            {error}
                                        </Typography>
                                    </Box>
                                )}

                                {!loading && !error && finalList.length === 0 && (
                                    <Box py={6} textAlign="center">
                                        <Typography variant="body1" color="text.secondary">
                                            No complaints match your filter.
                                        </Typography>
                                    </Box>
                                )}

                                {!loading &&
                                    !error &&
                                    finalList.map((c) => (
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
                                                    {/* Order status badge */}
                                                    {c.order_status && (
                                                        <Chip
                                                            size="small"
                                                            label={c.order_status}
                                                            sx={{
                                                                fontWeight: 700,
                                                                bgcolor: c.order_status === "PENDING" ? "#f59e0b22" : "#10b98122",
                                                                color: c.order_status === "PENDING" ? "#b45309" : "#065f46",
                                                            }}
                                                        />
                                                    )}
                                                </Stack>
                                            }
                                        >
                                            <ListItemAvatar>
                                                {c.images && c.images.length > 0 ? (
                                                    <Avatar
                                                        variant="rounded"
                                                        sx={{ width: 48, height: 48 }}
                                                        src={c.images[0].imageUrl}
                                                        alt={c.title}
                                                    />
                                                ) : (
                                                    <Avatar sx={{ bgcolor: BRAND.color()[c.status] }}>
                                                        <ReportProblemIcon />
                                                    </Avatar>
                                                )}
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
                                                                Created: {new Date(c.created_at).toLocaleString()} {" • "} Updated: {new Date(c.updated_at).toLocaleString()}
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
