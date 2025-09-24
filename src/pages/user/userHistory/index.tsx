"use client";
import React, { useState, useMemo } from "react";
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
} from "@mui/material";
import {
    LocalLaundryService,
    CheckCircle,
    HourglassBottom,
    Search as SearchIcon,
} from "@mui/icons-material";
import { QRCodeCanvas } from "qrcode.react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

// Sample Data
const generateData = (num: number) =>
    Array.from({ length: num }, (_, i) => ({
        id: `ORD${1000 + i}`,
        date: `2025-09-${(i % 30) + 1}`,
        items: [
            { name: "Shirts", qty: Math.floor(Math.random() * 5) + 1 },
            { name: "Pants", qty: Math.floor(Math.random() * 3) + 1 },
            { name: "Shirts", qty: Math.floor(Math.random() * 5) + 1 },
            { name: "Pants", qty: Math.floor(Math.random() * 3) + 1 },
            { name: "Shirts", qty: Math.floor(Math.random() * 5) + 1 },
            { name: "Pants", qty: Math.floor(Math.random() * 3) + 1 },
        ],
        status: ["Pending", "In Progress", "Completed"][i % 3],
    }));

const historyData = generateData(50);

const statusMap: any = {
    Pending: { gradient: "linear-gradient(135deg,#facc15,#f59e0b)", icon: <HourglassBottom /> },
    "In Progress": { gradient: "linear-gradient(135deg,#3b82f6,#60a5fa)", icon: <LocalLaundryService /> },
    Completed: { gradient: "linear-gradient(135deg,#10b981,#34d399)", icon: <CheckCircle /> },
};

export default function LaundryHistory() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<string | "All">("All");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);

    const [qrOpen, setQrOpen] = useState(false);
    const [qrValue, setQrValue] = useState("");

    // Function to handle QR generation
    const handleQrClick = (orderId: string) => {
        // You can customize the QR data; here we just use orderId
        // const uniqueData = `LaundryOrder-${orderId}-${Date.now()}`;
        // setQrValue(uniqueData);
        // setQrOpen(true);

        const orderLink = `https://${orderId}`;
        setQrValue(orderLink);
        setQrOpen(true);
    };

    const filteredData = useMemo(() => {
        return historyData.filter((order) => {
            const matchesSearch =
                order.id.toLowerCase().includes(search.toLowerCase()) ||
                order.items.some((item) => item.name.toLowerCase().includes(search.toLowerCase()));
            const matchesFilter = filter === "All" || order.status === filter;
            return matchesSearch && matchesFilter;
        });
    }, [search, filter]);

    const pageCount = Math.ceil(filteredData.length / pageSize);
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

    return (
        <>
            <Box sx={{
                px: { xs: 2, md: 4 }, py: 3, background: "linear-gradient(135deg, #e0f2fe, #f0fdfa)", minHeight: "82vh"
            }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                    📜 Laundry History
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Review your complete laundry order history. Generate a QR code for orders that are still in process and track them with ease.
                </Typography>

                {/* Controls */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    mb={2}
                    alignItems={{ xs: "stretch", sm: "center" }}
                >
                    <TextField
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
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
                        sx={{
                            borderRadius: 2,
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                        }}
                    />

                    <TextField
                        select
                        label="Filter by Status"
                        value={filter}
                        onChange={(e) => { setFilter(e.target.value); setPage(1); }}
                        size="small"
                        sx={{
                            minWidth: 160,
                            borderRadius: 2,
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                        }}
                    >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                    </TextField>

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                            value={pageSize}
                            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                            sx={{
                                borderRadius: 2,
                                backgroundColor: "#fff",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                            }}
                        >
                            {[5, 8, 10, 15, 20].map((size) => (
                                <MenuItem key={size} value={size}>
                                    {size} per page
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>

                {/* Scrollable Cards Only */}
                <Box sx={{ maxHeight: "55vh", overflowY: "auto", pr: 1 }}>
                    <Grid container spacing={3}>
                        {paginatedData.map((order, index) => {
                            const globalIndex = (page - 1) * pageSize + index;
                            const isExpanded = expandedIndex === globalIndex;

                            return (
                                <Grid item xs={12} key={order.id}>
                                    <Card
                                        sx={{
                                            borderRadius: 3,
                                            p: 2,
                                            position: "relative",
                                            background: index % 2 === 0 ? "#ffffff" : "#f9fafb",
                                            boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                                            transition: "0.3s",
                                        }}
                                    >
                                        <CardContent>
                                            <Stack
                                                direction={{ xs: "column", sm: "row" }}
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                        Order ID: {order.id}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Date: {order.date}
                                                    </Typography>
                                                </Box>

                                                <Stack direction="row" alignItems="center" spacing={1} mt={{ xs: 1, sm: 0 }}>
                                                    {order.status === "In Progress" && (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => handleQrClick(order.id)}
                                                        >
                                                            Show QR
                                                        </Button>
                                                    )}
                                                    <Chip
                                                        label={order.status}
                                                        icon={statusMap[order.status].icon}
                                                        sx={{
                                                            background: statusMap[order.status].gradient,
                                                            color: "#fff",
                                                            fontWeight: 600,
                                                            px: 2,
                                                            py: 0.5,
                                                            borderRadius: 2,
                                                        }}
                                                    />

                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setExpandedIndex(isExpanded ? null : globalIndex);
                                                        }}
                                                    >
                                                        {isExpanded ? "Collapse" : "Expand"}
                                                    </Button>
                                                </Stack>
                                            </Stack>

                                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                <Divider sx={{ my: 2 }} />
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 2,
                                                        backgroundColor: "#f0f9ff",
                                                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                                                    }}
                                                >
                                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                                        Items in this order:
                                                    </Typography>

                                                    <Grid container spacing={2}>
                                                        {order.items.map((item, idx) => (
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
                                                                    <Typography variant="body2" fontWeight={500}>
                                                                        {item.name}
                                                                    </Typography>
                                                                    <Chip
                                                                        label={`Qty: ${item.qty}`}
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: "#2563eb",
                                                                            color: "#fff",
                                                                            fontWeight: 500,
                                                                        }}
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
                </Box>

                {/* Pagination */}
                <Stack direction="row" justifyContent="center" mt={3}>
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        color="primary"
                    />
                </Stack>
            </Box>

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
        </>
    );
}
