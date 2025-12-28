const permitRoles = (...allowedRoles) => {
    return (req, res, next) => {
        console.log("req :>> ", req);
        if (!req.user || !req.user.role) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbidden :Access denied",
            });
        }
        next();
    };
};
module.exports = permitRoles;
