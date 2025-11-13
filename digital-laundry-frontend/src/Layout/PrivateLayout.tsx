"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  CssBaseline,
  Divider,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useMediaQuery,
  IconButton,
  Toolbar,
  Avatar,
  Typography,
  Badge,
  Popover,
  Tabs,
  Tab,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MuiAppBar from "@mui/material/AppBar";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import HistoryIcon from "@mui/icons-material/History";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Notifications } from "@mui/icons-material";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FeedbackIcon from "@mui/icons-material/Feedback";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import cookieUtils from "@/ApiSetUp/CookieUtils";

import { useDispatch } from "react-redux";
import { notificationData } from "@/Redux/Actions/AuthUser";
import ErrorHandler from "@/lib/errorHandler";
import { BaseUrl } from "@/ApiSetUp/AuthApi";

const drawerWidth = 300;

interface AppBarProps {
  open?: boolean;
}

// Drawer Styling
const openedMixin = (theme: any) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: any) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  "& .MuiListItemIcon-root": {
    width: 24,
    height: 24,
    justifyContent: "center",
    minWidth: 24,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  minHeight: "64px",
  maxHeight: "64px",
  position: "relative",
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  width: "100%",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    [theme.breakpoints.up("md")]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
    },
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }: any) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      borderRight: "none",
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      borderRight: "none",
    },
  }),
}));

