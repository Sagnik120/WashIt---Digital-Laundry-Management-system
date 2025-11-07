"use client";
import React, { useMemo, useState } from "react";
import {
    Box,
    Card,
    Paper,
    Stack,
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Switch,
    Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ClearIcon from "@mui/icons-material/Clear";
import HomeWorkIcon from "@mui/icons-material/HomeWork";

type HostelRow = {
    id: string;
    name: string;
    code: string; 
    isActive: boolean;
};

export default function HostelConfigPage() {
    const [rows, setRows] = useState<HostelRow[]>([
        { id: "h1", name: "A-Block Hostel", code: "A-BLOCK", isActive: true },
        { id: "h2", name: "B-Block Hostel", code: "B-BLOCK", isActive: true },
        { id: "h3", name: "C-Block Hostel", code: "C-BLOCK", isActive: false },
    ]);

    // Filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");

    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();
        return rows.filter(r => {
            const okSearch = !s || r.name.toLowerCase().includes(s) || r.code.toLowerCase().includes(s);
            const okStatus = statusFilter === "All" || (statusFilter === "Active" ? r.isActive : !r.isActive);
            return okSearch && okStatus;
        });
    }, [rows, search, statusFilter]);

    // Dialog state
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<HostelRow | null>(null);
    const [form, setForm] = useState<Omit<HostelRow, "id">>({ name: "", code: '', isActive: true });

    const openCreate = () => {
        setEditing(null);
        setForm({ name: "", code: '', isActive: true });
        setOpen(true);
    };

    const openEdit = (row: HostelRow) => {
        setEditing(row);
        setForm({ name: row.name, code: row.code, isActive: row.isActive });
        setOpen(true);
    };

    const save = () => {
        if (!form.name.trim() || !form.code.trim()) return;
        if (editing) {
            setRows(prev => prev.map(r => (r.id === editing.id ? { ...editing, ...form } : r)));
        } else {
            setRows(prev => [...prev, { id: `h_${Date.now()}`, ...form }]);
        }
        setOpen(false);
    };

    const copy = async (text: string) => { try { await navigator.clipboard.writeText(text); } catch { } };

    const requestDelete = (id: string) => setConfirm({ open: true, id });
    const [confirm, setConfirm] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
    const doDelete = () => {
        if (!confirm.id) return;
        setRows(prev => prev.filter(r => r.id !== confirm.id));
        setConfirm({ open: false, id: null });
    };

    return (
        <Card sx={{ borderRadius: 4, overflow: "hidden" }}>
            {/* Header / Filters (right-top) */}
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
                <Stack direction="row" spacing={1} alignItems="center">
                    <HomeWorkIcon />
                    <Typography variant="h6" fontWeight={700}>Hostels</Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <TextField
                        size="small"
                        placeholder="Search name or code..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ minWidth: 220 }}
                    />
                    <Select
                        size="small"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        sx={{ minWidth: 140 }}
                    >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                    {(search || statusFilter !== "All") && (
                        <Button
                            size="small"
                            variant="outlined"
                            color="inherit"
                            startIcon={<ClearIcon />}
                            onClick={() => { setSearch(""); setStatusFilter("All"); }}
                        >
                            Reset
                        </Button>
                    )}
                    <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
                        Add Hostel
                    </Button>
                </Stack>
            </Box>

            <Paper elevation={0} sx={{ borderRadius: 0 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Code</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.length ? (
                            filtered.map((r) => (
                                <TableRow key={r.id} hover>
                                    <TableCell>{r.name}</TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Chip size="small" color="primary" label={r.code} />
                                            <Tooltip title="Copy">
                                                <IconButton size="small" onClick={() => copy(r.code)}>
                                                    <ContentCopyIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Switch
                                                checked={r.isActive}
                                                onChange={(e) =>
                                                    setRows(prev => prev.map(x => x.id === r.id ? { ...x, isActive: e.target.checked } : x))
                                                }
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {r.isActive ? "Active" : "Inactive"}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => openEdit(r)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton color="error" onClick={() => requestDelete(r.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                    No hostels found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>

            {/* Add/Edit Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editing ? "Edit Hostel" : "Add Hostel"}</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        <TextField
                            label="Hostel Name"
                            value={form.name}
                            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                            fullWidth
                        />
                        <Stack direction="row" spacing={1} alignItems="center">
                            <TextField
                                label="Hostel Code"
                                value={form.code}
                                onChange={(e) => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                                fullWidth
                            />
                            <Tooltip title="Copy">
                                <IconButton onClick={() => copy(form.code)}>
                                    <ContentCopyIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Switch
                                checked={form.isActive}
                                onChange={(e) => setForm(f => ({ ...f, isActive: e.target.checked }))}
                            />
                            <Typography variant="body2">Active</Typography>
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={save}>
                        {editing ? "Save Changes" : "Create Hostel"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirm Delete */}
            <Dialog open={confirm.open} onClose={() => setConfirm({ open: false, id: null })}>
                <DialogTitle>Delete Hostel</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" color="text.secondary">
                        Are you sure you want to delete this hostel? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirm({ open: false, id: null })}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={doDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}
