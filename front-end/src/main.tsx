import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import FlightSearch from "./pages/FlightSearch";
import ErrorPage from "./pages/ErrorPage";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <div className="navbar">
                <div className="logo">
                    <Link to="/">pointsVoyager</Link>
                </div>
                <div className="menu">
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/faq">FAQ</Link>
                    <Link to="/login">Login</Link> {/* Update your login logic as needed */}
                </div>
            </div>

            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/FlightSearch" element={<FlightSearch />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>

            <div>This is a footer</div>
        </BrowserRouter>
    </StrictMode>
);
