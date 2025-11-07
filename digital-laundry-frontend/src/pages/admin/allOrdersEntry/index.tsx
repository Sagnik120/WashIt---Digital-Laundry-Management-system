"use client";
import React, { useMemo, useState } from "react";
import {
    Box,
    Card,
    Paper,
    Typography,
    Stack,
    TextField,
    Select,
    MenuItem,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    IconButton,
    Collapse,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// ---- Types
type OrderStatus = "Pending" | "In Progress" | "Completed" | "Delivered" | "Cancelled";

type Student = {
    laundryId: string;  // e.g., STU-101
    name: string;
    hostel: string;     // e.g., A-Block
};

type Order = {
    id: string;         // e.g., LDR-2025-0001
    laundryId: string;
    date: string;       // dd/mm/yyyy
    items: { name: string; qty: number }[];
    status: OrderStatus;
};

// ---- Mock Data (replace with API)
const HOSTELS = ["A-Block", "B-Block", "C-Block"];

const STUDENTS: Student[] = [
    { laundryId: "STU-101", name: "Vishal Singh", hostel: "A-Block" },
    { laundryId: "STU-098", name: "Ritika Shah", hostel: "A-Block" },
    { laundryId: "STU-102", name: "Anita Rao", hostel: "B-Block" },
    { laundryId: "STU-110", name: "Rahul Shah", hostel: "B-Block" },
    { laundryId: "STU-087", name: "Aman Joshi", hostel: "C-Block" },
];

const ORDERS: Order[] = [
    {
        id: "LDR-2025-0001",
        laundryId: "STU-101",
        date: "02/11/2025",
        items: [{ name: "Shirt", qty: 3 }, { name: "Jeans", qty: 2 }],
        status: "In Progress",
    },
    {
        id: "LDR-2025-0006",
        laundryId: "STU-101",
        date: "05/11/2025",
        items: [{ name: "Towel", qty: 2 }],
        status: "Pending",
    },
    {
        id: "LDR-2025-0003",
        laundryId: "STU-098",
        date: "03/11/2025",
        items: [{ name: "Shirt", qty: 4 }, { name: "Shorts", qty: 3 }],
        status: "Completed",
    },
    {
        id: "LDR-2025-0002",
        laundryId: "STU-102",
        date: "03/11/2025",
        items: [{ name: "Bed Sheet", qty: 2 }, { name: "Curtain", qty: 2 }],
        status: "In Progress",
    },
    {
        id: "LDR-2025-0005",
        laundryId: "STU-110",
        date: "04/11/2025",
        items: [{ name: "Shirt", qty: 2 }, { name: "Socks", qty: 5 }],
        status: "Pending",
    },
    {
        id: "LDR-2025-0004",
        laundryId: "STU-087",
        date: "04/11/2025",
        items: [{ name: "Jeans", qty: 1 }, { name: "Jacket", qty: 1 }],
        status: "Delivered",
    },
];

// ---- Status Chip helper
const statusColor = (s: OrderStatus) =>
    s === "Pending" ? "warning" :
        s === "In Progress" ? "info" :
            s === "Completed" ? "success" :
                s === "Delivered" ? "secondary" : "default";

export default function AdminOrdersLookupPage() {
    // Form state
    const [hostel, setHostel] = useState<string>("");
    const [laundryId, setLaundryId] = useState<string>("");

    // Submit + results
    const [submitted, setSubmitted] = useState<{ hostel: string; laundryId?: string | null } | null>(null);

    // Expand state for grouped students
    const [expanded, setExpanded] = useState<Record<string, boolean>>({}); // key by laundryId

    const handleSearch = () => {
        if (!hostel) return; // require hostel
        setSubmitted({ hostel, laundryId: laundryId.trim() ? laundryId.trim() : null });
        setExpanded({}); // reset expands on new search
    };

    // Derived results
    const results = useMemo(() => {
        if (!submitted) return { mode: "none" as const, students: [] as Student[], ordersByStudent: {} as Record<string, Order[]> };

        const { hostel: h, laundryId: lid } = submitted;
        const studentsInHostel = STUDENTS.filter((s) => s.hostel === h);

        if (lid) {
            // Specific student view
            const student = studentsInHostel.find((s) => s.laundryId.toLowerCase() === lid.toLowerCase());
            const orders = student ? ORDERS.filter((o) => o.laundryId === student.laundryId) : [];
            return {
                mode: "single" as const,
                students: student ? [student] : [],
                ordersByStudent: student ? { [student.laundryId]: orders } : {},
            };
        }

        // Hostel-wide grouped view
        const ordersByStudent: Record<string, Order[]> = {};
        studentsInHostel.forEach((s) => {
            ordersByStudent[s.laundryId] = ORDERS.filter((o) => o.laundryId === s.laundryId);
        });
        return { mode: "group" as const, students: studentsInHostel, ordersByStudent };
    }, [submitted]);

    const toggleExpand = (lid: string) =>
        setExpanded((prev) => ({ ...prev, [lid]: !prev[lid] }));

    return (
        <Box sx={{ p: 4, minHeight: "82vh", background: "linear-gradient(135deg,#e0f2fe,#f0fdfa)" }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                🔎 Orders Lookup
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                Select a <b>Hostel</b> to view all students and their orders, or provide a <b>Laundry ID</b> to view a specific student's orders.
            </Typography>

            <Card sx={{ borderRadius: 4, overflow: "hidden" }}>
                {/* Header controls (right aligned) */}
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
                        <Select
                            size="small"
                            value={hostel}
                            onChange={(e) => setHostel(e.target.value as string)}
                            displayEmpty
                            sx={{ minWidth: 200 }}
                        >
                            <MenuItem value="" disabled>
                                Select Hostel
                            </MenuItem>
                            {HOSTELS.map((h) => (
                                <MenuItem key={h} value={h}>
                                    {h}
                                </MenuItem>
                            ))}
                        </Select>

                        <TextField
                            size="small"
                            placeholder="Laundry ID (optional) e.g., STU-101"
                            value={laundryId}
                            onChange={(e) => setLaundryId(e.target.value)}
                            sx={{ minWidth: 240 }}
                        />

                        <Button
                            variant="contained"
                            startIcon={<SearchIcon />}
                            onClick={handleSearch}
                            disabled={!hostel}
                        >
                            Search
                        </Button>
                    </Stack>
                </Box>

                {/* Results */}
                <Paper elevation={0} sx={{ borderRadius: 0 }}>
                    {/* If nothing searched yet */}
                    {!submitted && (
                        <Box sx={{ py: 6, textAlign: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                                Select a hostel (and optionally a Laundry ID), then click <b>Search</b>.
                            </Typography>
                        </Box>
                    )}

                    {/* Single student view */}
                    {submitted && results.mode === "single" && (
                        <>
                            {results.students.length === 0 ? (
                                <Box sx={{ py: 6, textAlign: "center" }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No matching student found in <b>{submitted.hostel}</b> with Laundry ID <b>{submitted.laundryId}</b>.
                                    </Typography>
                                </Box>
                            ) : (
                                <>
                                    <Box sx={{ px: 2, pt: 2 }}>
                                        <Typography variant="subtitle1" fontWeight={700}>
                                            {results.students[0].name} • {results.students[0].laundryId} • {results.students[0].hostel}
                                        </Typography>
                                    </Box>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Order ID</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Items</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(results.ordersByStudent[results.students[0].laundryId] || []).map((o) => (
                                                <TableRow key={o.id}>
                                                    <TableCell>{o.id}</TableCell>
                                                    <TableCell>{o.date}</TableCell>
                                                    <TableCell>
                                                        {o.items.map((it, i) => (
                                                            <Chip key={i} label={`${it.name} x${it.qty}`} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                                        ))}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip label={o.status} color={statusColor(o.status)} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {!(results.ordersByStudent[results.students[0].laundryId] || []).length && (
                                                <TableRow>
                                                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
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

                    {/* Grouped (hostel-wide) view */}
                    {submitted && results.mode === "group" && (
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
                                            const statusCounts = orders.reduce<Record<OrderStatus, number>>((acc, o) => {
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
                                                            {Object.entries(statusCounts).map(([st, ct]) => (
                                                                <Chip
                                                                    key={st}
                                                                    label={`${st}: ${ct}`}
                                                                    size="small"
                                                                    color={statusColor(st as OrderStatus)}
                                                                    sx={{ mr: 0.5, mb: 0.5 }}
                                                                />
                                                            ))}
                                                            {!orders.length && <Typography variant="caption">—</Typography>}
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
                                                                                <TableCell>Items</TableCell>
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
                                                                                            {o.items.map((it, i) => (
                                                                                                <Chip
                                                                                                    key={i}
                                                                                                    label={`${it.name} x${it.qty}`}
                                                                                                    size="small"
                                                                                                    sx={{ mr: 0.5, mb: 0.5 }}
                                                                                                />
                                                                                            ))}
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                            <Chip label={o.status} color={statusColor(o.status)} />
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                ))
                                                                            ) : (
                                                                                <TableRow>
                                                                                    <TableCell colSpan={4} align="center" sx={{ py: 2 }}>
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
                                                No students found in <b>{submitted.hostel}</b>.
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
