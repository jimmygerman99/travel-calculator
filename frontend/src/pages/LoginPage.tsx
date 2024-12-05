import React, { useState } from "react";
import "./Register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useSignIn from "react-auth-kit/hooks/useSignIn";

export const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const signIn = useSignIn();
    const navigate = useNavigate(); // Hook for navigation

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
        try {
            const response = await axios.post("/login", {
                email: formData.email,
                password: formData.password,
            });
            if (response.status === 200) {
                const success = signIn({
                    auth: {
                        token: response.data.access_token,
                        type: "Bearer",
                    },
                    userState: {
                        firstName: response.data.firstName, // Include user's first name
                        lastName: response.data.lastName,
                    },
                    refresh: response.data.refresh_token,
                });
                if (success) {
                    console.log("Login successful!");
                } else {
                    console.error("Login failed.");
                }
            }
        } catch (error) {
            console.error("Error logging in:", error);
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
                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                </button>
                <Link to="/register" className="register-link">
                    Don't have an account? Register here.
                </Link>
            </form>
        </div>
    );
};
