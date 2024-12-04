import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Navbar } from "./NavBar";
export const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
            const response = await axios.post("http://127.0.0.1:8000/login", {
                email: formData.email,
                password: formData.password,
            });
            console.log("Login Successful:", response.data);
            alert("Login successful! ");
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
        <>
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
                    <input value={formData.password} onChange={handleChange} type="password" id="password" name="password" />
                    <span className="toggle-eye" onClick={togglePasswordVisibility}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </span>
                </div>
                {errorMessage && (
                    <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>
                        {errorMessage}
                    </div>
                )}
                <button type="submit">Login</button>
                <Link to="/register" className="register-link">
                    Don't have an account? Register here.
                </Link>
            </form>
        </>
    );
};
