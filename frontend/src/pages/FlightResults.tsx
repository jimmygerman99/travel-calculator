import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import sampleFlightData from "../../../backend/flights_response_debug.json";
import "./FlightResults.css";

interface FlightLeg {
    airline: string;
    flight_number: string;
    departure_airport: string;
    arrival_airport: string;
    departure_time: string;
    arrival_time: string;
    duration: number;
    airplane: string;
    travel_class: string;
    legroom: string;
    extensions: string[];
    airline_logo: string;
}

interface Flight {
    flights: FlightLeg[];
    total_duration: number;
    price: number;
    type: string;
    carbon_emissions: {
        this_flight: number;
        typical_for_this_route: number;
        difference_percent: number;
    };
    airline_logo: string;
}

const FlightResults: React.FC = () => {
    const location = useLocation();
    const [flights, setFlights] = useState<Flight[]>([]);
    const [openFlightIndex, setOpenFlightIndex] = useState<number | null>(null); // State to manage dropdown visibility

    // Load flight data from the location or use the sample data
    useEffect(() => {
        if (location.state?.flights) {
            setFlights(location.state.flights);
        } else {
            setFlights(sampleFlightData.flights);
        }
    }, [location.state]);

    // Format duration from minutes to hours and minutes
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours} hr ${remainingMinutes} min`;
    };

    // Function to toggle dropdown details
    const toggleFlightDetails = (index: number) => {
        setOpenFlightIndex(openFlightIndex === index ? null : index);
    };

    return (
        <div className="flight-results">
            <h2>Flight Results</h2>
            {flights.length > 0 ? (
                <div className="flights-wrapper">
                    {flights.map((flight, index) => (
                        <div key={index} className="flight-card">
                            {/* Flight Header Section */}
                            <div className="flight-header" onClick={() => toggleFlightDetails(index)}>
                                <img src={flight.airline_logo} alt="Airline Logo" className="airline-logo" />
                                <div className="flight-details-header">
                                    <div>
                                        <h4>{flight.flights[0].airline}</h4> {/* Airline name added here */}
                                        <p>
                                            {new Date(flight.flights[0].departure_time).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}{" "}
                                            -{" "}
                                            {new Date(flight.flights[flight.flights.length - 1].arrival_time).toLocaleTimeString(
                                                [],
                                                { hour: "2-digit", minute: "2-digit" }
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p>Duration: {formatDuration(flight.total_duration)}</p>
                                    </div>
                                    <div>
                                        <p>{flight.flights.length === 1 ? "Nonstop" : `${flight.flights.length - 1} Stops`}</p>
                                    </div>
                                    <div>
                                        <p>CO₂: {flight.carbon_emissions.this_flight / 1000} kg</p>
                                        <p>+{flight.carbon_emissions.difference_percent}% emissions</p>
                                    </div>
                                </div>
                                <button className="dropdown-button">Price: ${flight.price}</button>
                            </div>

                            {/* Flight Details Section - Conditionally Rendered */}
                            {openFlightIndex === index && (
                                <div className="flight-details">
                                    {/* Carbon Emissions Section */}

                                    {/* Flight Legs Section */}
                                    <div className="flight-legs">
                                        {flight.flights.map((leg, legIndex) => (
                                            <div key={legIndex} className="flight-leg">
                                                <div className="flight-leg-info">
                                                    <img
                                                        src={leg.airline_logo}
                                                        alt={`${leg.airline} Logo`}
                                                        className="airline-logo-small"
                                                    />
                                                    <div>
                                                        <h4>
                                                            {new Date(leg.departure_time).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}{" "}
                                                            • {leg.departure_airport}
                                                        </h4>
                                                        <p>Travel time: {formatDuration(leg.duration)}</p>
                                                    </div>
                                                </div>
                                                <div className="flight-leg-info">
                                                    <div>
                                                        <h4>
                                                            {new Date(leg.arrival_time).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}{" "}
                                                            • {leg.arrival_airport}
                                                        </h4>
                                                        <p>
                                                            {leg.airline} • {leg.travel_class} • {leg.airplane} •{" "}
                                                            {leg.flight_number}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flight-leg-extensions">
                                                    <ul>
                                                        {leg.extensions.map((extension, extIndex) => (
                                                            <li key={extIndex}>{extension}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Select Flight Button */}
                                    <button className="select-flight-button">Select Flight</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No flights found.</p>
            )}
        </div>
    );
};

export default FlightResults;
