import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#2e7d32", // green
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#27ae60",
        },
        background: {
            default: "#ffffff",
            paper: "#f7f8fa", // cards, tables, sidebar
        },
        text: {
            primary: "#111111",
            secondary: "#555555",
        },
    },

    shape: {
        borderRadius: 8,
    },

    typography: {
        fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
        h6: {
            fontWeight: 600,
        },
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 6,
                },
            },
        },

        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                },
            },
        },

        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: "#f0f2f5",
                },
            },
        },

        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    color: "#111",
                },
            },
        },
    },
});

export default theme;
