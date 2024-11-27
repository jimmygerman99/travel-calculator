// ParentComponent.tsx
import React, { useState } from "react";
import App from "../App";
import FlightSearch from "../pages/FlightSearch";
import { FormData } from "../interfaces/FormDataTypes";

const ParentComponent: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        creditCard: "",
        points: 0,
        destination: "",
        destinationType: "city",
        departureCity: "",
        departureDate: new Date(),
        departureAirport: "",
        returnDate: null,
        flightType: "economy",
        classType: "oneWay",
    });

    return (
        <>
            <App formData={formData} setFormData={setFormData} />
            <FlightSearch formData={formData} setFormData={setFormData} />
        </>
    );
};

export default ParentComponent;
