import { useState } from "react";
import React from "react";
import {
    MenuItem,
    TextField,
    Box,
    Autocomplete,
    Button,
    Typography,
    Paper,
    Chip,
} from "@mui/material";
import { analyzeTicketApi } from "../../api/ai";
import { CircularProgress, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { ticketActions } from "../../store/ticket";
import {
    categories,
    priorities,
    existingTags,
} from "../../constants/generalConfig";
import { useNavigate } from "react-router-dom";
import { createTicketApi } from "../../api/ticketApi";
import { ticketSchema } from "../../validation/validation";
import { useSnackbar } from "../../context/snackbar";

const CreateTicket = () => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.ticket);
    const [errors, setErrors] = useState({});
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const { showSnackbar } = useSnackbar();

    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(ticketActions.updateField({ field: name, value }));
    };
    const handleAiAnalyze = async () => {
        if (!data.description) {
            showSnackbar("Please add description first", "warning");
            return;
        }

        setAiLoading(true);
        setAiResult(null);

        try {
            const result = await analyzeTicketApi(data.description);
            console.log("result :>> ", result);
            setAiResult(result?.data);
        } catch {
            showSnackbar("AI analysis failed");
        } finally {
            setAiLoading(false);
        }
    };
    const resetForm = () => {
        dispatch(ticketActions.reset());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await ticketSchema.validate(data, { abortEarly: false });
            setErrors({});

            await createTicketApi({
                title: data.title,
                description: data.description,
                priority: data.priority,
                category: data.category,
                tags: data.tags,
            });
            showSnackbar("Ticket created successfully", "success");

            navigate("/employee");
        } catch (err) {
            if (err.name === "ValidationError") {
                const validationErrors = {};
                err.inner.forEach((error) => {
                    validationErrors[error.path] = error.message;
                });
                setErrors(validationErrors);
                return;
            }

            showSnackbar("Failed to create ticket", "error");
        }
        dispatch(ticketActions.reset());
    };

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "auto", // IMPORTANT
                backgroundColor: "transparent",
                p: 3,
                pb: 8, // bottom breathing room
            }}
        >
            {/* PAGE TITLE */}
            <Typography variant="h5" mb={3}>
                Create Ticket
            </Typography>

            {/* MAIN CONTENT GRID (CSS GRID – NOT MUI GRID) */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "2fr 1fr", // ALWAYS 2 columns on desktop
                    },
                    gap: 3,
                    alignItems: "stretch",
                }}
            >
                {/* LEFT — FORM PANEL */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: "#ffffff",
                        height: "fit-content",
                    }}
                >
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            label="Title"
                            name="title"
                            value={data.title}
                            onChange={handleChange}
                            fullWidth
                            required
                            margin="normal"
                            error={Boolean(errors.title)}
                            helperText={errors.title}
                        />

                        <TextField
                            label="Description"
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                            error={Boolean(errors.title)}
                            multiline
                            minRows={6}
                            fullWidth
                            margin="normal"
                            helperText={errors.description}
                        />

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "1fr 1fr",
                                },
                                gap: 2,
                                mt: 2,
                            }}
                        >
                            <TextField
                                select
                                label="Category"
                                name="category"
                                value={data.category}
                                onChange={handleChange}
                                fullWidth
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat} value={cat}>
                                        {cat}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                select
                                label="Priority"
                                name="priority"
                                value={data.priority}
                                onChange={handleChange}
                                fullWidth
                            >
                                {priorities.map((p) => (
                                    <MenuItem key={p} value={p}>
                                        {p}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        <Box mt={3}>
                            <Autocomplete
                                multiple
                                freeSolo
                                options={existingTags}
                                value={data.tags}
                                onChange={(event, newValue) =>
                                    dispatch(
                                        ticketActions.updateField({
                                            field: "tags",
                                            value: newValue,
                                        })
                                    )
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Add Tags"
                                        placeholder="Type and press Enter"
                                    />
                                )}
                            />
                        </Box>
                        <Button
                            variant="contained"
                            sx={{
                                mt: 4,
                                mb: 4,
                                px: 4,
                                mx: 5,
                                backgroundColor: "#2e7d32",
                                "&:hover": {
                                    backgroundColor: "#1b5e20",
                                },
                            }}
                            onClick={() => resetForm()}
                        >
                            Clear
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                mt: 4,
                                mb: 4,
                                px: 4,
                                backgroundColor: "#2e7d32",
                                "&:hover": {
                                    backgroundColor: "#1b5e20",
                                },
                            }}
                        >
                            Create
                        </Button>
                    </Box>
                </Paper>

                {/* RIGHT — AI ASSIST PANEL */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: "#eef1f4",
                        height: "fit-content",
                    }}
                >
                    <Typography variant="h6" mb={1}>
                        🤖 AI Assist
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        Use AI to automatically suggest category and priority
                        based on your description.
                    </Typography>

                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleAiAnalyze}
                        disabled={aiLoading}
                    >
                        {aiLoading ? "Analyzing..." : "Analyze Description"}
                    </Button>

                    {aiLoading && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 2,
                            }}
                        >
                            <CircularProgress size={24} />
                        </Box>
                    )}

                    {aiResult && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2">
                                <strong>Summary</strong>
                            </Typography>
                            <Typography variant="body2" mb={2}>
                                {aiResult.summary}
                            </Typography>
                            <Typography variant="subtitle2">
                                <strong> Suggested Category</strong>
                            </Typography>
                            <Chip
                                label={aiResult.suggestedCategory}
                                color="primary"
                                size="small"
                            />
                            <Typography variant="subtitle2">
                                <strong>Suggested Priority</strong>
                            </Typography>
                            <Chip
                                label={aiResult.suggestedPriority}
                                color={
                                    aiResult.suggestedPriority === "High"
                                        ? "error"
                                        : aiResult.suggestedPriority ===
                                          "Medium"
                                        ? "warning"
                                        : "success"
                                }
                                size="small"
                            />{" "}
                            <Button
                                variant="contained"
                                sx={{ mt: 2, mb: 1.5 }}
                                fullWidth
                                onClick={() => {
                                    dispatch(
                                        ticketActions.updateField({
                                            field: "category",
                                            value: aiResult.suggestedCategory,
                                        })
                                    );
                                    dispatch(
                                        ticketActions.updateField({
                                            field: "priority",
                                            value: aiResult.suggestedPriority,
                                        })
                                    );
                                    showSnackbar(
                                        "AI suggestions applied",
                                        "success"
                                    );
                                }}
                            >
                                Apply Suggestions
                            </Button>
                        </>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default CreateTicket;
