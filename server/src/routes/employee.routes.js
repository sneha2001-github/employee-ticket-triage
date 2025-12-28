const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const permitRoles = require("../middleware/role.middleware");

const router = express.Router();

router.get("/profile", authMiddleware, permitRoles("employee"), (req, res) => {
    res.json({
        message: "Welcome Employee 👷",
    });
});

module.exports = router;
