import React, { useState, useEffect } from "react";
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

    return (
        <div className="website">
            <div className="content">
                <div className="navbar">
                    <div className="logo">pointsVoyager</div>
                    <div className="menu">
                        {/* I need to create buttons and routing for these */}
                        <a href="#about">about</a>
                        <a href="#contact">contact</a>
                        <a href="#faq">FAQ</a>
                        <a href="#login">
                            login <span>▼</span>
                        </a>
                    </div>
                </div>
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
                            <div className="destinationGroup">
                                <label htmlFor="destination">Enter Destination</label>
                                <input
                                    type="text"
                                    id="destination"
                                    name="destination"
                                    value={formData.destination}
                                    onChange={handleChange}
                                />
                                <label htmlFor="destinationType"></label>
                                <select
                                    id="destinationType"
                                    name="destinationType"
                                    value={formData.destinationType}
                                    onChange={handleChange}
                                >
                                    <option value="city">City</option>
                                    <option value="country">Country</option>
                                    <option value="continent">Continent</option>
                                </select>
                            </div>

                            <label htmlFor="departure">Departure City</label>
                            <input
                                type="text"
                                id="departure"
                                name="departure"
                                value={formData.departure}
                                onChange={handleChange}
                            />

                            <label htmlFor="flightType">Flight type</label>
                            <select id="flightType" name="flightType" value={formData.flightType} onChange={handleChange}>
                                <option value="economy">Economy</option>
                                <option value="business">Business</option>
                                <option value="first">First</option>
                            </select>

                            <label htmlFor="classType">Class Type</label>
                            <select id="classType" name="classType" value={formData.classType} onChange={handleChange}>
                                <option value="oneWay">One Way</option>
                                <option value="roundTrip">Round Trip</option>
                            </select>

                            <button type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
