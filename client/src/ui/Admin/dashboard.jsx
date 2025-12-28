import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Select,
    MenuItem,
    CircularProgress,
    TablePagination,
    Button,
} from "@mui/material";
import { getAllTicketsApi, adminUpdateTicketApi } from "../../api/ticketApi";
import { useSnackbar } from "../../context/snackbar";

const AdminDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { showSnackbar } = useSnackbar();
    const [filters, setFilters] = useState({
        priority: "",
        status: "",
        category: "",
    });

    const employees = ["john", "emma", "alex"];

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await getAllTicketsApi();
            setTickets(res.data.tickets || []);
        } catch (err) {
            showSnackbar(`Failed to load tickets ${err}`, "error");
        } finally {
            setLoading(false);
        }
    };
    const handleAdminUpdate = async (ticketId, data) => {
        try {
            await adminUpdateTicketApi(ticketId, data);
            showSnackbar("Ticket updated", "success");
            fetchTickets();
        } catch {
            showSnackbar("Update failed");
        }
    };
    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <CircularProgress />
            </Box>
        );
    }
    const filteredTickets = tickets.filter((ticket) => {
        console.log("ticket :>> ", ticket);
        return (
            (!filters.priority ||
                ticket.priority?.toLowerCase() ===
                    filters.priority.toLowerCase()) &&
            (!filters.status ||
                ticket.status?.toLowerCase().trim() ===
                    filters.status.toLowerCase().trim()) &&
            (!filters.category ||
                ticket.category?.toLowerCase() ===
                    filters.category.toLowerCase())
        );
    });

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    maxWidth: 1200,
                    mx: "auto",
                    mt: 8,
                    mb: 3,
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                <Typography sx={{ fontWeight: 600 }}>My Tickets</Typography>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Select
                        size="small"
                        displayEmpty
                        value={filters.priority}
                        onChange={(e) =>
                            handleFilterChange("priority", e.target.value)
                        }
                        sx={{ width: 160 }}
                    >
                        <MenuItem value="">All Priorities</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                    </Select>

                    <Select
                        size="small"
                        displayEmpty
                        value={filters.status}
                        onChange={(e) =>
                            handleFilterChange("status", e.target.value)
                        }
                        sx={{ width: 160 }}
                    >
                        <MenuItem value="">All Status</MenuItem>
                        <MenuItem value="Open">Open</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Resolved">Resolved</MenuItem>
                    </Select>

                    <Select
                        size="small"
                        displayEmpty
                        value={filters.category}
                        onChange={(e) =>
                            handleFilterChange("category", e.target.value)
                        }
                        sx={{ width: 160 }}
                    >
                        <MenuItem value="">All Categories</MenuItem>
                        <MenuItem value="IT">IT</MenuItem>
                        <MenuItem value="HR">HR</MenuItem>
                        <MenuItem value="General">General</MenuItem>
                        <MenuItem value="Finance">Finance</MenuItem>
                    </Select>

                    <Button
                        variant="outlined"
                        onClick={() =>
                            setFilters({
                                priority: "",
                                status: "",
                                category: "",
                            })
                        }
                        sx={{ height: 40 }}
                    >
                        Clear
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{
                    maxWidth: 1200,
                    mx: "auto",
                    mt: 4,
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                ></Box>

                {/* Table Card */}
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        backgroundColor: "#f9fafb",
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow
                                sx={{
                                    backgroundColor: "#eef1f4",
                                }}
                            >
                                <TableCell sx={{ fontWeight: 600 }}>
                                    Title
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                    Category
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                    Priority
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                    Status
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                    Assigned To
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredTickets
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((ticket) => (
                                    <TableRow key={ticket._id} hover>
                                        <TableCell>{ticket.title}</TableCell>
                                        <TableCell>{ticket.category}</TableCell>

                                        {/* Priority */}
                                        <TableCell>
                                            <Chip
                                                label={ticket.priority}
                                                size="small"
                                                sx={{
                                                    fontWeight: 500,
                                                }}
                                                color={
                                                    ticket.priority === "High"
                                                        ? "error"
                                                        : ticket.priority ===
                                                          "Medium"
                                                        ? "warning"
                                                        : "success"
                                                }
                                            />
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <Select
                                                size="small"
                                                value={ticket.status}
                                                sx={{ width: 140 }}
                                                onChange={(e) =>
                                                    handleAdminUpdate(
                                                        ticket._id,
                                                        {
                                                            status: e.target
                                                                .value,
                                                        }
                                                    )
                                                }
                                            >
                                                <MenuItem value="Open">
                                                    Open
                                                </MenuItem>
                                                <MenuItem value="In Progress">
                                                    In Progress
                                                </MenuItem>
                                                <MenuItem value="Resolved">
                                                    Resolved
                                                </MenuItem>
                                            </Select>
                                        </TableCell>

                                        {/* Assign */}
                                        <TableCell>
                                            <Select
                                                size="small"
                                                value={ticket.assignedTo || ""}
                                                sx={{ width: 160 }}
                                                onChange={(e) =>
                                                    handleAdminUpdate(
                                                        ticket._id,
                                                        {
                                                            assignedTo:
                                                                e.target.value,
                                                        }
                                                    )
                                                }
                                            >
                                                <MenuItem value="">
                                                    Unassigned
                                                </MenuItem>
                                                {employees.map((emp) => (
                                                    <MenuItem
                                                        key={emp}
                                                        value={emp}
                                                    >
                                                        {emp}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <TablePagination
                        component="div"
                        count={tickets.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                    />
                </TableContainer>
            </Box>
        </>
    );
};

export default AdminDashboard;
