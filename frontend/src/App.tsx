import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

// Define the form data interface
interface FormData {
    creditCard: string;
    points: number;
    destination: string;
    destinationType: string;
    departureCity: string;
    departureDate: string;
    returnDate: string;
    flightType: string;
    classType: string;
}

// Define the structure of a credit card section
interface CreditCardSection {
    section: string;
    cards: string[];
}

const App: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        creditCard: "",
        points: 0,
        destination: "",
        destinationType: "city",
        departureCity: "",
        departureDate: "",
        returnDate: "",
        flightType: "",
        classType: "",
    });
    type CreditCardSection = {
        section: string;
        cards: string[];
    };
    const [creditCardSections, setCreditCardSections] = useState<CreditCardSection[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filteredCards, setFilteredCards] = useState<string[]>([]);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/credit-cards");
                if (response.ok) {
                    const data = await response.json();
                    setCreditCardSections(data);
                    console.log("Fetched credit cards:", data);
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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "creditCard") {
            const lowerCaseValue = value.toLowerCase();
            const matchedCards = creditCardSections.flatMap((section) =>
                section.cards.filter((card) => card.toLowerCase().includes(lowerCaseValue))
            );
            setFilteredCards(matchedCards);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form data submitted:", formData);
        // navigate("/FlightSearch"); // Uncomment this line to navigate on form submit
    };

    let navigate = useNavigate();
    return (
        <div className="website">
            <div className="content">
                <div className="info">Content Sesh</div>
                <div className="BottomHalf">
                    <div className="searchFlights">
                        {/*This is the form */}
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="creditCard">Enter the credit card to use</label>
                            {isLoading ? (
                                <p>Loading credit cards...</p>
                            ) : error ? (
                                <p>{error}</p>
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

                            <label htmlFor="points">Enter the maximum number of points</label>
                            <input type="number" id="points" name="points" value={formData.points} onChange={handleChange} />

                            <button type="submit" onClick={() => navigate("/FlightSearch")}>
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
