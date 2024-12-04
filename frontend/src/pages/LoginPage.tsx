import React, { useState } from "react";
import "./Register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import useSignIn from "react-auth-kit/hooks/useSignIn";

export const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const signIn = useSignIn();
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true); // Show loading state
        setErrorMessage(null); // Clear previous error messages

        try {
            const response = await axios.post("http://127.0.0.1:8000/login", {
                email: formData.email,
                password: formData.password,
            });

            if (response.status === 200) {
                // Use signIn from react-auth-kit
                const success = signIn({
                    auth: {
                        token: response.data.access_token,
                        type: "Bearer",
                    },
                    userState: { email: formData.email }, // Optional user state
                    refresh: response.data.refresh_token || null, // Only if you are using refreshToken
                });

                if (success) {
                    alert("Login successful!");
                    // Redirect or perform actions after login
                } else {
                    setErrorMessage("Login failed. Please try again.");
                }
            }
        } catch (error: any) {
            console.error("Login error:", error);

            // Set a user-friendly error message
            const errorDetail = error.response?.data?.detail || "Invalid credentials. Please try again.";
            setErrorMessage(errorDetail);
        } finally {
            setIsLoading(false); // Hide loading state
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="register-form" method="POST" action="connect.php">
                <h2>Login Page</h2>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                />

                <label htmlFor="password">Password</label>
                <div className="password-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        required
                    />
                    <span className="toggle-eye" onClick={togglePasswordVisibility}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </span>
                </div>
                {errorMessage && (
                    <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>
                        {errorMessage}
                    </div>
                )}
                <button type="submit" className="submit-btn">
                    Login
                </button>
                <Link to="/register" className="register-link">
                    Don't have an account? Register here.
                </Link>
            </form>
        </div>
    );
};
