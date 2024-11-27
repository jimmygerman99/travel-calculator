import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./FlightSearch.css";
import "../App.css";
import { FormData } from "../interfaces/FormDataTypes";

const continents = ["Africa", "Antarctica", "Asia", "Europe", "North America", "Oceania", "South America"];

interface Airport {
    airport_name: string;
    iata: string | null;
    city: string;
    country: string;
    continent: string;
}

const FlightSearch = () => {
    // State to manage form data
    const [formData, setFormData] = useState<FormData>(() => {
        const savedData = localStorage.getItem("flightSearchFormData");
        return savedData
            ? JSON.parse(savedData)
            : {
                  destination: "",
                  destinationType: "city",
                  departureCity: "",
                  departureAirport: "",
                  flightType: "economy",
                  classType: "oneWay",
                  departureDate: new Date(),
                  returnDate: null,
              };
    });

    // Save data to localStorage whenever formData changes
    useEffect(() => {
        localStorage.setItem("flightSearchFormData", JSON.stringify(formData));
    }, [formData]);

    // State for all airports and filtered airports
    const [airports, setAirports] = useState<Airport[]>([]);
    const [filteredAirports, setFilteredAirports] = useState<Airport[]>([]);

    // Fetching all countries
    const [countries, setCountries] = useState<string[]>([]);

    // Fetch countries from the backend when component mounts
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/common-countries");
                if (response.ok) {
                    const data = await response.json();
                    setCountries(data);
                } else {
                    console.error("Failed to fetch countries");
                }
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };
        fetchCountries();
    }, []);

    // Handler for input change
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handler for date change
    const handleDateChange = (name: keyof FormData, value: Date | null) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Add days function for setting the minimum return date
    const addDays = (date: Date | null, days: number): Date => {
        if (date) {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }
        return new Date();
    };

    // Handler for form submission
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Form submitted:", formData);
    };

    return (
        <div className="searchFlightsPage2">
            <form onSubmit={handleSubmit}>
                <div className="destinationGroup">
                    <label htmlFor="destinationType">Destination Type</label>
                    <select id="destinationType" name="destinationType" value={formData.destinationType} onChange={handleChange}>
                        <option value="city">City</option>
                        <option value="country">Country</option>
                        <option value="continent">Continent</option>
                    </select>
                    <label htmlFor="destination" className="bold">
                        Enter Destination
                    </label>
                    {formData.destinationType === "continent" ? (
                        <select id="destination" name="destination" value={formData.destination} onChange={handleChange}>
                            <option value="">Select Continent</option>
                            {continents.map((continent, index) => (
                                <option key={index} value={continent}>
                                    {continent}
                                </option>
                            ))}
                        </select>
                    ) : formData.destinationType === "country" ? (
                        <select id="destination" name="destination" value={formData.destination} onChange={handleChange}>
                            <option value="">Select Country</option>
                            {countries.map((country, index) => (
                                <option key={index} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            id="destination"
                            name="destination"
                            placeholder="Enter City"
                            value={formData.destination}
                            onChange={handleChange}
                        />
                    )}
                </div>

                <label htmlFor="departureCity">Departure City / Airport Code</label>
                <input
                    type="text"
                    id="departureCity"
                    name="departureCity"
                    placeholder="Enter IATA code or city"
                    value={formData.departureCity}
                    onChange={handleChange}
                    autoComplete="off"
                />

                {filteredAirports.length > 0 && (
                    <select
                        id="filteredAirports"
                        name="filteredAirports"
                        value={formData.departureAirport}
                        onChange={(e) => setFormData({ ...formData, departureAirport: e.target.value })}
                    >
                        <option value="">Select an airport</option>
                        {filteredAirports.map((airport, index) => (
                            <option key={index} value={airport.iata || airport.city}>
                                {airport.city
                                    ? `${airport.city} (${airport.iata}) - ${airport.airport_name}`
                                    : airport.airport_name}
                            </option>
                        ))}
                    </select>
                )}

                <label htmlFor="flightType">Flight Type</label>
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

                {/* Calendar Section */}
                <div className="datePickerGroup">
                    <div className="datePickerWrapper">
                        <DatePicker
                            selected={formData.departureDate}
                            onChange={(date) => handleDateChange("departureDate", date)}
                            dateFormat="MMMM d, yyyy"
                            minDate={new Date()}
                            showDisabledMonthNavigation
                            customInput={<CustomDateInput label="Departure Date" date={formData.departureDate} />}
                        />
                    </div>

                    {formData.classType === "roundTrip" && (
                        <div className="datePickerWrapper">
                            <DatePicker
                                selected={formData.returnDate}
                                onChange={(date) => handleDateChange("returnDate", date)}
                                dateFormat="MMMM d, yyyy"
                                minDate={formData.departureDate ? addDays(formData.departureDate, 1) : new Date()}
                                showDisabledMonthNavigation
                                customInput={<CustomDateInput label="Return Date" date={formData.returnDate} />}
                            />
                        </div>
                    )}
                </div>

                <button type="submit">Search</button>
            </form>
        </div>
    );
};

// Custom input component for the date picker
const CustomDateInput: React.FC<{ value?: string; onClick?: () => void; label: string; date: Date | null }> = ({
    value,
    onClick,
    label,
    date,
}) => {
    return (
        <div className="custom-date-input" onClick={onClick}>
            <input type="text" readOnly value={date ? `${label}: ${value}` : `${label}`} className="date-input" />
        </div>
    );
};

export default FlightSearch;
