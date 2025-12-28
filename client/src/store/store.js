import { configureStore } from "@reduxjs/toolkit";
import ticketReducer from "./ticket";

const store = configureStore({ reducer: { ticket: ticketReducer } });
export default store;
