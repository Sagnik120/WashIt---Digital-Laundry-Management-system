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
import RefreshIcon from "@mui/icons-material/Refresh";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ClearIcon from "@mui/icons-material/Clear";
import SecurityIcon from "@mui/icons-material/Security";
import { useDispatch } from "react-redux";
import useSnackBar from "@/Redux/hooks/useSnackBar";
import ErrorHandler from "@/lib/errorHandler";
import { BaseUrl } from "@/ApiSetUp/AuthApi";
import { staffCodeCreate, staffCodeDetails } from "@/Redux/Actions/AuthUser";

type StaffRow = {
    id: string;
    name: string;
    code: string;
    isActive: boolean;
};

const genCode = () =>
    `STF-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

function getAuthToken() {
    return localStorage.getItem("token") || localStorage.getItem("authToken") || "";
}
function authHeaders() {
    const token = getAuthToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
}

export default function StaffConfigPage() {
    const dispatch = useDispatch();
    const { setSnackBar } = useSnackBar();

    const [rows, setRows] = useState<StaffRow[]>([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
    const [refreshFlag, setRefreshFlag] = useState(0);

    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();
        return rows.filter((r) => {
            const okSearch = !s || r.name.toLowerCase().includes(s) || r.code.toLowerCase().includes(s);
            const okStatus = statusFilter === "All" || (statusFilter === "Active" ? r.isActive : !r.isActive);
            return okSearch && okStatus;
        });
    }, [rows, search, statusFilter]);

    // Dialog
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<StaffRow | null>(null);
    const [form, setForm] = useState<Omit<StaffRow, "id">>({ name: "", code: genCode(), isActive: true });

    const openCreate = () => {
        setEditing(null);
        setForm({ name: "", code: genCode(), isActive: true });
        setOpen(true);
    };

    const openEdit = (row: StaffRow) => {
        setEditing(row);
        setForm({ name: row.name, code: row.code, isActive: row.isActive });
        setOpen(true);
    };

    // ensure code uniqueness in current list
    const uniqueCode = (list: StaffRow[]) => {
        const codes = new Set(list.map((x) => x.code));
        let c = genCode();
        while (codes.has(c)) c = genCode();
        return c;
    };

    const regenerate = () => setForm((f) => ({ ...f, code: uniqueCode(rows) }));
    const copy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setSnackBar("success", "Copied to clipboard");
        } catch {
            setSnackBar("error", "Copy failed");
        }
    };

    // confirm delete
    const [confirm, setConfirm] = useState<{ open: boolean; code: string | null }>({ open: false, code: null });
    const requestDelete = (code: string) => setConfirm({ open: true, code });

    // Delete uses manual fetch to BaseUrl + route with token header
    const doDelete = async () => {
        if (!confirm.code) return;
        try {
            setLoading(true);
            const url = `${BaseUrl}/api/admin/staff-codes/${confirm.code}`;
            const res = await fetch(url, { method: "DELETE", headers: authHeaders() });
            if (!res.ok) {
                let text = `${res.status}`;
                try {
                    const j = await res.json();
                    text = j?.message || JSON.stringify(j);
                } catch { }
                throw new Error(`Delete failed ${text}`);
            }
            setRows((p) => p.filter((r) => r.id !== confirm.code));
            setSnackBar("success", "Staff deleted");
            setConfirm({ open: false, code: null });
            loadStaff();
        } catch (err: any) {
            console.error(err);
            setSnackBar("error", err.message || "Failed to delete staff");
        } finally {
            setLoading(false);
        }
    };

    // save -> create via dispatch(staffCreate) OR update via PUT manual call
    const save = async () => {
        if (!form.name.trim() || !form.code.trim()) {
            setSnackBar("warning", "Please provide name and code");
            return;
        }

        if (editing) {
            // update via PUT
            try {
                setLoading(true);
                const payload = { staffNameHint: form.name, code: form.code, status: form.isActive ? "ACTIVE" : "INACTIVE" };
                const url = `${BaseUrl}/api/admin/staff-codes/${editing.code}`;
                const res = await fetch(url, { method: "PUT", headers: authHeaders(), body: JSON.stringify(payload) });
                if (!res.ok) {
                    let text = `${res.status}`;
                    try {
                        const j = await res.json();
                        text = j?.message || JSON.stringify(j);
                    } catch { }
                    throw new Error(`Update failed ${text}`);
                }
                setRows((prev) => prev.map((r) => (r.code === editing.code ? { ...r, name: form.name, code: form.code, isActive: form.isActive } : r)));
                setSnackBar("success", "Staff updated");
                setOpen(false);
            } catch (err: any) {
                console.error(err);
                setSnackBar("error", err.message || "Failed to update staff");
            } finally {
                setLoading(false);
            }
        } else {
            // create via dispatch action
            try {
                setLoading(true);
                // payload structure depends on your backend — this matches the sample staff object shape
                const payload: any = { staffNameHint: form.name, code: form.code, status: form.isActive ? "ACTIVE" : "INACTIVE" };
                const res: any = await dispatch(staffCodeCreate(payload));
                const ok = ErrorHandler(res, setSnackBar);
                if (ok) {
                    const created = res?.payload ?? res?.data ?? null;
                    if (created && created.id) {
                        setRows((prev) => [{ id: created.id, name: created.staffProfile?.fullName || created.email || form.name, code: created.staffProfile?.staffCodeValue || form.code, isActive: created.isActive ?? (form.isActive) }, ...prev]);
                    } else {
                        // fallback: refetch list
                        setRefreshFlag((f) => f + 1);
                    }
                    setSnackBar("success", "Staff created");
                    setOpen(false);
                }
            } catch (err: any) {
                console.error(err);
                setSnackBar("error", err.message || "Failed to create staff");
            } finally {
                setLoading(false);
            }
        }
    };

    const loadStaff = async () => {
        setLoading(true);
        try {
            const payload: any = { status: statusFilter === "All" ? undefined : statusFilter === "Active" ? "ACTIVE" : "INACTIVE" };
            const res: any = await dispatch(staffCodeDetails(payload));
            const ok = ErrorHandler(res, setSnackBar);
            if (ok) {
                const data = res?.payload ?? res;
                const arr = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []);
                const mapped: StaffRow[] = arr.map((s: any) => ({
                    id: s.id,
                    name: s?.staffNameHint ?? "—",
                    code: s?.code ?? s.code ?? genCode(),
                    isActive: s?.status === "ACTIVE",
                }));
                setRows(mapped);
            }
        } catch (err: any) {
            console.error(err);
            setSnackBar("error", err.message || "Failed to load staff");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStaff();
    }, [statusFilter, refreshFlag]);

    return (
        <Card sx={{ borderRadius: 4, overflow: "hidden" }}>
            {/* Header / Filters */}
            <Box sx={{ p: 2, borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <SecurityIcon />
                    <Typography variant="h6" fontWeight={700}>Staff Codes</Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <TextField size="small" placeholder="Search name or code..." value={search} onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 220 }} />
                    <Select size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} sx={{ minWidth: 140 }}>
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                    {(search || statusFilter !== "All") && (
                        <Button size="small" variant="outlined" color="inherit" startIcon={<ClearIcon />} onClick={() => { setSearch(""); setStatusFilter("All"); }}>
                            Reset
                        </Button>
                    )}
                    <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setRefreshFlag((f) => f + 1)}>Refresh</Button>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Add Staff</Button>
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
                                                    setRows((prev) => prev.map((x) => (x.code === r.code ? { ...x, isActive: newVal } : x)));
                                                    try {
                                                        const payload = { staffNameHint: r.name, code: r.code, status: newVal ? "ACTIVE" : "INACTIVE" };
                                                        const url = `${BaseUrl}/api/admin/staff-codes/${r.code}`;
                                                        const res = await fetch(url, { method: "PUT", headers: authHeaders(), body: JSON.stringify(payload) });
                                                        if (!res.ok) {
                                                            let text = `${res.status}`;
                                                            try {
                                                                const j = await res.json();
                                                                text = j?.message || JSON.stringify(j);
                                                            } catch { }
                                                            throw new Error(`Update failed ${text}`);
                                                        }
                                                        setSnackBar("success", "Status updated");
                                                    } catch (err: any) {
                                                        console.error(err);
                                                        setSnackBar("error", err.message || "Failed to update status");
                                                        // revert
                                                        setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, isActive: !newVal } : x)));
                                                    }
                                                }}
                                            />
                                            <Typography variant="caption" color="text.secondary">{r.isActive ? "Active" : "Inactive"}</Typography>
                                        </Stack>
                                    </TableCell>

                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => openEdit(r)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton color="error" onClick={() => requestDelete(r.code)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>No staff found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>

            {/* Add/Edit Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editing ? "Edit Staff" : "Add Staff"}</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        <TextField label="Full Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} fullWidth />
                        <Stack direction="row" spacing={1} alignItems="center">
                            <TextField label="Staff Code" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} fullWidth />
                            <Tooltip title="Regenerate">
                                <IconButton onClick={regenerate}><RefreshIcon /></IconButton>
                            </Tooltip>
                            <Tooltip title="Copy">
                                <IconButton onClick={() => copy(form.code)}><ContentCopyIcon /></IconButton>
                            </Tooltip>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Switch checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
                            <Typography variant="body2">Active</Typography>
                        </Stack>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={save} disabled={loading} startIcon={loading ? <CircularProgress size={16} /> : null}>
                        {editing ? "Save Changes" : "Create Staff"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirm Delete */}
            <Dialog open={confirm.open} onClose={() => setConfirm({ open: false, code: null })}>
                <DialogTitle>Delete Staff</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" color="text.secondary">Are you sure you want to delete this staff record? This action cannot be undone.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirm({ open: false, code: null })}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={doDelete} disabled={loading}>{loading ? <CircularProgress size={16} /> : "Delete"}</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}
