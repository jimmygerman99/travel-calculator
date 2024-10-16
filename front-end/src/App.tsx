import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

// Define the form data interface
interface FormData {
    creditCard: string;
    points: number;
    destination: string;
    destinationType: string;
    departure: string;
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
        departure: "",
        flightType: "",
        classType: "",
    });

    // State to store all available credit card sections fetched from backend
    const [creditCardSections, setCreditCardSections] = useState<CreditCardSection[]>([]);
    const [filteredCards, setFilteredCards] = useState<string[]>([]);

    // Fetch credit card options from backend on component mount
    useEffect(() => {
        const fetchCreditCards = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/credit-cards");
                const sections = await response.json();
                setCreditCardSections(sections);
            } catch (error) {
                console.error("Error fetching credit cards:", error);
            }
        };

        fetchCreditCards();
    }, []);

    // Handle changes in input fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === "creditCard") {
            // Filter credit cards based on input
            let filtered: string[] = [];
            creditCardSections.forEach((section) => {
                const matchingCards = section.cards.filter((card) => card.toLowerCase().includes(value.toLowerCase()));
                filtered = [...filtered, ...matchingCards];
            });
            setFilteredCards(filtered);
        }
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
        // Additional processing or API calls can be handled here
    };

    // Handle credit card selection from the dropdown
    const handleCardSelect = (card: string) => {
        setFormData({
            ...formData,
            creditCard: card,
        });
        setFilteredCards([]); // Clear suggestions after selection
    };
    let navigate = useNavigate();
    return (
        <div className="website">
            <div className="content">
                <div className="info">Content Sesh</div>
                <div className="BottomHalf">
                    <div className="searchFlights">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="creditCard">Enter the credit card to use</label>
                            <input
                                type="text"
                                id="creditCard"
                                name="creditCard"
                                value={formData.creditCard}
                                onChange={handleChange}
                            />

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
