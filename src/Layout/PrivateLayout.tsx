import React, { useState, useEffect } from "react";
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
  Typography,
  useMediaQuery,
  IconButton,
  Toolbar,
} from "@mui/material";
import WarningOutlinedIcon from "@mui/icons-material/WarningOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MuiAppBar from "@mui/material/AppBar";
import ButtonOutlined from "@/Components/Common/ButtonOutlined";
import ButtonContained from "@/Components/Common/ButtonContained";
import BusinessIcon from "@mui/icons-material/Business";
import WebAssetIcon from "@mui/icons-material/WebAsset";
import LogoutIcon from "@mui/icons-material/Logout";
import CommonModal from "@/Components/Common/CommonModal";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SellIcon from "@mui/icons-material/Sell";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PagesIcon from "@mui/icons-material/Pages";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import PriceChangeIcon from "@mui/icons-material/PriceChange";

const drawerWidth = 300;

interface AppBarProps {
  open?: boolean;
}

// ========== Drawer Styling ==========
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

// ========== Component ==========
export default function PrivateLayout({ children }: any) {
  const theme = useTheme();
  const [open, setOpen] = useState<any>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [role, setRole] = useState<any>('staff');

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const pathname = usePathname();

  // Get role from localStorage
  // useEffect(() => {
  //   const storedRole = localStorage.getItem("role");
  //   setRole(storedRole);
  // }, []);

  const menuData = [
    { name: "Users", icon: <PeopleIcon />, link: "/users", isShow: true },
    { name: "Events", icon: <EventIcon />, link: "/events", isShow: true },
    {
      name: "Companies",
      icon: <BusinessIcon />,
      link: "/companies",
      isShow: true,
    },
    {
      name: "Categories",
      icon: <WebAssetIcon />,
      link: "/categories",
      isShow: true,
    },
    {
      name: "Benefits & Sponsor Level",
      icon: <LoyaltyIcon />,
      link: "/benefits-sponsor-level",
      isShow: true,
    },
    {
      name: "Sponsors",
      icon: <MonetizationOnIcon />,
      link: "/sponsors",
      isShow: true,
    },
    { name: "Tags", icon: <SellIcon />, link: "/tags", isShow: true },
    {
      name: "Coupon",
      icon: <ConfirmationNumberIcon />,
      link: "/coupon",
      isShow: true,
    },
    {
      name: "Landing Page",
      icon: <PagesIcon />,
      link: "/landing-page",
      isShow: true,
    },
    {
      name: "Subscriptions",
      icon: <SubscriptionsIcon />,
      link: "/subscriptions",
      isShow: true,
    },
    {
      name: "Pricing",
      icon: <PriceChangeIcon />,
      link: "/pricing",
      isShow: true,
    },
    {
      name: "Partners",
      icon: <PriceChangeIcon />,
      link: "/partners",
      isShow: true,
    },
  ];

  // Drawer Colors by role
  const getRoleGradient = () => {
    switch (role) {
      case "student":
        return "linear-gradient(180deg, #1e3a8a, #2563eb)"; // Blue
      case "staff":
        return "linear-gradient(180deg, #9333ea, #ec4899)"; // Purple-Pink
      case "admin":
        return "linear-gradient(180deg, #dc2626, #f97316)"; // Red-Orange
      default:
        return theme.palette.primary.main;
    }
  };

  const getHeaderGradient = () => {
    switch (role) {
      case "student":
        return "linear-gradient(90deg, #1e3a8a, #2563eb)";
      case "staff":
        return "linear-gradient(90deg, #9333ea, #ec4899)";
      case "admin":
        return "linear-gradient(90deg, #dc2626, #f97316)";
      default:
        return "#ffffff";
    }
  };

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleMenuItemClick = (link: string) => {
    if (pathname !== link) router.push(link);
    if (isMobile) setOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setDialogOpen(false);
    router.push("/login");
  };

  // Drawer content
  const drawer = (
    <>
      <DrawerHeader>
        {open && (
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Image
              src="/Assets/images/svg/Logo.svg"
              alt="Logo"
              width={100}
              height={35}
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Box>
        )}
        <IconButton onClick={handleDrawerClose} sx={{ color: "#ffffff" }}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.12)" }} />
      <List>
        {menuData
          .filter((item) => item.isShow)
          .map((item, index) => {
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
                      backgroundColor: isActive ? "#ffffff" : "transparent",
                      "&:hover": {
                        backgroundColor: isActive
                          ? "#ffffff"
                          : "rgba(255, 255, 255, 0.08)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: isActive
                          ? theme.palette.primary.main
                          : "#ffffff",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      sx={{
                        opacity: open ? 1 : 0,
                        color: isActive
                          ? theme.palette.primary.main
                          : "#ffffff",
                        "& .MuiTypography-root": {
                          fontSize: "16px",
                          fontWeight: 500,
                        },
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ ...(open && !isMobile && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
              <Image
                src="/Assets/images/svg/Logo.svg"
                alt="Logo"
                width={120}
                height={40}
              />
            </Box>
            <IconButton
              onClick={() => setDialogOpen(true)}
              sx={{ color: "#fff" }}
            >
              <LogoutIcon />
            </IconButton>
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
            background: role === "student"
              ? "linear-gradient(135deg, #1e3a8a, #2563eb)"
              : role === "staff"
                ? "linear-gradient(135deg, #9333ea, #ec4899)"
                : "linear-gradient(135deg, #dc2626, #f97316)",
            borderRight: "none",
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
            background: getRoleGradient(),
            width: open ? drawerWidth : `calc(${theme.spacing(8)} + 1px)`,
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
          px: { xs: 1, sm: 2, md: 3 },
          pt: { xs: 10, sm: 10, md: 11 },
          pb: { xs: 2, sm: 2, md: 3 },
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>

      {/* Logout Modal */}
      {/* <CommonModal
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box>
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <WarningOutlinedIcon
              sx={{ color: "#ff9800", height: 60, width: 60 }}
            />
          </Box>
          <Typography sx={{ fontSize: "18px", textAlign: "center", mb: 2 }}>
            Are you sure you want to logout?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <ButtonOutlined
              text="No"
              padding="5px 32px"
              onClick={() => setDialogOpen(false)}
            />
            <ButtonContained
              text="Yes"
              padding="5px 32px"
              onClick={handleLogout}
            />
          </Box>
        </Box>
      </CommonModal> */}
    </Box>
  );
}
