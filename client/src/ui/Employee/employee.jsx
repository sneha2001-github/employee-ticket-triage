import * as React from "react";
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    IconButton,
    Divider,
    Drawer,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useAuth } from "../../context/authContext";
import { Outlet, useNavigate } from "react-router-dom";

const drawerWidth = 220;
const APPBAR_HEIGHT = 56;

const Employee = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [drawerOpen, setDrawerOpen] = React.useState(true);

    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setDrawerOpen((prev) => !prev);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const drawer = (
        <Box
            sx={{
                width: 240,
                backgroundColor: "background.paper",
                borderRight: "1px solid #e0e0e0",
                height: "100vh",
            }}
        >
            <Toolbar sx={{ minHeight: 56 }} />
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton
                        sx={{
                            borderRadius: 1,
                            mx: 1,
                            my: 0.5,
                            "&.Mui-selected": {
                                backgroundColor: "primary.main",
                                color: "primary.contrastText",
                            },
                            "&.Mui-selected:hover": {
                                backgroundColor: "primary.dark",
                            },
                        }}
                        onClick={() =>
                            navigate(
                                user.role === "admin" ? "/admin" : "/employee"
                            )
                        }
                    >
                        <ListItemIcon>
                            <DashboardIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                </ListItem>

                {user?.role === "employee" && (
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => navigate("/employee/create-ticket")}
                        >
                            <ListItemIcon>
                                <AddBoxIcon />
                            </ListItemIcon>
                            <ListItemText primary="Create Ticket" />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: "flex" }}>
            {/* ================= APP BAR ================= */}
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar sx={{ minHeight: 56 }}>
                    {" "}
                    {/* 🔹 reduced height */}
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 1 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    {/* Greeting */}
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">
                            Hello {user?.firstName} {user?.lastName}
                        </Typography>
                        <Typography s variant="caption">
                            Welcome to your employee dashboard
                        </Typography>
                    </Box>
                    {/* Profile Menu */}
                    <IconButton color="inherit" onClick={handleMenuOpen}>
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            sx: {
                                backgroundColor: "background.paper",
                                "& .MuiMenuItem-root:hover": {
                                    backgroundColor: "primary.main",
                                    color: "primary.contrastText",
                                },
                            },
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                logout();
                                navigate("/login");
                            }}
                        >
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* ================= DRAWER ================= */}
            <Drawer
                variant="persistent"
                open={drawerOpen}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        backgroundColor: "background.paper",
                        color: "text.primary",
                        borderRight: "1px solid #e0e0e0",
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* ================= MAIN CONTENT ================= */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    backgroundColor: "#f4f6f8",
                    marginTop: `${APPBAR_HEIGHT}px`,
                    height: `calc(100vh - ${APPBAR_HEIGHT}px)`,
                    // overflowY: "auto",
                    boxSizing: "border-box",
                    px: 3,
                    py: 1,
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default Employee;
