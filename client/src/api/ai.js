import api from "./axios";

export const analyzeTicketApi = (description) => {
    return api.post("/ai/analyze", { description });
};
