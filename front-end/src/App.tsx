import React, { useState } from "react";
import "./App.css";
// Define the form data interface
interface FormData {
    creditCard: string;
    points: number;
    destination: string;
    departure: string;
    flightType: string;
    classType: string;
}

const App: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        creditCard: "",
        points: 0,
        destination: "",
        departure: "",
        flightType: "",
        classType: "",
    });

    // Handle changes in input fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
        // Additional processing or API calls can be handled here
    };

    return (
        <div className="app-container">
            <h1>Find the Best Flight Redemption Value</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="creditCard"
                    value={formData.creditCard}
                    onChange={handleChange}
                    placeholder="Enter the credit card you want to use"
                />
                <input
                    type="number"
                    name="points"
                    value={formData.points}
                    onChange={handleChange}
                    placeholder="Enter your points"
                />
                <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Enter destination"
                />
                <input
                    type="text"
                    name="departure"
                    value={formData.departure}
                    onChange={handleChange}
                    placeholder="Departure location"
                />
                <select name="flightType" value={formData.flightType} onChange={handleChange}>
                    <option value="">Select flight type</option>
                    <option value="roundtrip">Round Trip</option>
                    <option value="direct">Direct</option>
                </select>
                <select name="classType" value={formData.classType} onChange={handleChange}>
                    <option value="">Select class type</option>
                    <option value="economy">Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                </select>
                <button type="submit">Search</button>
            </form>
        </div>
    );
};

export default App;
