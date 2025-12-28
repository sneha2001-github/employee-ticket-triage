const Tickets = require("../models/Ticket.model");

exports.createTicket = async (req, res) => {
    try {
        const { title, description, priority, category, tags } = req.body;
        console.log("req.body :>> ", req.body);

        if (!title || !description || !priority || !category) {
            return res.status(400).json({
                message:
                    "Title, description, priority and category are required",
            });
        }

        const ticket = await Tickets.create({
            title,
            description,
            priority,
            tags,
            category,
            createdBy: req.user.userId,
        });

        res.status(201).json({
            message: "Ticket created successfully",
            ticketId: ticket._id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getMyTickets = async (req, res) => {
    try {
        const userId = req.user.userId;

        const tickets = await Tickets.find({ createdBy: userId }).sort({
            createdAt: -1,
        });
        if (tickets) {
            res.status(200).json({ count: tickets.length, tickets });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await Tickets.find()
            .populate("createdBy", "name email role")
            .populate("assignedTo", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: tickets.length,
            tickets,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateMyTicket = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const userId = req.user.userId;

        const ticket = await Tickets.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found",
            });
        }
        if (ticket.createdBy.toString() !== userId) {
            return res.status(403).json({
                message: "You are not allowed to edit this ticket",
            });
        }
        if (ticket.status !== "Open") {
            return res.status(400).json({
                message: "Only OPEN tickets can be edited",
            });
        }

        const { title, description, category, priority } = req.body;
        if (title) ticket.title = title;
        if (description) ticket.description = description;
        if (category) ticket.category = category;
        if (priority) ticket.priority = priority;

        await ticket.save();
        res.status(200).json({
            message: "Ticket updated successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.deleteMyTicket = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const userId = req.user.userId;

        const ticket = await Tickets.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found",
            });
        }

        // Ownership check
        if (ticket.createdBy.toString() !== userId) {
            return res.status(403).json({
                message: "You are not allowed to delete this ticket",
            });
        }

        // Status check
        if (ticket.status !== "Open") {
            return res.status(400).json({
                message: "Only OPEN tickets can be deleted",
            });
        }

        await ticket.deleteOne();

        res.status(200).json({
            message: "Ticket deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.adminUpdateTicket = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const { status, assignedTo } = req.body;

        // Validate input
        if (!status && !assignedTo) {
            return res.status(400).json({
                message: "Nothing to update",
            });
        }

        const ticket = await Tickets.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found",
            });
        }
        if (assignedTo !== undefined) {
            ticket.assignedTo = assignedTo || null;
        }

        // Update allowed fields only
        if (status) {
            ticket.status = status;
        }

        if (assignedTo) {
            ticket.assignedTo = assignedTo;
        }

        await ticket.save();

        res.status(200).json({
            message: "Ticket updated successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
