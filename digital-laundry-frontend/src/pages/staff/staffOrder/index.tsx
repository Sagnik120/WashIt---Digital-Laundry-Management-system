"use client";
import React, { useState, useMemo } from "react";
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
    IconButton,
    MenuItem,
    Select,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import { HourglassBottom, LocalLaundryService, CheckCircle, QrCode } from "@mui/icons-material";

// Sample Data
const generateData = (num: number) =>
    Array.from({ length: num }, (_, i) => ({
        id: `ORD${1000 + i}`,
        user: `User ${(i % 5) + 1}`,
        date: `2025-09-${(i % 30) + 1}`,
        items: [
            { name: "Shirts", qty: Math.floor(Math.random() * 5) + 1 },
            { name: "Pants", qty: Math.floor(Math.random() * 3) + 1 },
            { name: "Tshirts", qty: Math.floor(Math.random() * 3) + 1 },
            { name: "Pants", qty: Math.floor(Math.random() * 3) + 1 },
        ],
        status: ["Pending", "In Progress", "Completed"][i % 3],
    }));

const staffData = generateData(30);

const statusMap: any = {
    Pending: { color: "warning", icon: <HourglassBottom /> },
    "In Progress": { color: "info", icon: <LocalLaundryService /> },
    Completed: { color: "success", icon: <CheckCircle /> },
};

export default function StaffOrderTable() {
    const [orders, setOrders] = useState(staffData);
    const [qrOpen, setQrOpen] = useState(false);
    const [qrValue, setQrValue] = useState("");

    // Handle status update
    const handleStatusChange = (id: string, newStatus: string) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === id ? { ...order, status: newStatus } : order
            )
        );
    };

    const handleQrClick = (orderId: string) => {
        const orderLink = `https://laundry-system/order/${orderId}`;
        setQrValue(orderLink);
        setQrOpen(true);
    };

    return (
        <Box sx={{ p: 4, minHeight: "82vh", background: "#f9fafb" }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                🧺 Staff Order Management
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                Manage all laundry orders placed by students and staff. Update status or scan QR codes.
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Items</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>QR</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.user}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>
                                    {order.items.map((item, i) => (
                                        <Chip
                                            key={i}
                                            label={`${item.name} x${item.qty}`}
                                            size="small"
                                            sx={{ mr: 0.5, mb: 0.5 }}
                                        />
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        size="small"
                                    >
                                        <MenuItem value="Pending">Pending</MenuItem>
                                        <MenuItem value="In Progress">In Progress</MenuItem>
                                        <MenuItem value="Completed">Completed</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleQrClick(order.id)}
                                    >
                                        <QrCode />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* QR Dialog */}
            <Dialog open={qrOpen} onClose={() => setQrOpen(false)}>
                <DialogTitle>Scan QR Code</DialogTitle>
                <DialogContent
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 4 }}
                >
                    <QRCodeCanvas value={qrValue} size={200} level="H" includeMargin />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setQrOpen(false)} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
