"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Card,
    Paper,
    Typography,
    Stack,
    TextField,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    IconButton,
    Collapse,
    CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useDispatch } from "react-redux";
import { OrderListForAdmin } from "@/Redux/Actions/AuthUser";

// ---- Types
type OrderStatus = "Pending" | "In Progress" | "Completed" | "Delivered" | "Cancelled" | "QR Not Scanned" | "Unknown";

type Student = {
    laundryId: string; // unique laundry id from API (uniqueLaundryId)
    name: string; // from student.fullName or fall back to laundryId
};

type Order = {
    id: string; // e.g., ORD-...
    laundryId: string; // uniqueLaundryId
    date: string; // dd/mm/yyyy
    rawDateIso?: string; // original ISO for sorting if needed
    status: OrderStatus;
};

// ---- Status Chip helper
const statusColor = (s: OrderStatus) =>
    s === "Pending" ? "warning" :
        s === "In Progress" ? "info" :
            s === "Completed" ? "success" :
                s === "Delivered" ? "secondary" :
                    s === "Cancelled" ? "default" :
                        s === "QR Not Scanned" ? "error" : "default";

export default function AdminOrdersLookupPage() {
    const dispatch = useDispatch();

    // Form state (only laundryId now)
    const [laundryId, setLaundryId] = useState<string>("");

    // Submit + results
    const [submitted, setSubmitted] = useState<{ laundryId?: string | null } | null>(null);

    // Expand state for grouped students
    const [expanded, setExpanded] = useState<Record<string, boolean>>({}); // key by laundryId

    // Fetched data
    const [fetchedOrders, setFetchedOrders] = useState<Order[]>([]);
    const [fetchedStudents, setFetchedStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const toggleExpand = (lid: string) =>
        setExpanded((prev) => ({ ...prev, [lid]: !prev[lid] }));

    // Map API orderStatus (e.g., "PENDING", "COMPLETED") to OrderStatus
    const mapStatus = (s?: string): OrderStatus => {
        const v = (s ?? "").toString().toUpperCase();
        // QR not scanned detection - cover various possible API values
        if (v.includes("QR") && (v.includes("NOT") || v.includes("UNSCANNED") || v.includes("NOT_SCANNED") || v.includes("NOTSCANNED"))) return "QR Not Scanned";
        if (v.includes("PENDING")) return "Pending";
        if (v.includes("IN_PROGRESS") || v.includes("INPROGRESS")) return "In Progress";
        if (v.includes("COMPLETED") || v.includes("COMPLETE")) return "Completed";
        if (v.includes("DELIVERED")) return "Delivered";
        if (v.includes("CANCEL")) return "Cancelled";
        return "Unknown";
    };

    const isoToDDMMYYYY = (iso?: string) => {
        if (!iso) return "";
        const d = new Date(iso);
        if (isNaN(d.getTime())) return iso;
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    };

    const handleSearch = async () => {
        setSubmitted({ laundryId: laundryId.trim() ? laundryId.trim() : null });
        setExpanded({});
        // Build params - only uniqueLaundryId if provided (no hostelCode)
        const params: Record<string, string> = {};
        if (laundryId?.trim()) {
            params.uniqueLaundryId = laundryId.trim();
        }

        setLoading(true);
        setError(null);
        try {
            const res: any = await dispatch(OrderListForAdmin(params));
            const body = res?.payload ?? res?.data ?? res ?? null;
            const arr: any[] = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];

            const mappedOrders: Order[] = arr.map((o: any) => ({
                id: String(o.orderCode ?? o.id ?? ""),
                laundryId: String(o.student?.uniqueLaundryId ?? ""),
                date: isoToDDMMYYYY(o.orderDate ?? o.order_date),
                rawDateIso: o.orderDate ?? o.order_date,
                status: mapStatus(o.orderStatus ?? o.order_status),
            }));

            const studentsMap = new Map<string, Student>();
            arr.forEach((o: any) => {
                const lid = String(o.student?.uniqueLaundryId ?? "");
                if (!lid) return;
                if (!studentsMap.has(lid)) {
                    const name = o.student?.fullName?.trim() ? String(o.student.fullName) : lid;
                    studentsMap.set(lid, { laundryId: lid, name });
                }
            });

            setFetchedOrders(mappedOrders);
            setFetchedStudents(Array.from(studentsMap.values()));
        } catch (err: any) {
            console.error("OrderListForAdmin error:", err);
            setError(err?.message ?? "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const results = useMemo(() => {
        if (!submitted) return { mode: "none" as const, students: [] as Student[], ordersByStudent: {} as Record<string, Order[]> };
        const { laundryId: lid } = submitted;

        const ordersByStudent: Record<string, Order[]> = {};
        fetchedOrders.forEach((o) => {
            if (!ordersByStudent[o.laundryId]) ordersByStudent[o.laundryId] = [];
            ordersByStudent[o.laundryId].push(o);
        });

        if (lid) {
            const key = fetchedStudents.find((s) => s.laundryId.toLowerCase() === lid.toLowerCase())?.laundryId ?? lid;
            const student = fetchedStudents.find((s) => s.laundryId.toLowerCase() === lid.toLowerCase());
            const orders = ordersByStudent[key] ?? [];
            return {
                mode: "single" as const,
                students: student ? [student] : (orders.length ? [{ laundryId: key, name: key }] : []),
                ordersByStudent: student ? { [student.laundryId]: orders } : { [key]: orders },
            };
        }

        const students = fetchedStudents.length ? fetchedStudents : Array.from(new Set(fetchedOrders.map((o) => o.laundryId))).map((lid) => ({ laundryId: lid, name: lid }));
        students.forEach((s) => { if (!ordersByStudent[s.laundryId]) ordersByStudent[s.laundryId] = []; });

        return { mode: "group" as const, students, ordersByStudent };
    }, [submitted, fetchedOrders, fetchedStudents]);

    useEffect(() => {
        handleSearch();
    }, [])

    return (
        <Box sx={{ p: 4, minHeight: "82vh", background: "linear-gradient(135deg,#e0f2fe,#f0fdfa)" }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                🔎 Orders Lookup
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                Provide a <b>Laundry ID</b> to view a specific student's orders, or leave it empty to fetch all orders.
            </Typography>

            <Card sx={{ borderRadius: 4, overflow: "hidden" }}>
                <Box
                    sx={{
                        p: 2,
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Typography variant="h6" fontWeight={700}>
                        Search
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <TextField
                            size="small"
                            placeholder="Laundry ID (optional) e.g., UL-m25cse021"
                            value={laundryId}
                            onChange={(e) => setLaundryId(e.target.value)}
                            sx={{ minWidth: 320 }}
                        />

                        <Button
                            variant="contained"
                            startIcon={<SearchIcon />}
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            {loading ? "Searching..." : "Search"}
                        </Button>
                    </Stack>
                </Box>

                <Paper elevation={0} sx={{ borderRadius: 0 }}>
                    {!submitted && (
                        <Box sx={{ py: 6, textAlign: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                                Enter a Laundry ID (or leave empty) and click <b>Search</b>.
                            </Typography>
                        </Box>
                    )}

                    {submitted && loading && (
                        <Box sx={{ py: 6, textAlign: "center" }}>
                            <CircularProgress />
                            <Typography variant="body2" color="text.secondary" mt={1}>
                                Loading orders...
                            </Typography>
                        </Box>
                    )}

                    {submitted && error && !loading && (
                        <Box sx={{ py: 6, textAlign: "center" }}>
                            <Typography variant="body2" color="error">
                                {error}
                            </Typography>
                        </Box>
                    )}

                    {/* Single student view */}
                    {submitted && !loading && results.mode === "single" && (
                        <>
                            {results.students.length === 0 ? (
                                <Box sx={{ py: 6, textAlign: "center" }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No matching student found with Laundry ID <b>{submitted.laundryId}</b>.
                                    </Typography>
                                </Box>
                            ) : (
                                <>
                                    <Box sx={{ px: 2, pt: 2 }}>
                                        <Typography variant="subtitle1" fontWeight={700}>
                                            {results.students[0].name} • {results.students[0].laundryId}
                                        </Typography>
                                    </Box>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Order ID</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(results.ordersByStudent[results.students[0].laundryId] || []).map((o) => (
                                                <TableRow key={o.id}>
                                                    <TableCell>{o.id}</TableCell>
                                                    <TableCell>{o.date}</TableCell>
                                                    <TableCell>
                                                        <Chip label={o.status} color={statusColor(o.status)} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {!(results.ordersByStudent[results.students[0].laundryId] || []).length && (
                                                <TableRow>
                                                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                                                        No orders found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </>
                            )}
                        </>
                    )}

                    {/* Grouped (all students) view */}
                    {submitted && !loading && results.mode === "group" && (
                        <>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Student</TableCell>
                                        <TableCell>Laundry ID</TableCell>
                                        <TableCell>Orders</TableCell>
                                        <TableCell>Statuses (summary)</TableCell>
                                        <TableCell align="right">Details</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {results.students.length ? (
                                        results.students.map((s) => {
                                            const orders = results.ordersByStudent[s.laundryId] || [];
                                            const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
                                                acc[o.status] = (acc[o.status] || 0) + 1;
                                                return acc;
                                            }, {} as any);

                                            return (
                                                <React.Fragment key={s.laundryId}>
                                                    <TableRow hover>
                                                        <TableCell>{s.name}</TableCell>
                                                        <TableCell>{s.laundryId}</TableCell>
                                                        <TableCell>{orders.length}</TableCell>
                                                        <TableCell>
                                                            {Object.entries(statusCounts).length ? Object.entries(statusCounts).map(([st, ct]) => (
                                                                <Chip
                                                                    key={st}
                                                                    label={`${st}: ${ct}`}
                                                                    size="small"
                                                                    color={statusColor(st as OrderStatus)}
                                                                    sx={{ mr: 0.5, mb: 0.5 }}
                                                                />
                                                            )) : <Typography variant="caption">—</Typography>}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <IconButton onClick={() => toggleExpand(s.laundryId)}>
                                                                {expanded[s.laundryId] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>

                                                    <TableRow>
                                                        <TableCell colSpan={5} sx={{ p: 0, border: 0 }}>
                                                            <Collapse in={!!expanded[s.laundryId]} timeout="auto" unmountOnExit>
                                                                <Box sx={{ p: 2, bgcolor: "#fafafa" }}>
                                                                    <Table size="small">
                                                                        <TableHead>
                                                                            <TableRow>
                                                                                <TableCell>Order ID</TableCell>
                                                                                <TableCell>Date</TableCell>
                                                                                <TableCell>Status</TableCell>
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {orders.length ? (
                                                                                orders.map((o) => (
                                                                                    <TableRow key={o.id}>
                                                                                        <TableCell>{o.id}</TableCell>
                                                                                        <TableCell>{o.date}</TableCell>
                                                                                        <TableCell>
                                                                                            <Chip label={o.status} color={statusColor(o.status)} />
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                ))
                                                                            ) : (
                                                                                <TableRow>
                                                                                    <TableCell colSpan={3} align="center" sx={{ py: 2 }}>
                                                                                        No orders for this student.
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            )}
                                                                        </TableBody>
                                                                    </Table>
                                                                </Box>
                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                </React.Fragment>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                                No students/orders found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </>
                    )}
                </Paper>
            </Card>
        </Box>
    );
}
