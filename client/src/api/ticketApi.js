import api from "./axios";

export const createTicketApi = (ticketData) => {
    return api.post("/tickets", ticketData);
};
export const getMyTicketsApi = () => {
    return api.get("/tickets/my");
};
// Update own ticket (employee)
export const updateMyTicketApi = (ticketId, data) => {
    return api.put(`/tickets/${ticketId}`, data);
};

// Delete own ticket (employee)
export const deleteMyTicketApi = (ticketId) => {
    return api.delete(`/tickets/${ticketId}`);
};
export const getAllTicketsApi = () => {
    return api.get("/tickets/all");
};

// Admin update ticket (assign / status)
export const adminUpdateTicketApi = (ticketId, data) => {
    return api.patch(`/tickets/${ticketId}/admin`, data);
};
