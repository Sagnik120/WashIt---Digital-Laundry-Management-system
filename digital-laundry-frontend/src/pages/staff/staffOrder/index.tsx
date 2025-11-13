"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    TextField,
    Stack,
    CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";
import ErrorHandler from "@/lib/errorHandler";
import { OrdersList } from "@/Redux/Actions/AuthUser";
import useSnackBar from "@/Redux/hooks/useSnackBar";
import usePageLoader from "@/Redux/hooks/usePageLoader";
import { BaseUrl } from "@/ApiSetUp/AuthApi";

type OrderItem = { itemType: string; quantity: number; remark?: string };
type OrderRow = {
    id: string;
    orderCode: string; // visible order code (ORD-...)
    orderDate: string;
    items: OrderItem[];
    orderStatus: string;
};

export default function StaffOrderTable() {
    const dispatch = useDispatch();
    const { setSnackBar } = useSnackBar();
    const setFullPageLoader = usePageLoader();

    const [orders, setOrders] = useState<OrderRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [inFlight, setInFlight] = useState<Record<string, boolean>>({}); // track per-order requests

    const [search, setSearch] = useState("");

    // auth helpers
    function getAuthToken() {
        return localStorage.getItem("token") || localStorage.getItem("authToken") || "";
    }
    function authHeaders() {
        const token = getAuthToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        return headers;
    }

    // Load orders from server
    const loadOrders = async () => {
        setLoading(true);
        try {
            const payload: any = { status: "IN_PROGRESS"};
            const res: any = await dispatch(OrdersList(payload) as any);
            const ok = ErrorHandler(res, setSnackBar);
            if (!ok) {
                setOrders([]);
                return;
            }

            const body = res?.payload ?? res?.data ?? res;
            const arr = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : body?.orders ?? [];

            const mapped: OrderRow[] = (arr || []).map((o: any) => ({
                id: o.id,
                orderCode: o.orderCode || o.order_code || o.order_id || o.id,
                orderDate: o.orderDate || o.createdAt || new Date().toISOString(),
                items: Array.isArray(o.items)
                    ? o.items.map((it: any) => ({ itemType: it.itemType || it.item_type || it.name, quantity: it.quantity, remark: it.remark }))
                    : [],
                orderStatus: o.orderStatus || o.status || "UNKNOWN",
            }));

            setOrders(mapped);
        } catch (err: any) {
            console.error(err);
            setSnackBar("error", err?.message ?? "Failed to load orders");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return orders;
        return orders.filter((o) => {
            const matchCode = o.orderCode?.toLowerCase().includes(q);
            const matchItem = o.items.some((it) => String(it.itemType || "").toLowerCase().includes(q));
            return matchCode || matchItem;
        });
    }, [orders, search]);

    // Call the mark-pending API and update local state on success
    const markPending = async (orderId: string) => {
        if (!orderId) return;
        // prevent duplicate requests
        if (inFlight[orderId]) return;

        setInFlight((p) => ({ ...p, [orderId]: true }));
        setFullPageLoader(true);

        try {
            const url = `${BaseUrl}/api/qr/mark-pending/${orderId}`;
            const res = await fetch(url, {
                method: "POST", 
                headers: authHeaders(),
                body: JSON.stringify({}), 
            });

            let json: any = null;
            try {
                json = await res.json();
            } catch {
                json = null;
            }

            if (!res.ok) {
                const msg = json?.message ?? `Failed (${res.status})`;
                setSnackBar("error", msg);
                console.warn("mark-pending failed:", json);
            } else {
                // setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, orderStatus: "PENDING" } : o)));
                loadOrders();
                setSnackBar("success", json?.message ?? "Order marked as Pending.");
            }
        } catch (err: any) {
            console.error("markPending error:", err);
            setSnackBar("error", err?.message ?? "Network error while marking pending.");
        } finally {
            setInFlight((p) => {
                const next = { ...p };
                delete next[orderId];
                return next;
            });
            setFullPageLoader(false);
        }
    };

    return (
        <Box sx={{ p: 4, minHeight: "82vh", background: "linear-gradient(135deg, #e0f2fe, #f0fdfa)" }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                🧺 Orders
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                Each order starts in the <b>In Progress</b> state. Once all tasks are completed, please change its status to <b>Pending</b>.
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                <Box
                    sx={{
                        p: 2,
                        borderBottom: "1px solid #e0e0e0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Typography variant="subtitle1" fontWeight={600}>
                        Orders List
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <TextField
                            size="small"
                            label="Search Order code or item"
                            placeholder="e.g., ORD-T7BU87QM or shirt"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ minWidth: 240 }}
                        />

                        {search && (
                            <Button
                                size="small"
                                variant="outlined"
                                color="inherit"
                                onClick={() => {
                                    setSearch("");
                                }}
                            >
                                Reset
                            </Button>
                        )}
                    </Stack>
                </Box>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order Code</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Items</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                    <Stack alignItems="center" spacing={1}>
                                        <CircularProgress />
                                        <Typography variant="body2" color="text.secondary">
                                            Loading orders…
                                        </Typography>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ) : filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => {
                                const busy = Boolean(inFlight[order.id]);
                                return (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.orderCode}</TableCell>
                                        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            {order.items.map((item, i) => (
                                                <Chip key={i} label={`${item.itemType} x${item.quantity}`} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                            ))}
                                        </TableCell>
                                        <TableCell>
                                            {order.orderStatus === "IN_PROGRESS" ? (
                                                <Chip label="In Progress" color="info" />
                                            ) : order.orderStatus === "PENDING" ? (
                                                <Chip label="Pending" color="warning" />
                                            ) : (
                                                <Chip label={order.orderStatus} />
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {order.orderStatus === "IN_PROGRESS" ? (
                                                <Button size="small" variant="outlined" onClick={() => markPending(order.id)} disabled={busy}>
                                                    {busy ? <CircularProgress size={16} /> : "Set Pending"}
                                                </Button>
                                            ) : (
                                                <Button size="small" variant="outlined" disabled>
                                                    Set Pending
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
