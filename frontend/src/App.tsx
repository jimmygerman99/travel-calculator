import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { useFormData } from "./utils/FormDataContext";

interface CreditCardSection {
    section: string;
    cards: string[];
}

const App: React.FC = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useFormData();
    const [creditCardSections, setCreditCardSections] = useState<CreditCardSection[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/credit-cards");
                if (response.ok) {
                    const data = await response.json();
                    setCreditCardSections(data);
                } else {
                    setError("Failed to fetch cards");
                }
            } catch (error) {
                setError("Error fetching cards: " + (error as Error).message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCards();
    }, []);

    // Effect to save form data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("formData", JSON.stringify(formData));
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.creditCard === "" || !formData.points || formData.points < 1000) {
            alert("Please fill in all fields correctly.");
            return;
        }
        console.log("Form data submitted:", formData);
        navigate("/FlightSearch");
    };

    return (
        <div className="website">
            <div className="content">
                <div className="info">
                    <h1>Welcome to Points Voyager</h1>
                    <p className="description">Discover the best flight options and maximize your travel points.</p>
                </div>
                <div className="search-section">
                    <form onSubmit={handleSubmit} className="search-form">
                        <div className="form-group">
                            <label htmlFor="creditCard">Credit Card</label>
                            {isLoading ? (
                                <p>Loading credit cards...</p>
                            ) : error ? (
                                <p className="error-text">{error}</p>
                            ) : (
                                <select id="creditCard" name="creditCard" value={formData.creditCard} onChange={handleChange}>
                                    <option value="">Select a Credit Card</option>
                                    {creditCardSections.map((section, sectionIndex) => (
                                        <optgroup key={sectionIndex} label={section.section}>
                                            {section.cards.map((card, cardIndex) => (
                                                <option key={cardIndex} value={card}>
                                                    {card}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="points">Maximum Number of Points</label>
                            <input
                                type="number"
                                id="points"
                                name="points"
                                value={formData.points}
                                onChange={handleChange}
                                min={1000}
                                placeholder="Enter points (minimum 1000)"
                            />
                        </div>
                        <button type="submit" className="submit-button">
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default App;
