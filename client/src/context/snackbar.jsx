import { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import React from "react";

const SnackbarContext = createContext(null);

export const SnackbarProvider = ({ children }) => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success", // success | error | warning | info
    });

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleClose}
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const ctx = useContext(SnackbarContext);
    if (!ctx) {
        throw new Error("useSnackbar must be used inside SnackbarProvider");
    }
    return ctx;
};
