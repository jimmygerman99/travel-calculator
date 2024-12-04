import React, { useState } from "react";
import "./Register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";

export const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (!formData.firstName || !formData.lastName || !formData.email) {
            alert("Please fill in all required fields.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setIsLoading(true); // Show loading state

        try {
            const response = await axios.post("http://127.0.0.1:8000/register", {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password,
            });
            console.log("Registration successful:", response.data);
            alert("Registration successful! You can now log in.");
        } catch (error: any) {
            console.error("Registration error:", error);
            alert(
                typeof error.response?.data === "object"
                    ? JSON.stringify(error.response?.data, null, 2)
                    : error.response?.data || "An error occurred."
            );
        } finally {
            setIsLoading(false); // Hide loading state
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>Create an Account</h2>

                <label htmlFor="firstName">First Name</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                />

                <label htmlFor="lastName">Last Name</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                />

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

                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-container">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                    />
                    <span className="toggle-eye" onClick={toggleConfirmPasswordVisibility}>
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </span>
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register"}
                </button>
                <Link to="/loginPage" className="register-link">
                    Have an account? Login Here
                </Link>
            </form>
        </div>
    );
};
