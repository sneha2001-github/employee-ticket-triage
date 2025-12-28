const express = require("express");
const {
    createTicket,
    getAllTickets,
    getMyTickets,
    updateMyTicket,
    deleteMyTicket,
    adminUpdateTicket,
} = require("../controllers/ticket.controller");
const authMiddleware = require("../middleware/auth.middleware");
const permitRoles = require("../middleware/role.middleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    permitRoles("employee", "admin"),
    createTicket
);
router.get("/my", authMiddleware, permitRoles("employee"), getMyTickets);
router.get("/all", authMiddleware, permitRoles("admin"), getAllTickets);
router.put("/:id", authMiddleware, permitRoles("employee"), updateMyTicket);
router.delete("/:id", authMiddleware, permitRoles("employee"), deleteMyTicket);
router.patch(
    "/:id/admin",
    authMiddleware,
    permitRoles("admin"),
    adminUpdateTicket
);

module.exports = router;
