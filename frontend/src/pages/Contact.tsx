import React from "react";
import "../App.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { airportInfo } from "../assets/airports2";

interface AirportInfo {
    airport_name: string;
    iata: string;
    country: string | null;
    continent: string | null;
    city: string | null;
}

let options = airportInfo.map((ai: AirportInfo) => {
    return {
        label: ai.iata,
    };
});
console.log(options);
function Contact() {
    return (
        <Autocomplete
            disablePortal
            options={options}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Movie" />}
        />
    );
}

export default Contact;
