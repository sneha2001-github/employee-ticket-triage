import "./App.css";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./ui/Login/loginUser";
import Employee from "./ui/Employee/employee";
import CreateTicket from "./ui/Employee/createTicket";
import EmployeeDashboard from "./ui/Employee/dashboard";
import AdminDashboard from "./ui/Admin/dashboard";
import { Provider } from "react-redux";
import store from "./store/store";
import ProtectedRoute from "./ui/ProtectedRoute";

function App() {
    return (
        <>
            <Provider store={store}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/employee"
                        element={
                            <ProtectedRoute role="employee">
                                <Employee />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<EmployeeDashboard />} />
                        <Route
                            path="create-ticket"
                            element={<CreateTicket />}
                        />
                    </Route>
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute role="admin">
                                <Employee />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<AdminDashboard />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Provider>
        </>
    );
}

export default App;
