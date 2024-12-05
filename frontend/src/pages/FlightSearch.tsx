import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./FlightSearch.css";
import "../App.css";
import { TreeSelectComponent } from "../components/TreeSelectComponent";
import { useFormData } from "../utils/FormDataContext";

const creditCardList = [
    // ... existing data
];

const continents = ["Africa", "Antarctica", "Asia", "Europe", "North America", "Oceania", "South America"];

const FlightSearch: React.FC = () => {
    const { formData, updateFormData } = useFormData();
    const [airports, setAirports] = useState([]);
    const [countries, setCountries] = useState<string[]>([]);
    const [transferableAirlines, setTransferableAirlines] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (formData.creditCard) {
            const selectedCard = creditCardList.find((card) => card.cards.includes(formData.creditCard));
            if (selectedCard) {
                setTransferableAirlines(selectedCard.transferable_airlines);
            } else {
                setTransferableAirlines([]);
            }
        }
    }, [formData.creditCard]);

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

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/airports-summary");
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        updateFormData({ [name]: value });
    };

    const handleTreeSelectChange = (iataCode: string) => {
        updateFormData({ departureCity: iataCode });
    };
    const handleTreeSelectChange2 = (iataCode: string) => {
        updateFormData({ destination: iataCode });
    };

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

    const isSubmitting = useRef(false);
    useEffect(() => {
        isSubmitting.current = false;
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting.current) {
            console.log("Submission already in progress, ignoring this submit.");
            return;
        }

        isSubmitting.current = true;
        setIsLoading(true);
        console.log("Submitting form...");
        console.log("Form Data:", formData);

        const tripType = formData.classType === "roundTrip" ? 1 : 2;
        const requestData: Record<string, any> = {
            departure_id: formData.departureCity,
            arrival_id: formData.destination,
            outbound_date: formData.departureDate?.toISOString().split("T")[0],
            currency: "USD",
            trip_type: tripType,
        };

        if (transferableAirlines) {
            requestData.include_airlines = transferableAirlines;
        }

        if (tripType === 1 && formData.returnDate) {
            requestData.return_date = formData.returnDate.toISOString().split("T")[0];
        }

        try {
            const queryString = new URLSearchParams(requestData).toString();
            const response = await fetch(`http://127.0.0.1:8000/search-flights?${queryString}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch flight data");
            }

            const data = await response.json();
            console.log("Flights loaded:", data);

            setTimeout(() => {
                setIsLoading(false);
                isSubmitting.current = false;
                navigate("/FlightResults", { state: { flights: data.flights } });
            }, 2000);
        } catch (error) {
            console.error("Error fetching flights:", error);
            setIsLoading(false);
            isSubmitting.current = false;
            alert("Failed to load flights. Please try again.");
        }
    };

    return (
        <div className="searchFlightsPage2">
            {isLoading ? (
                <div className="loading-screen">
                    <p>Loading flights...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {/* Destination Type and Input */}
                    <div className="destinationGroup">
                        <label htmlFor="destinationType">Destination Type</label>
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
                            <TreeSelectComponent onSelectAirport={handleTreeSelectChange2} />
                        )}
                    </div>

                    {/* Flight Type */}
                    <label>Departure City</label>
                    <TreeSelectComponent onSelectAirport={handleTreeSelectChange} />
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

                    {/* Calendar Section with Label */}
                    <label>Select Dates</label>
                    <div className="datePickerGroup">
                        <div className="datePickerWrapper">
                            <DatePicker
                                selected={formData.departureDate ? new Date(formData.departureDate) : null}
                                onChange={(date) => handleDateChange("departureDate", date)}
                                dateFormat="yyyy-MM-dd"
                                minDate={new Date()}
                                placeholderText="Select Departure Date"
                            />
                        </div>

                        {formData.classType === "roundTrip" && (
                            <div className="datePickerWrapper">
                                <DatePicker
                                    selected={formData.returnDate ? new Date(formData.returnDate) : null}
                                    onChange={(date) => handleDateChange("returnDate", date)}
                                    dateFormat="yyyy-MM-dd"
                                    minDate={formData.departureDate ? addDays(formData.departureDate, 1) : new Date()}
                                    placeholderText="Select Return Date"
                                />
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button type="submit">Search</button>
                </form>
            )}
        </div>
    );
};

export default FlightSearch;
