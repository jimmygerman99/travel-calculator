import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const Main = () => {
    return (
        <StrictMode>
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
                        <Route path="/loginPage" element={<LoginPage />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<ErrorPage />} />
                    </Route>
                </Routes>

                {/* Footer */}
                <div className="footer">This is a footer</div>
            </BrowserRouter>
        </StrictMode>
    );
};

createRoot(document.getElementById("root")!).render(<Main />);
