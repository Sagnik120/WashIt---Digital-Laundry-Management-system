"use client";
import React, { useMemo, useState } from "react";
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
    Select,
    MenuItem,
    Stack,
} from "@mui/material";

type OrderItem = { name: string; qty: number };
type OrderRow = {
    id: string;
    user: string;   // Laundry ID
    date: string;
    hostel: string;
    items: OrderItem[];
    status: "In Progress" | "Pending";
};

export default function StaffOrderTable() {
    const [orders, setOrders] = useState<OrderRow[]>([
        {
            id: "LDR-2025-0001",
            user: "STU-101",
            date: "02/11/2025",
            hostel: "A-Block",
            items: [
                { name: "Shirt", qty: 3 },
                { name: "Jeans", qty: 2 },
                { name: "Towel", qty: 1 },
            ],
            status: "In Progress",
        },
        {
            id: "LDR-2025-0002",
            user: "STU-102",
            date: "03/11/2025",
            hostel: "B-Block",
            items: [
                { name: "Bed Sheet", qty: 2 },
                { name: "Curtain", qty: 2 },
            ],
            status: "In Progress",
        },
        {
            id: "LDR-2025-0003",
            user: "STU-098",
            date: "03/11/2025",
            hostel: "A-Block",
            items: [
                { name: "Shirt", qty: 4 },
                { name: "T-Shirt", qty: 2 },
                { name: "Shorts", qty: 3 },
            ],
            status: "In Progress",
        },
        {
            id: "LDR-2025-0004",
            user: "STU-087",
            date: "04/11/2025",
            hostel: "C-Block",
            items: [
                { name: "Jeans", qty: 1 },
                { name: "Jacket", qty: 1 },
            ],
            status: "In Progress",
        },
        {
            id: "LDR-2025-0005",
            user: "STU-110",
            date: "04/11/2025",
            hostel: "B-Block",
            items: [
                { name: "Shirt", qty: 2 },
                { name: "Towel", qty: 2 },
                { name: "Socks", qty: 5 },
            ],
            status: "In Progress",
        },
    ]);

    const [searchId, setSearchId] = useState("");
    const [hostelFilter, setHostelFilter] = useState("All");

    const uniqueHostels = useMemo(() => {
        return Array.from(new Set(orders.map((o) => o.hostel))).sort();
    }, [orders]);

    const filteredOrders = useMemo(() => {
        return orders.filter((o) => {
            const idMatch = o.user.toLowerCase().includes(searchId.trim().toLowerCase());
            const hostelMatch = hostelFilter === "All" ? true : o.hostel === hostelFilter;
            return idMatch && hostelMatch;
        });
    }, [orders, searchId, hostelFilter]);

    const markPending = (id: string) => {
        setOrders((prev) =>
            prev.map((o) => (o.id === id && o.status === "In Progress" ? { ...o, status: "Pending" } : o))
        );
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

                {/* 🔹 Filters Header Inside Container */}
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
                            label="Search Laundry ID"
                            placeholder="e.g., STU-101"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            sx={{ minWidth: 180 }}
                        />

                        <Select
                            size="small"
                            value={hostelFilter}
                            onChange={(e) => setHostelFilter(e.target.value)}
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value="All">All Hostels</MenuItem>
                            {uniqueHostels.map((h) => (
                                <MenuItem key={h} value={h}>
                                    {h}
                                </MenuItem>
                            ))}
                        </Select>

                        {(searchId || hostelFilter !== "All") && (
                            <Button
                                size="small"
                                variant="outlined"
                                color="inherit"
                                onClick={() => {
                                    setSearchId("");
                                    setHostelFilter("All");
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
                            <TableCell>Order ID</TableCell>
                            <TableCell>Laundry ID</TableCell>
                            <TableCell>Hostel</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Items</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.user}</TableCell>
                                    <TableCell>{order.hostel}</TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>
                                        {order.items.map((item, i) => (
                                            <Chip key={i} label={`${item.name} x${item.qty}`} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        {order.status === "In Progress" ? (
                                            <Chip label="In Progress" color="info" />
                                        ) : (
                                            <Chip label="Pending" color="warning" />
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {order.status === "In Progress" ? (
                                            <Button size="small" variant="outlined" onClick={() => markPending(order.id)}>
                                                Set Pending
                                            </Button>
                                        ) : (
                                            <Button size="small" variant="outlined" disabled>
                                                Set Pending
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
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
