import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./FlightSearch.css";
import "../App.css";
import { TreeSelectComponent } from "../components/TreeSelectComponent";
import { useFormData } from "../utils/FormDataContext";

const continents = ["Africa", "Antarctica", "Asia", "Europe", "North America", "Oceania", "South America"];

const FlightSearch: React.FC = () => {
    const { formData, updateFormData } = useFormData();
    const [airports, setAirports] = useState([]); // List of airports
    const [countries, setCountries] = useState<string[]>([]); // List of countries

    // Fetch countries from the backend
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

    // Fetch airports for TreeSelectComponent
    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/airports");
                if (response.ok) {
                    const data = await response.json();
                    setAirports(data);
                } else {
                    console.error("Failed to fetch airports");
                }
            } catch (error) {
                console.error("Error fetching airports:", error);
            }
        };
        fetchAirports();
    }, []);

    // Handler for input/select changes
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        updateFormData({ [name]: value });
    };

    // Handler for TreeSelectComponent
    const handleTreeSelectChange = (value: string) => {
        updateFormData({ departureCity: value });
    };

    // Handler for date changes
    const handleDateChange = (name: keyof typeof formData, value: Date | null) => {
        updateFormData({ [name]: value });
    };

    const addDays = (date: Date | null, days: number): Date => {
        if (date) {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }
        return new Date();
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Form submitted:", formData);
    };

    return (
        <div className="searchFlightsPage2">
            <form onSubmit={handleSubmit}>
                {/* Destination Type and Input */}
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
                        <TreeSelectComponent />
                    )}
                </div>

                {/* Departure City */}
                <label htmlFor="departureCity">Departure City</label>
                <TreeSelectComponent
                    data={airports} // Pass airports as data
                    value={formData.departureCity} // Bind global form data
                    onChange={handleTreeSelectChange} // Update formData on selection
                />

                {/* Flight Type */}
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
                        />
                    </div>

                    {formData.classType === "roundTrip" && (
                        <div className="datePickerWrapper">
                            <DatePicker
                                selected={formData.returnDate}
                                onChange={(date) => handleDateChange("returnDate", date)}
                                dateFormat="MMMM d, yyyy"
                                minDate={formData.departureDate ? addDays(formData.departureDate, 1) : new Date()}
                            />
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button type="submit">Search</button>
            </form>
        </div>
    );
};

export default FlightSearch;
