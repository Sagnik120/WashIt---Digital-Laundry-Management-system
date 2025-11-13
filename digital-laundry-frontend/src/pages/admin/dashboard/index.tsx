"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Stack,
    Avatar,
    Chip,
    Button,
    TextField,
    MenuItem,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    LinearProgress,
    Tabs,
    Tab,
    Pagination,
    FormControl,
    Select,
    InputLabel,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import useSnackBar from "@/Redux/hooks/useSnackBar";
import ErrorHandler from "@/lib/errorHandler";
import { staffList, studentList } from "@/Redux/Actions/AuthUser";
import usePageLoader from "@/Redux/hooks/usePageLoader";

type Role = "student" | "staff";
interface UserSummary {
    id: string;
    email: string;
}

interface DashboardCounts {
    students: number;
    staff: number;
}

export default function AdminDashboard() {
    const dispatch = useDispatch();
    const { setSnackBar } = useSnackBar();
    const setFullPageLoader = usePageLoader();

    // --- state ---
    const [students, setStudents] = useState<UserSummary[]>([]);
    const [staff, setStaff] = useState<UserSummary[]>([]);

    const [studentsTotal, setStudentsTotal] = useState<number>(0);
    const [staffTotal, setStaffTotal] = useState<number>(0);

    const [counts, setCounts] = useState<DashboardCounts>({
        students: 0,
        staff: 0,
    });


    const [search, setSearch] = useState("");
    const [tab, setTab] = useState<number>(0); // 0: Students, 1: Staff
    const [hostelCode, setHostelCode] = useState<string>("");

    const [page, setPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(8);

    const [loading, setLoading] = useState<boolean>(false);
    const abortRef = useRef<AbortController | null>(null);

    const filteredStudents = useMemo(() => {
        const q = search.trim().toLowerCase();
        return students.filter((u) => {
            if (q === "") return true;
            return (
                u.email.toLowerCase().includes(q) ||
                u.id.toLowerCase().includes(q)
            );
        });
    }, [students, search]);

    const filteredStaff = useMemo(() => {
        const q = search.trim().toLowerCase();
        return staff.filter((u) => {
            if (q === "") return true;
            return (
                u.email.toLowerCase().includes(q) ||
                u.id.toLowerCase().includes(q)
            );
        });
    }, [staff, search]);

    const effectivePageSize = rowsPerPage === 0 ? 1000000 : rowsPerPage;

    const pageCount = Math.max(1, Math.ceil((tab === 0 ? studentsTotal : staffTotal) / (rowsPerPage === 0 ? (tab === 0 ? studentsTotal || 1 : staffTotal || 1) : rowsPerPage)));

    const paginatedUsers = useMemo(() => {
        const list = tab === 0 ? filteredStudents : filteredStaff;
        if (rowsPerPage === 0) return list;
        return list.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    }, [filteredStudents, filteredStaff, tab, page, rowsPerPage]);

    // ---------- New: dispatch-based fetch functions ----------
    const fetchStudents = async (opts?: { page?: number; pageSize?: number; q?: string }) => {
        const p = opts?.page ?? page;
        const ps = opts?.pageSize ?? rowsPerPage;
        const q = opts?.q ?? search;
        setFullPageLoader(true);
        setLoading(true);
        try {
            const payload: any = { page: p, pageSize: ps };
            if (q) payload.q = q;

            const res: any = await dispatch(studentList(payload));
            const ok = ErrorHandler(res, setSnackBar);
            if (ok) {
                const data = res?.payload?.data ?? res?.payload ?? res?.data ?? [];
                const mapped: UserSummary[] = (data || []).map((item: any) => {
                    const user = item.user || {};
                    const profile = item.studentProfile || {};
                    return {
                        id: user.id || "",
                        email: user.email || "",
                    } as UserSummary;
                });

                setStudents(mapped);
                const total = res?.payload?.total ?? res?.total ?? mapped.length;
                setStudentsTotal(total ?? mapped.length);
                setCounts((c) => ({ ...c, students: total ?? mapped.length }));
            }
        } catch (err: any) {
            console.error(err);
            setSnackBar("error", err.message || "Something went wrong while fetching students");
        } finally {
            setFullPageLoader(false);
            setLoading(false);
        }
    };

    const fetchStaff = async (opts?: { page?: number; pageSize?: number; q?: string }) => {
        const p = opts?.page ?? page;
        const ps = opts?.pageSize ?? rowsPerPage;
        const q = opts?.q ?? search;
        setFullPageLoader(true);
        setLoading(true);
        try {
            const payload: any = { page: p, pageSize: ps };
            if (q) payload.q = q;

            const res: any = await dispatch(staffList(payload));
            const ok = ErrorHandler(res, setSnackBar);
            if (ok) {
                const data = res?.payload?.data ?? res?.payload ?? res?.data ?? [];
                const mapped: UserSummary[] = (data || []).map((item: any) => {
                    const profile = item.staffProfile || {};
                    return {
                        id: item.id || "",
                        email: item.email || "",
                    } as UserSummary;
                });

                setStaff(mapped);
                const total = res?.payload?.total ?? res?.total ?? mapped.length;
                setStaffTotal(total ?? mapped.length);
                setCounts((c) => ({ ...c, staff: total ?? mapped.length }));
            }
        } catch (err: any) {
            console.error(err);
            setSnackBar("error", err.message || "Something went wrong while fetching staff");
        } finally {
            setFullPageLoader(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tab === 0) {
            fetchStudents({ page, pageSize: rowsPerPage === 0 ? Math.max(1, studentsTotal || 10) : rowsPerPage, q: search });
        } else {
            fetchStaff({ page, pageSize: rowsPerPage === 0 ? Math.max(1, staffTotal || 10) : rowsPerPage, q: search });
        }
    }, [tab, page, rowsPerPage]);

    useEffect(() => {
        const t = setTimeout(() => {
            setPage(1);
            if (tab === 0) fetchStudents({ page: 1, pageSize: rowsPerPage === 0 ? Math.max(1, studentsTotal || 10) : rowsPerPage, q: search });
            else fetchStaff({ page: 1, pageSize: rowsPerPage === 0 ? Math.max(1, staffTotal || 10) : rowsPerPage, q: search });
        }, 350);
        return () => clearTimeout(t);
    }, [search]);

    const exportCsv = () => {
        const list = tab === 0 ? students : staff;
        const header = ["ID", "Email"];
        const rows = list.map((u) => [u.id, u.email || "-"]);
        const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `admin-users-${tab === 0 ? "students" : "staff"}-${new Date().toISOString()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        setPage(1);
    }, [rowsPerPage]);

    useEffect(() => {
        fetchStudents();
        fetchStaff();
    }, [])

    return (
        <Box sx={{ px: { xs: 2, md: 4 }, py: 3, minHeight: "82vh", background: "linear-gradient(135deg,#eaf8ff,#f7fff7)" }}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
                🧭 Admin Dashboard
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={3}>
                Overview of students & staff. Data is fetched from your API endpoints.
            </Typography>

            {/* TOP METRICS */}
            <Grid container spacing={3} mb={2}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 3, p: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar sx={{ bgcolor: "#2563eb" }}>
                                <PeopleIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Students</Typography>
                                <Typography variant="h5" fontWeight={800}>{counts.students}</Typography>
                                <Typography variant="caption" color="text.secondary">Total staff users</Typography>
                            </Box>
                        </Stack>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 3, p: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar sx={{ bgcolor: "#059669" }}>
                                <SupervisorAccountIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Staff</Typography>
                                <Typography variant="h5" fontWeight={800}>{counts.staff}</Typography>
                                <Typography variant="caption" color="text.secondary">Total staff users</Typography>
                            </Box>
                        </Stack>
                    </Card>
                </Grid>

            </Grid>

            {/* Users table with tabs, filters, pagination */}
            <Card sx={{ borderRadius: 3, p: 2 }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" fontWeight={700}>Users</Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <TextField size="small" placeholder="Search by name / email / id" value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }} sx={{ minWidth: 220 }} />

                        <Tooltip title="Export currently fetched users">
                            <IconButton onClick={exportCsv}><DownloadIcon /></IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                {/* Tabs to switch between Students / Staff */}
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                    <Tab label={`Students (${studentsTotal})`} />
                    <Tab label={`Staff (${staffTotal})`} />
                </Tabs>

                {/* loading indicator */}
                {loading && <LinearProgress />}

                {/* table */}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Email</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedUsers.map((u) => (
                            <TableRow key={u.id} hover>
                                <TableCell>{u.id}</TableCell>
                                <TableCell>{u.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* pagination controls */}
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="caption">Rows per page:</Typography>
                        <TextField
                            select
                            size="small"
                            value={rowsPerPage}
                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                            sx={{ width: 120 }}
                        >
                            {[5, 8, 10, 15, 20].map((s) => (
                                <MenuItem key={s} value={s}>{s}</MenuItem>
                            ))}
                            <MenuItem value={0}>All</MenuItem>
                        </TextField>
                    </Stack>

                    <Pagination count={pageCount} page={page} onChange={(_, v) => setPage(v)} color="primary" />
                </Stack>

            </Card>
        </Box>
    );
}
