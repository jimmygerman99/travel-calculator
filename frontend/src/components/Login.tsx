import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import useSignIn from "react-auth-kit/hooks/useSignIn";

interface LoginProps {
    closeLoginDropdown: () => void;
}

export const Login: React.FC<LoginProps> = ({ closeLoginDropdown }) => {
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
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await axios.post("http://127.0.0.1:8000/login", {
                email: formData.email,
                password: formData.password,
            });

            if (response.status === 200) {
                const success = signIn({
                    auth: {
                        token: response.data.access_token,
                        type: "Bearer",
                    },
                    userState: { firstName: response.data.first_name, email: formData.email }, // Assuming API returns first_name
                    refresh: response.data.refresh_token || null,
                });

                if (success) {
                    closeLoginDropdown(); // Close the dropdown on successful login
                } else {
                    setErrorMessage("Login failed. Please try again.");
                }
            }
        } catch (error: any) {
            const errorDetail = error.response?.data?.detail || "Invalid credentials. Please try again.";
            setErrorMessage(errorDetail);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="youremail@gmail.com"
                id="email"
                name="email"
            />
            <label htmlFor="password">Password</label>
            <div className="password-container">
                <input
                    value={formData.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
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
            <button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
            </button>
            <Link to="/register" className="register-link" onClick={closeLoginDropdown}>
                Don't have an account? Register here.
            </Link>
        </form>
    );
};
