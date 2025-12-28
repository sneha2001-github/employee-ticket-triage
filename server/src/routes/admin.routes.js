const express = require("express");
const { createTicket } = require("../controllers/ticket.controller");
const authMiddleware = require("../middleware/auth.middleware");
const permitRoles = require("../middleware/role.middleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    permitRoles("employee", "admin"),
    createTicket
);

module.exports = router;
