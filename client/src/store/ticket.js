import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    title: "",
    description: "",
    category: "IT",
    priority: "Medium",
    tags: [],
};

const ticketSlice = createSlice({
    name: "ticket",
    initialState: initialState,
    reducers: {
        updateField(state, action) {
            const { field, value } = action.payload;
            state[field] = value;
        },
        reset() {
            return initialState;
        },
    },
});
export const ticketActions = ticketSlice.actions;
export default ticketSlice.reducer;
