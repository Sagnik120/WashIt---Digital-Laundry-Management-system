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
  const [role, setRole] = useState<string>("student");
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const pathname = usePathname();

  const menuData = [
    { name: "Profile", icon: <PersonIcon />, link: "/user/userProfile", isShow: role === "student" },
    { name: "Add entry", icon: <AddCircleOutlineIcon />, link: "/user/userAddEntry", isShow: role === "student" },
    { name: "History", icon: <HistoryIcon />, link: "/user/userHistory", isShow: role === "student" },
    { name: "Complaints", icon: <ReportProblemIcon />, link: "/user/userComplaint", isShow: role === "student" },
    { name: "Scan Entry", icon: <QrCodeScannerIcon />, link: "/staff/staffScanEntry", isShow: role === "staff" },
    { name: "Manage Orders", icon: <ListAltIcon />, link: "/staff/staffOrder", isShow: role === "staff" },
    { name: "Manage Complaints", icon: <FeedbackIcon />, link: "/staff/staffComplaint", isShow: role === "staff"},
    { name: "Admin Setup", icon: <AdminPanelSettingsIcon />, link: "/admin/configuration", isShow: role === "admin" },
    { name: "Order Lookup", icon: <ListAltIcon />, link: "/admin/allOrdersEntry", isShow: role === "admin" },
    { name: "All Complaints", icon: <ReportProblemIcon />, link: "/admin/allComplaint", isShow: role === "admin" }
  ];

  // useEffect(() => {
  //   const r = localStorage.getItem("role") || "";
  //   setRole(r);
  // }, []);

  // Light sidebar colors
  const drawerColor = "#f3f4f6";
  const textColor = "#1f2937";
  const activeItemColor = "#3b82f6";

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

  // ----------------- Mock data (swap with API) -----------------
  // Student sees pending & resolved orders
  const studentPending = [
    { id: "LDR-2025-0042", date: "2025-11-02", items: 4, status: "Pending" },
    { id: "LDR-2025-0045", date: "2025-11-04", items: 2, status: "Pending" },
  ];
  const studentResolved = [
    { id: "LDR-2025-0031", date: "2025-10-29", items: 5, status: "Completed" },
  ];

  // Staff sees open complaints
  const staffOpenComplaints = [
    { id: "CMP-24017", title: "Washed shirt shrank", order: "LDR-2025-0040", time: "Today 10:15", status: "Open" },
    { id: "CMP-24018", title: "Missing socks", order: "LDR-2025-0041", time: "Today 09:05", status: "Open" },
  ];

  const badgeCount = useMemo(() => {
    if (role === "staff") return staffOpenComplaints.length;
    // student
    return studentPending.length + studentResolved.length;
  }, [role]);

  // Chip styles
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

  // Drawer content
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
              <Tooltip title="Notifications">
                <IconButton color="inherit" onClick={openNoti}>
                  <Badge badgeContent={badgeCount} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Avatar sx={{ bgcolor: "#facc15" }}>S</Avatar>

              <IconButton
                onClick={() => {
                  localStorage.clear();
                  router.push("/auth/login");
                }}
                sx={{ color: "#fff" }}
              >
                <LogoutIcon />
              </IconButton>
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
          {role === "staff" ? (
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
          {role !== "staff" && tab === 0 && (
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
                        router.push("/user/userHistory");
                        closeNoti();
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
          {role !== "staff" && tab === 1 && (
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
                        router.push("/user/userHistory");
                        closeNoti();
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
          {role === "staff" && tab === 0 && (
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
                        router.push("/user/userComplaint");
                        closeNoti();
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
