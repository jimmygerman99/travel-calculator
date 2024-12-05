import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import FlightSearch from "./pages/FlightSearch";
import ErrorPage from "./pages/ErrorPage";
import { LoginPage } from "./pages/LoginPage";
import "bootstrap/dist/css/bootstrap.css";
import Layout from "./components/Layout";
import { Register } from "./pages/Register";
import { Navbar } from "./components/NavBar"; // Import the Navbar component
import AuthProvider from "react-auth-kit";
import createStore from "react-auth-kit/createStore";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";
import ProfilePage from "./pages/ProfilePage";
import { FormDataProvider } from "./utils/FormDataContext";
import ProtectedRouteLoggedIn from "./hooks/ProtectedRouteLoggedIn";
import FlightResults from "./pages/FlightResults";
//import refresh from "./utils/refresh";

const Main = () => {
    const store = createStore({
        authName: "_auth",
        authType: "cookie",
        cookieDomain: window.location.hostname,
        cookieSecure: window.location.protocol === "https:",
        //refresh: refresh,
    });

    return (
        //<StrictMode>
        <FormDataProvider>
            <AuthProvider store={store}>
                <BrowserRouter>
                    {/* Navbar */}
                    <Navbar />

                    {/* Routes */}
                    <Routes>
                        <Route path="/" element={<App />} />
                        <Route element={<Layout />}>
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/faq" element={<FAQ />} />
                            <Route path="/FlightSearch" element={<FlightSearch />} />

                            {/* Protected Routes for logged-out users */}
                            <Route element={<ProtectedRouteLoggedIn fallbackPath="/" />}>
                                <Route path="/loginPage" element={<LoginPage />} />
                                <Route path="/register" element={<Register />} />
                            </Route>

                            {/* Protected Routes for logged-in users */}
                            <Route element={<AuthOutlet fallbackPath="/loginPage" />}>
                                <Route path="ProfilePage" element={<ProfilePage />} />
                                <Route path="FlightResults" element={<FlightResults />} />
                            </Route>

                            <Route path="*" element={<ErrorPage />} />
                        </Route>
                    </Routes>

                    {/* Footer */}
                    <div className="footer">This is a footer</div>
                </BrowserRouter>
            </AuthProvider>
        </FormDataProvider>
        //</StrictMode>
    );
};

createRoot(document.getElementById("root")!).render(<Main />);
