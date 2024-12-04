import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

interface ProtectedRouteLoggedInProps {
    fallbackPath: string;
}

const ProtectedRouteLoggedIn: React.FC<ProtectedRouteLoggedInProps> = ({ fallbackPath }) => {
    const isAuthenticated = useIsAuthenticated();

    // Redirect to fallbackPath if the user is authenticated
    if (isAuthenticated) {
        return <Navigate to={fallbackPath} />;
    }

    return <Outlet />;
};

export default ProtectedRouteLoggedIn;
