import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MuiAppBar from "@mui/material/AppBar";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import HistoryIcon from "@mui/icons-material/History";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GavelIcon from "@mui/icons-material/Gavel";
import { Notifications } from "@mui/icons-material";

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

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const pathname = usePathname();

  const menuData = [
    { name: "Profile", icon: <PersonIcon />, link: "/user/userProfile", isShow: true },
    { name: "History", icon: <HistoryIcon />, link: "/user/userHistory", isShow: true },
    { name: "Add entry", icon: <AddCircleOutlineIcon />, link: "/user/userAddEntry", isShow: true },
    { name: "Scan Entry", icon: <AddCircleOutlineIcon />, link: "/staff/staffScanEntry", isShow: true },
    { name: "Scan Entry", icon: <AddCircleOutlineIcon />, link: "/staff/staffOrder", isShow: true },
    // { name: "Compliant", icon: <GavelIcon />, link: "/categories", isShow: true },
  ];

  // Light sidebar colors
  const drawerColor = "#f3f4f6"; // Light gray background
  const textColor = "#1f2937"; // Dark text/icons
  const activeItemColor = "#3b82f6"; // Blue for active item

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleMenuItemClick = (link: string) => {
    if (pathname !== link) router.push(link);
    if (isMobile) setOpen(false);
  };

  // Get active menu item based on pathname
  const activeMenuItem = menuData.find((item) => pathname.startsWith(item.link));

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
                        ? "linear-gradient(135deg, #06b6d4, #3b82f6)" // ✅ keep same for active
                        : "rgba(6, 182, 212, 0.1)", // ✅ only hover for non-active
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

              {/* ✅ Dynamic Title with Icon */}
              <Box display="flex" alignItems="center" gap={1}>
                {activeMenuItem?.icon}
                <Typography variant="h6" fontWeight="bold">
                  {activeMenuItem?.name || "Laundry Dashboard"}
                </Typography>
              </Box>
            </Box>

            {/* Right Section */}
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body1">{'Shreeval Paladiya'}</Typography>
              <Avatar sx={{ bgcolor: "#facc15" }}>{'Shreeval'.charAt(0)}</Avatar>
              <Tooltip title="Notifications">
                <IconButton color="inherit">
                  <Notifications />
                </IconButton>
              </Tooltip>
              <IconButton
                onClick={() => {
                  localStorage.clear();
                  router.push("/login");
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
            borderRight: "1px solid #374151", // ✅ dark gray border
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
            borderRight: "1px solid #374151", // ✅ dark gray border
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
    </Box>
  );
}
