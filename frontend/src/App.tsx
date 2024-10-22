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

    const [creditCardSections, setCreditCardSections] = useState<CreditCardSection[]>([]);
    const [filteredCards, setFilteredCards] = useState<string[]>([]);

    useEffect(() => {
        fetchCreditCards();
    }, []);

    const fetchCreditCards = async () => {
        try {
            const response = await fetch("http://localhost:5173/api/credit-cards");
            const sections: CreditCardSection[] = await response.json();
            setCreditCardSections(sections);
        } catch (error) {
            console.error("Error fetching credit cards:", error);
        }
    };

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
                            <input
                                type="text"
                                id="creditCard"
                                name="creditCard"
                                value={formData.creditCard}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                            {filteredCards.length > 0 && (
                                <ul className="autocomplete-dropdown">
                                    {filteredCards.map((card, index) => (
                                        <li key={index} onClick={() => setFormData((prev) => ({ ...prev, creditCard: card }))}>
                                            {card}
                                        </li>
                                    ))}
                                </ul>
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
