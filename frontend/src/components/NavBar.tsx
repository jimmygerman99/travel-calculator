import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Login } from "./Login";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

export const Navbar: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const isAuthenticated = useIsAuthenticated();
    const signOut = useSignOut();
    const navigate = useNavigate(); // Hook for navigation
    const userFirstName = localStorage.getItem("userFirstName") || "Guest";

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdownElement = document.querySelector(".login-dropdown");
            const buttonElement = document.querySelector(".login-button");

            if (
                dropdownElement &&
                !dropdownElement.contains(event.target as Node) &&
                buttonElement &&
                !buttonElement.contains(event.target as Node)
            ) {
                closeDropdown();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSignOut = () => {
        signOut();
        closeDropdown();
    };

    return (
        <div className="navbar">
            <div className="logo">
                <Link to="/">pointsVoyager</Link>
            </div>
            <div className="menu">
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/faq">FAQ</Link>

                {isAuthenticated ? (
                    <>
                        <button className="login-button" onClick={toggleDropdown}>
                            Hello, {userFirstName}
                        </button>
                        {isDropdownOpen && (
                            <div className="login-dropdown">
                                <button className="dropdown-button" onClick={handleSignOut}>
                                    Sign Out
                                </button>
                                <button
                                    className="dropdown-button"
                                    onClick={() => {
                                        closeDropdown();
                                        navigate("/ProfilePage");
                                        // Navigate to profile or perform any action
                                    }}
                                >
                                    Profile
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <button className="login-button" onClick={toggleDropdown}>
                            Login
                        </button>
                        {isDropdownOpen && (
                            <div className="login-dropdown">
                                <Login closeLoginDropdown={closeDropdown} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
