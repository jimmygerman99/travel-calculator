import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactElement;
    isAuthenticated: boolean; // Pass this prop to check if the user is logged in
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isAuthenticated }) => {
    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" />;
    }
    // Render the protected component if authenticated
    return children;
};

export default ProtectedRoute;
