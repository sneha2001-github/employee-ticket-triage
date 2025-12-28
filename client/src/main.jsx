import { createRoot } from "react-dom/client";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { SnackbarProvider } from "./context/snackbar";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <SnackbarProvider>
                    <ThemeProvider theme={theme}>
                        <App />
                    </ThemeProvider>
                </SnackbarProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
