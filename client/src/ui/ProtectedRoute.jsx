import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import React from "react";

const ProtectedRoute = ({ children, role }) => {
    const { token, user } = useAuth();

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (role && user?.role !== role) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