export default function PrivateLayout({ children }: any) {
  const theme = useTheme();
  const [open, setOpen] = useState<any>(false);
  const [role, setRole] = useState<string>("");
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const menuData = [
    { name: "Profile", icon: <PersonIcon />, link: "/user/userProfile", isShow: role === "STUDENT" },
    { name: "Add entry", icon: <AddCircleOutlineIcon />, link: "/user/userAddEntry", isShow: role === "STUDENT" },
    { name: "History", icon: <HistoryIcon />, link: "/user/userHistory", isShow: role === "STUDENT" },
    { name: "Complaints", icon: <ReportProblemIcon />, link: "/user/userComplaint", isShow: role === "STUDENT" },
    { name: "Scan Entry", icon: <QrCodeScannerIcon />, link: "/staff/staffScanEntry", isShow: role === "STAFF" },
    { name: "Manage Orders", icon: <ListAltIcon />, link: "/staff/staffOrder", isShow: role === "STAFF" },
    { name: "Manage Complaints", icon: <FeedbackIcon />, link: "/staff/staffComplaint", isShow: role === "STAFF" },
    { name: "Admin Dashboard", icon: <DashboardIcon />, link: "/admin/dashboard", isShow: role === "ADMIN" },
    { name: "Admin Setup", icon: <AdminPanelSettingsIcon />, link: "/admin/configuration", isShow: role === "ADMIN" },
    { name: "Order Lookup", icon: <ListAltIcon />, link: "/admin/allOrdersEntry", isShow: role === "ADMIN" },
    { name: "All Complaints", icon: <ReportProblemIcon />, link: "/admin/allComplaint", isShow: role === "ADMIN" },
  ];

  useEffect(() => {
    const r = localStorage.getItem("role") || "";
    setRole(r);
  }, []);

  // Light sidebar colors
  const drawerColor = "#f3f4f6";
  const textColor = "#1f2937";

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleMenuItemClick = (link: string) => {
    if (pathname !== link) router.push(link);
    if (isMobile) setOpen(false);
  };

  const activeMenuItem = menuData.find((item) => pathname.startsWith(item.link));

  // ----------------- Notifications popover state -----------------
  const [notiAnchor, setNotiAnchor] = useState<HTMLElement | null>(null);
  const notiOpen = Boolean(notiAnchor);
  const openNoti = (e: React.MouseEvent<HTMLElement>) => setNotiAnchor(e.currentTarget);
  const closeNoti = () => setNotiAnchor(null);
  const [tab, setTab] = useState(0);
  const [data, setData] = useState<any>("");

  // ----------------- Notifications from API -----------------
  const [notifications, setNotifications] = useState<
    {
      id: string;
      type: string;
      payload: any;
      isRead: boolean;
      createdAt: string | null;
      raw?: any;
    }[]
  >([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // ----------------- Load notifications via action (matches your provided shape) -----------------
  const loadNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const payload: any = { page: 1, pageSize: 200 };
      // @ts-ignore
      const res: any = await dispatch(notificationData(payload));
      const ok = ErrorHandler(res, () => { });
      // parse response body robustly
      const body = res?.payload ?? res?.data ?? res ?? null;
      let arr: any[] = [];

      if (Array.isArray(body)) arr = body;
      else if (Array.isArray(body?.data)) arr = body.data;
      else if (Array.isArray(body?.notifications)) arr = body.notifications;
      else arr = [];

      const mapped = arr
        .filter((n: any) => !n?.isRead) 
        .map((n: any) => ({
          id: String(n.id),
          type: String(n.type ?? "").toUpperCase(),
          payload: n.payload ?? {},
          isRead: Boolean(n.isRead),
          createdAt: n.createdAt ?? n.created_at ?? null,
          raw: n,
        }));

      setNotifications(mapped);
    } catch (err: any) {
      console.error("loadNotifications error:", err);
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("userData");
      if (raw) {
        const parsed = JSON.parse(raw);
        setData(parsed);
      }
    } catch (e) {
      // ignore
    }

    // load notifications on mount
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // MARK AS READ API call
  const markNotificationRead = async (notificationId: string) => {
    if (!notificationId) return;
    try {
      // optimistically update UI after successful API call
      const token = cookieUtils.getCookie?.("token") ?? null;

      const url =
        (`${BaseUrl}`) + `/api/notifications/${notificationId}/read`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({}), // keep body empty unless backend expects something
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("markNotificationRead failed:", res.status, errText);
        // try reading JSON error
        try {
          const json = JSON.parse(errText);
          ErrorHandler(json, () => { });
        } catch {
          // ignore
        }
        return false;
      }

      loadNotifications();
      return true;
    } catch (err: any) {
      console.error("markNotificationRead error:", err);
      return false;
    }
  };

  // helper used by View buttons to mark read then navigate
  const handleViewNotification = async (notificationId: string, navigateTo: string) => {
    try {
      // call API to mark read (await so UI stays consistent)
      await markNotificationRead(notificationId);
    } catch (e) {
      // swallow - we still navigate even if marking fails
      console.error(e);
    } finally {
      if (navigateTo) router.push(navigateTo);
      closeNoti();
    }
  };

  // derive UI arrays from notifications (using the types you provided)
  const staffOpenComplaints = useMemo(() => {
    // show complaints that are in-review / opened
    return notifications
      .filter((n) => n.type.startsWith("COMPLAINT_") && (n.type === "COMPLAINT_IN_REVIEW" || n.type === "COMPLAINT_OPEN"))
      .map((n) => ({
        id: n.payload?.complaintId ?? n.id,
        title: n.raw?.title ?? `Complaint ${n.payload?.complaintId ?? n.id}`,
        order: n.raw?.payload?.orderId ?? "",
        time: n.createdAt ?? "",
        status: n.type === "COMPLAINT_IN_REVIEW" ? "In Review" : "Open",
        _notifId: n.id, // preserve notification id for marking read
      }));
  }, [notifications]);

  const studentPending = useMemo(() => {
    return notifications
      .filter((n) => n.type === "ORDER_PENDING")
      .map((n) => ({
        id: n.payload?.orderId ?? n.id,
        date: n.createdAt ?? "",
        items: n.raw?.payload?.items?.length ?? 0,
        status: "Pending",
        _notifId: n.id,
      }));
  }, [notifications]);

  const studentResolved = useMemo(() => {
    // server may send ORDER_COMPLETED or COMPLAINT_RESOLVED — include both to populate the "resolved" tab meaningfully
    return notifications
      .filter((n) => n.type === "ORDER_COMPLETED" || n.type === "COMPLAINT_RESOLVED")
      .map((n) => ({
        id: (n.payload?.orderId ?? n.payload?.complaintId) ?? n.id,
        date: n.createdAt ?? "",
        items: n.raw?.payload?.items?.length ?? 0,
        status: n.type === "ORDER_COMPLETED" ? "Completed" : "Resolved",
        _notifId: n.id,
      }));
  }, [notifications]);

  const badgeCount = useMemo(() => {
    if (String(role).toLowerCase() === "staff") return staffOpenComplaints.length;
    return studentPending.length + studentResolved.length;
  }, [role, staffOpenComplaints, studentPending, studentResolved]);

  // Chip styles kept same as before
  const chipFor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return { label: "Pending", sx: { bgcolor: "#f59e0b22", color: "#b45309", fontWeight: 700 } };
      case "completed":
      case "resolved":
        return { label: "Resolved", sx: { bgcolor: "#10b98122", color: "#065f46", fontWeight: 700 } };
      case "open":
        return { label: "Open", sx: { bgcolor: "#f59e0b22", color: "#b45309", fontWeight: 700 } };
      default:
        return { label: status, sx: { bgcolor: "#e5e7eb", color: "#374151", fontWeight: 700 } };
    }
  };

  // Drawer content (unchanged)
  const drawer = (
    <>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose} sx={{ color: textColor }}>
          {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>

      <Divider sx={{ borderColor: "rgba(31, 41, 55, 0.2)" }} />
      <List>
        {menuData?.filter((item: any) => item.isShow)?.map((item: any, index: any) => {
          const isActive = pathname.startsWith(item.link);
          return (
            <ListItem
              key={index}
              disablePadding
              sx={{ display: "block", my: 1, width: "100%", padding: 0 }}
              onClick={() => handleMenuItemClick(item.link)}
            >
              <Tooltip title={!open ? item.name : ""} placement="right">
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    background: isActive
                      ? "linear-gradient(135deg, #06b6d4, #3b82f6)"
                      : "transparent",
                    "&:hover": {
                      background: isActive
                        ? "linear-gradient(135deg, #06b6d4, #3b82f6)"
                        : "rgba(6, 182, 212, 0.1)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: isActive ? "#fff" : textColor,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    sx={{
                      opacity: open ? 1 : 0,
                      color: isActive ? "#fff" : textColor,
                      "& .MuiTypography-root": { fontSize: "16px", fontWeight: 500 },
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <CssBaseline />

      {/* Header */}
      <AppBar
        position="fixed"
        open={open}
        elevation={0}
        sx={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)", color: "#fff" }}
      >
        <Toolbar sx={{ minHeight: "64px !important", px: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            {/* Left Section */}
            <Box display="flex" alignItems="center" gap={3}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ ...(open && !isMobile && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>

              {/* Title + Icon */}
              <Box display="flex" alignItems="center" gap={1}>
                {activeMenuItem?.icon}
                <Typography variant="h6" fontWeight="bold">
                  {activeMenuItem?.name || "Laundry Dashboard"}
                </Typography>
              </Box>
            </Box>

            {/* Right Section */}
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body1">{""}</Typography>

              {/* Notifications with badge */}
              {role !== "ADMIN" && (
                <>
                  <Tooltip title="Notifications">
                    <IconButton color="inherit" onClick={openNoti}>
                      <Badge badgeContent={badgeCount} color="error">
                        <Notifications />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  <Avatar sx={{ bgcolor: "#facc15" }} src={data?.profile_picture}>
                    {!data?.profile_picture ? (data?.full_name?.trim()?.[0] || data?.email?.trim()?.[0] || "?").toUpperCase() : null}
                  </Avatar>
                </>
              )}
              <Tooltip title="Logout">
                <IconButton
                  onClick={() => {
                    localStorage.clear();
                    cookieUtils.removeCookie("token");
                    cookieUtils.removeCookie("userData");
                    router.push("/auth/login");
                  }}
                  sx={{ color: "#fff" }}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <MuiDrawer
        variant="temporary"
        open={open}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            background: drawerColor,
            borderRight: "1px solid #374151",
            boxShadow: "2px 0 6px rgba(0, 0, 0, 0.15)",
            color: textColor,
          },
        }}
      >
        {drawer}
      </MuiDrawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            background: drawerColor,
            color: textColor,
            width: open ? drawerWidth : `calc(${theme.spacing(8)} + 1px)`,
            borderRight: "1px solid #374151",
            boxShadow: "2px 0 6px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 7 },
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>

      {/* Notifications Popover */}
      <Popover
        open={notiOpen}
        anchorEl={notiAnchor}
        onClose={closeNoti}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            width: 380,
            maxWidth: "90vw",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(2,6,23,0.25)",
          },
        }}
      >
        <Box sx={{ p: 2, background: "linear-gradient(135deg,#06b6d4,#3b82f6)", color: "#fff" }}>
          <Typography variant="subtitle1" fontWeight={800}>
            Notifications
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            Stay on top of your updates
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          {role?.toLowerCase() === "staff" ? (
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
              <Tab label={`Open Complaints (${staffOpenComplaints.length})`} />
            </Tabs>
          ) : (
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
              <Tab label={`Pending Orders (${studentPending.length})`} />
              <Tab label={`Resolved Orders (${studentResolved.length})`} />
            </Tabs>
          )}
        </Box>

        {/* Tab Panels */}
        <Box sx={{ maxHeight: 360, overflowY: "auto", p: 1.5 }}>
          {/* Student: Pending */}
          {role?.toLowerCase() !== "staff" && tab === 0 && (
            <Stack spacing={1.25}>
              {studentPending.length === 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                  No pending orders.
                </Typography>
              )}
              {studentPending.map((o) => {
                const chip = chipFor("Pending");
                return (
                  <Box
                    key={o.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "#fff",
                      border: "1px solid #e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "#f0f9ff",
                        color: "#0284c7",
                      }}
                    >
                      <HourglassBottomIcon fontSize="small" />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={700}>
                        {o.id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {o.date} • {o.items} item{o.items > 1 ? "s" : ""}
                      </Typography>
                    </Box>
                    <Chip size="small" label={chip.label} sx={chip.sx} />
                    <Button
                      size="small"
                      onClick={() => {
                        // mark notification read then navigate to history
                        handleViewNotification(o._notifId ?? o.id, "/user/userHistory");
                      }}
                    >
                      View
                    </Button>
                  </Box>
                );
              })}
            </Stack>
          )}

          {/* Student: Resolved */}
          {role?.toLowerCase() !== "staff" && tab === 1 && (
            <Stack spacing={1.25}>
              {studentResolved.length === 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                  No resolved orders.
                </Typography>
              )}
              {studentResolved.map((o) => {
                const chip = chipFor("Resolved");
                return (
                  <Box
                    key={o.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "#fff",
                      border: "1px solid #e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "#ecfdf5",
                        color: "#16a34a",
                      }}
                    >
                      <CheckCircleIcon fontSize="small" />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={700}>
                        {o.id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {o.date} • {o.items} item{o.items > 1 ? "s" : ""}
                      </Typography>
                    </Box>
                    <Chip size="small" label={chip.label} sx={chip.sx} />
                    <Button
                      size="small"
                      onClick={() => {
                        handleViewNotification(o._notifId ?? o.id, "/user/userHistory");
                      }}
                    >
                      View
                    </Button>
                  </Box>
                );
              })}
            </Stack>
          )}

          {/* Staff: Open Complaints */}
          {role?.toLowerCase() === "staff" && tab === 0 && (
            <Stack spacing={1.25}>
              {staffOpenComplaints.length === 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                  No open complaints.
                </Typography>
              )}
              {staffOpenComplaints.map((c) => {
                const chip = chipFor("Open");
                return (
                  <Box
                    key={c.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "#fff",
                      border: "1px solid #e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "#fff7ed",
                        color: "#d97706",
                      }}
                    >
                      <ReportProblemIcon fontSize="small" />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={700} noWrap>
                        {c.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {c.id} • {c.order}
                      </Typography>
                    </Box>
                    <Chip size="small" label={chip.label} sx={chip.sx} />
                    <Button
                      size="small"
                      onClick={() => {
                        // mark complaint notification read then navigate to complaint list
                        handleViewNotification(c._notifId ?? c.id, "/user/userComplaint");
                      }}
                    >
                      View
                    </Button>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Box>
      </Popover>
    </Box>
  );
}
