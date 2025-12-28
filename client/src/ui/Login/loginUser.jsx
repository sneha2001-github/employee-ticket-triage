import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, registerSchema } from "../../validation/validation";
import { loginUser, registerApi } from "../../api/login";
import { useAuth } from "../../context/authContext";
import { useSnackbar } from "../../context/snackbar";
import "./styles.scss";

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const { login } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(isLogin ? loginSchema : registerSchema),
    });

    const onLoginSubmit = async (data) => {
        try {
            const res = await loginUser(data);
            const { token, user } = res.data;

            login(token, user);
            reset();

            if (user.role === "admin") {
                showSnackbar("logged in", "success");
                navigate("/admin");
            } else {
                showSnackbar("logged in", "success");
                navigate("/employee");
            }
        } catch {
            showSnackbar("Invalid credentials", "error");
            // alert(err.response?.data?.message || "Invalid credentials");
        }
    };

    const onRegisterSubmit = async (data) => {
        try {
            await registerApi(data);

            showSnackbar("Registration successful. Please login.", "success");
            setIsLogin(true);
        } catch {
            showSnackbar("Registration failed", "error");
            // toast.error(err.response?.data?.message || "Registration failed");
        }
        reset();
    };
    return (
        <div className="auth-container">
            <div className="auth-card">
                {isLogin ? (
                    <form onSubmit={handleSubmit(onLoginSubmit)}>
                        <h3>Welcome Back!</h3>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                {...register("email")}
                                className={errors.email ? "input-error" : ""}
                            />
                            <p className="error-text">
                                {errors.email?.message}
                            </p>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                {...register("password")}
                                className={errors.password ? "input-error" : ""}
                            />
                            <p className="error-text">
                                {errors.password?.message}
                            </p>
                        </div>

                        <button className="btn-primary" type="submit">
                            Login
                        </button>

                        <div className="auth-footer">
                            Don&apos;t have an account?
                            <button
                                type="button"
                                onClick={() => setIsLogin(false)}
                            >
                                Sign up
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit(onRegisterSubmit)}>
                        <h3>New User Registration</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    {...register("firstName")}
                                    className={
                                        errors.firstName ? "input-error" : ""
                                    }
                                />
                                <p className="error-text">
                                    {errors.firstName?.message}
                                </p>
                            </div>

                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    {...register("lastName")}
                                    className={
                                        errors.lastName ? "input-error" : ""
                                    }
                                />
                                <p className="error-text">
                                    {errors.lastName?.message}
                                </p>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                {...register("email")}
                                className={errors.email ? "input-error" : ""}
                            />
                            <p className="error-text">
                                {errors.email?.message}
                            </p>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                {...register("password")}
                                className={errors.password ? "input-error" : ""}
                            />
                            <p className="error-text">
                                {errors.password?.message}
                            </p>
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                {...register("confirmPassword")}
                                className={
                                    errors.confirmPassword ? "input-error" : ""
                                }
                            />
                            <p className="error-text">
                                {errors.confirmPassword?.message}
                            </p>
                        </div>

                        <div className="form-group">
                            <label>User Role</label>
                            <select {...register("role")}>
                                <option value="employee">Employee</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <button className="btn-primary" type="submit">
                            Register
                        </button>

                        <button
                            className="btn-secondary"
                            type="button"
                            onClick={() => setIsLogin(true)}
                        >
                            Back to Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
