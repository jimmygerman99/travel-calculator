import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Login } from "./Login";

export const Navbar: React.FC = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const toggleLoginDropdown = () => {
        setIsLoginOpen((prevState) => !prevState); // Toggle login dropdown visibility
    };

    const closeLoginDropdown = () => {
        setIsLoginOpen(false); // Close the dropdown
    };

    useEffect(() => {
        // Close the dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            const dropdownElement = document.querySelector(".login-dropdown");
            const buttonElement = document.querySelector(".login-button");

            if (
                dropdownElement &&
                !dropdownElement.contains(event.target as Node) &&
                buttonElement &&
                !buttonElement.contains(event.target as Node)
            ) {
                closeLoginDropdown();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="navbar">
            <div className="logo">
                <Link to="/">pointsVoyager</Link>
            </div>
            <div className="menu">
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/faq">FAQ</Link>
                <button className="login-button" onClick={toggleLoginDropdown}>
                    Login
                </button>
                {isLoginOpen && (
                    <div className="login-dropdown">
                        <Login closeLoginDropdown={closeLoginDropdown} />
                    </div>
                )}
            </div>
        </div>
    );
};
