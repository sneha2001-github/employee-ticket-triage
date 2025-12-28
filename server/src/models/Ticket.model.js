const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: ["IT", "HR", "Payroll", "Access", "Other"],
        },
        priority: {
            type: String,
            required: true,
            enum: ["Low", "Medium", "High"],
        },
        status: {
            type: String,
            default: "Open",
            required: true,
            enum: ["Open", "In Progress", "Resolved", "Closed"],
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Ticket", ticketSchema);
