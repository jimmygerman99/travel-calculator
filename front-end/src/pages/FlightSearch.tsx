import React from "react";
import "../App.css";
const FlightSearch = () => {
    return (
        <div className="website">
            <div className="content">This is the FlightSearch Page</div>
            <div className="searchFlights">
                <form onSubmit={handleSubmit}>
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
                    <input type="text" id="departure" name="departure" value={formData.departure} onChange={handleChange} />

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
    );
};

export default FlightSearch;
