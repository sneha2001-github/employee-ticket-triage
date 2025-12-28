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
    CircularProgress,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    TablePagination,
    Select,
    MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { updateMyTicketApi, deleteMyTicketApi } from "../../api/ticketApi";
import { useSnackbar } from "../../context/snackbar";
import { getMyTicketsApi } from "../../api/ticketApi";

const statusColor = (status) => {
    switch (status) {
        case "Open":
            return "default";
        case "In Progress":
            return "warning";
        case "Resolved":
            return "success";
        default:
            return "default";
    }
};

const EmployeeDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { showSnackbar } = useSnackbar();
    const [filters, setFilters] = useState({
        priority: "",
        status: "",
        category: "",
    });

    const handleEditOpen = (ticket) => {
        setSelectedTicket({ ...ticket });
        setOpenEdit(true);
    };

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEditSave = async () => {
        try {
            await updateMyTicketApi(selectedTicket._id, {
                title: selectedTicket.title,
                description: selectedTicket.description,
            });
            showSnackbar("Ticket updated", "success");
            setOpenEdit(false);
            fetchTickets();
        } catch {
            showSnackbar("Update failed", "error");
        }
    };

    const handleDelete = async (ticketId) => {
        try {
            await deleteMyTicketApi(ticketId);
            showSnackbar("Ticket deleted", "success");
            fetchTickets();
        } catch {
            showSnackbar("Delete failed", "error");
        }
    };
    const fetchTickets = async () => {
        try {
            const res = await getMyTicketsApi();
            setTickets(res.data.tickets || []);
        } catch (err) {
            console.error("Failed to fetch tickets", err);
        } finally {
            setLoading(false);
        }
    };
    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    useEffect(() => {
        fetchTickets();
    }, []);

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
                    mt: 8,
                }}
            >
                <TableContainer
                    component={Paper}
                    sx={{
                        backgroundColor: "background.paper",
                        borderRadius: 2,
                        boxShadow: "10px 10px 17px rgba(0.5,0.5,0,0.05)",
                    }}
                >
                    <Table sx={{ minWidth: 900 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Priority</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredTickets.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        align="center"
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "#f9fafb",
                                            },
                                        }}
                                    >
                                        No tickets found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredTickets
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((ticket) => (
                                        <TableRow key={ticket._id}>
                                            <TableCell>
                                                {ticket.title}
                                            </TableCell>
                                            <TableCell>
                                                {ticket.category}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={ticket.priority}
                                                    color={
                                                        ticket.priority ===
                                                        "High"
                                                            ? "error"
                                                            : ticket.priority ===
                                                              "Medium"
                                                            ? "warning"
                                                            : "success"
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={ticket.status}
                                                    color={statusColor(
                                                        ticket.status
                                                    )}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    ticket.createdAt
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {ticket.status === "Open" && (
                                                    <>
                                                        <IconButton
                                                            onClick={() =>
                                                                handleEditOpen(
                                                                    ticket
                                                                )
                                                            }
                                                            size="small"
                                                            color="primary"
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>

                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    ticket._id
                                                                )
                                                            }
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={tickets.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                        sx={{
                            borderTop: "1px solid #e0e0e0",
                        }}
                    />
                </TableContainer>
                <Dialog
                    open={openEdit}
                    onClose={() => setOpenEdit(false)}
                    fullWidth
                >
                    <DialogTitle>Edit Ticket</DialogTitle>

                    <DialogContent>
                        <TextField
                            label="Title"
                            fullWidth
                            margin="normal"
                            value={selectedTicket?.title || ""}
                            onChange={(e) =>
                                setSelectedTicket({
                                    ...selectedTicket,
                                    title: e.target.value,
                                })
                            }
                        />

                        <TextField
                            label="Description"
                            fullWidth
                            margin="normal"
                            multiline
                            minRows={4}
                            value={selectedTicket?.description || ""}
                            onChange={(e) =>
                                setSelectedTicket({
                                    ...selectedTicket,
                                    description: e.target.value,
                                })
                            }
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => setOpenEdit(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditSave}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
};

export default EmployeeDashboard;
