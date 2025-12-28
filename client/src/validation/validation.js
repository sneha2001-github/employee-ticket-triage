import * as yup from "yup";

export const loginSchema = yup.object({
    email: yup
        .string()
        .email("Enter a valid email")
        .required("Email is required"),
    password: yup
        .string()
        .min(6, "Minimum 6 characters")
        .required("Password is required with min 6 characters"),
});

export const registerSchema = yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup
        .string()
        .email("Enter a valid email")
        .required("Email is required"),
    password: yup
        .string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm your password"),
    role: yup.string().required(),
});
export const ticketSchema = yup.object({
    title: yup
        .string()
        .required("Please enter a title")
        .min(5, "Title should be of minimum 5 characters")
        .max(50, "Maximum 50 caharcters are allowed"),

    description: yup
        .string()
        .required("Please describe your issue")
        .min(20, "Please describe the issue in more detail"),
});
