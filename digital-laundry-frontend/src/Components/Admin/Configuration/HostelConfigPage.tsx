"use client";
import React, { useMemo, useState, useEffect } from "react";
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
    CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ClearIcon from "@mui/icons-material/Clear";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import { useDispatch } from "react-redux";
import useSnackBar from "@/Redux/hooks/useSnackBar";
import ErrorHandler from "@/lib/errorHandler";
import { hostelCreate, hostelDetails } from "@/Redux/Actions/AuthUser";
import { BaseUrl } from "@/ApiSetUp/AuthApi";

type HostelRow = {
    id: string;
    name: string;
    code: string;
    isActive: boolean;
};

function getAuthToken() {
    return localStorage.getItem("token") || localStorage.getItem("authToken") || "";
}

function authHeaders() {
    const token = getAuthToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
}

export default function HostelConfigPage() {
    const dispatch = useDispatch();
    const { setSnackBar } = useSnackBar();

    const [rows, setRows] = useState<HostelRow[]>([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");

    const [refreshFlag, setRefreshFlag] = useState(0);

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
    const [form, setForm] = useState<{ name: string; code: string; isActive: boolean }>({ name: "", code: '', isActive: true });

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

    // Confirm delete
    const [confirm, setConfirm] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
    const requestDelete = (id: string) => setConfirm({ open: true, id });

    const doDelete = async () => {
        if (!confirm.id) return;
        try {
            setLoading(true);
            const url = `${BaseUrl}/api/admin/hostels/${confirm.id}`;
            const res = await fetch(url, {
                method: "DELETE",
                headers: authHeaders(),
            });
            if (!res.ok) {
                // try to parse error body for message
                let text = `${res.status}`;
                try { const j = await res.json(); text = j?.message || JSON.stringify(j); } catch { }
                throw new Error(`Delete failed ${text}`);
            }
            setSnackBar("success", "Hostel deleted");
            setRows(prev => prev.filter(r => r.id !== confirm.id));
            setConfirm({ open: false, id: null });
        } catch (err: any) {
            console.error(err);
            setSnackBar("error", err.message || "Failed to delete hostel");
        } finally {
            setLoading(false);
        }
    };

    // copy
    const copy = async (text: string) => { try { await navigator.clipboard.writeText(text); setSnackBar("success", "Copied to clipboard"); } catch { setSnackBar("error", "Copy failed"); } };

    // save -> create (dispatch) or update (manual PUT)
    const save = async () => {
        if (!form.name.trim() || !form.code.trim()) {
            setSnackBar("warning", "Please provide name and code");
            return;
        }

        if (editing) {
            // update via PUT /api/admin/hostels/:id (use API_BASE + auth header)
            try {
                setLoading(true);
                const payload = { hostelName: form.name, hostelCode: form.code, status: form.isActive ? "ACTIVE" : "INACTIVE" };
                const url = `${BaseUrl}/api/admin/hostels/${editing.id}`;
                const res = await fetch(url, {
                    method: "PUT",
                    headers: authHeaders(),
                    body: JSON.stringify(payload),
                });
                if (!res.ok) {
                    let text = `${res.status}`;
                    try { const j = await res.json(); text = j?.message || JSON.stringify(j); } catch { }
                    throw new Error(`Update failed ${text}`);
                }
                // optimistic update
                setRows(prev => prev.map(r => r.id === editing.id ? { ...r, name: form.name, code: form.code, isActive: form.isActive } : r));
                setSnackBar("success", "Hostel updated");
                setOpen(false);
            } catch (err: any) {
                console.error(err);
                setSnackBar("error", err.message || "Failed to update hostel");
            } finally {
                setLoading(false);
            }
        } else {
            try {
                setLoading(true);
                const payload: any = { hostelName: form.name, hostelCode: form.code, status: form.isActive ? "ACTIVE" : "INACTIVE" };
                const res: any = await dispatch(hostelCreate(payload));
                const ok = ErrorHandler(res, setSnackBar);
                if (ok) {
                    // backend may return created object in res.payload
                    const created = res?.payload ?? res?.data ?? null;
                    if (created && created.id) {
                        setRows(prev => [{ id: created.id, name: created.hostelName || form.name, code: created.hostelCode || form.code, isActive: (created.status || "ACTIVE") === "ACTIVE" }, ...prev]);
                    } else {
                        // fallback: refetch
                        setRefreshFlag(f => f + 1);
                    }
                    setSnackBar("success", "Hostel created");
                    setOpen(false);
                }
            } catch (err: any) {
                console.error(err);
                setSnackBar("error", err.message || "Failed to create hostel");
            } finally {
                setLoading(false);
            }
        }
    };

    // load list (dispatch hostelDetails)
    const loadHostels = async () => {
        setLoading(true);
        try {
            const payload: any = { status: statusFilter === "All" ? undefined : statusFilter === "Active" ? "ACTIVE" : "INACTIVE" };
            const res: any = await dispatch(hostelDetails(payload));
            const ok = ErrorHandler(res, setSnackBar);
            if (ok) {
                // res.payload or res.payload.data might be the array
                const data = res?.payload ?? res?.payload?.data ?? res?.data ?? res;
                const arr = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []);
                const mapped = arr.map((h: any) => ({ id: h.id, name: h.hostelName, code: h.hostelCode, isActive: h.status === "ACTIVE" } as HostelRow));
                setRows(mapped);
            }
        } catch (err: any) {
            console.error(err);
            setSnackBar("error", err.message || "Failed to load hostels");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHostels();
        // refresh when filter or external refreshFlag changes
    }, [statusFilter, refreshFlag]);

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

                    <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setRefreshFlag(f => f + 1)}>
                        Refresh
                    </Button>

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
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : filtered.length ? (
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
                                                onChange={async (e) => {
                                                    const newVal = e.target.checked;
                                                    // optimistic update
                                                    setRows(prev => prev.map(x => x.id === r.id ? { ...x, isActive: newVal } : x));
                                                    try {
                                                        const payload = { hostelName: r.name, hostelCode: r.code, status: newVal ? "ACTIVE" : "INACTIVE" };
                                                        const url = `${BaseUrl}/api/admin/hostels/${r.id}`;
                                                        const res = await fetch(url, {
                                                            method: "PUT",
                                                            headers: authHeaders(),
                                                            body: JSON.stringify(payload),
                                                        });
                                                        if (!res.ok) {
                                                            let text = `${res.status}`;
                                                            try { const j = await res.json(); text = j?.message || JSON.stringify(j); } catch { }
                                                            throw new Error(`Update failed ${text}`);
                                                        }
                                                        setSnackBar("success", "Status updated");
                                                    } catch (err: any) {
                                                        console.error(err);
                                                        setSnackBar("error", err.message || "Failed to update status");
                                                        // revert
                                                        setRows(prev => prev.map(x => x.id === r.id ? { ...x, isActive: !newVal } : x));
                                                    }
                                                }}
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
                    <Button variant="contained" onClick={save} disabled={loading} startIcon={loading ? <CircularProgress size={16} /> : null}>
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
                    <Button color="error" variant="contained" onClick={doDelete} disabled={loading}>{loading ? <CircularProgress size={16} /> : "Delete"}</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}
