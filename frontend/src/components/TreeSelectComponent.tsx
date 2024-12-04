import React, { useEffect, useState } from "react";
import { TreeSelect } from "antd";
import type { TreeSelectProps } from "antd";
import axios from "axios";
import Fuse from "fuse.js"; // Import Fuse.js

export const TreeSelectComponent: React.FC = () => {
    const [value, setValue] = useState<string | undefined>();
    const [treeData, setTreeData] = useState<TreeSelectProps["treeData"]>([]);
    const [fuse, setFuse] = useState<Fuse<any> | null>(null);

    // Fetch the airports summary data when the component mounts
    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/airports-summary");
                const data = response.data;

                // Define a map to normalize city names
                const cityNormalizationMap: { [key: string]: string } = {
                    "Cincinnati / Covington": "Cincinnati",
                    "New York City": "New York",
                    NYC: "New York",
                };

                // Group airports by the normalized country and city name
                const groupedData = data.reduce((acc: any, airport: any) => {
                    const country = airport.country || "Unknown Country";
                    const normalizedCity = cityNormalizationMap[airport.city] || airport.city;

                    if (!acc[country]) {
                        acc[country] = {};
                    }

                    if (!acc[country][normalizedCity]) {
                        acc[country][normalizedCity] = [];
                    }

                    acc[country][normalizedCity].push({
                        value: airport.iata_code,
                        title: `${airport.airport_name} (${airport.iata_code})`,
                    });
                    return acc;
                }, {});

                // Sort countries alphabetically
                const sortedCountries = Object.keys(groupedData).sort();

                // Create the tree structure from the sorted data
                const formattedTreeData = sortedCountries.map((country) => {
                    const sortedCities = Object.keys(groupedData[country]).sort();

                    return {
                        title: country,
                        value: country,
                        selectable: false,
                        children: sortedCities.map((city) => ({
                            title: city,
                            value: `${country}-${city}`,
                            selectable: false,
                            children: groupedData[country][city],
                        })),
                    };
                });

                setTreeData(formattedTreeData);

                // Initialize Fuse.js for fuzzy search
                const flattenedData = formattedTreeData.flatMap((country: any) =>
                    country.children.flatMap((city: any) => [
                        ...city.children.map((airport: any) => ({
                            title: airport.title,
                            value: airport.value,
                            country: country.title,
                            city: city.title,
                        })),
                    ])
                );

                setFuse(
                    new Fuse(flattenedData, {
                        keys: ["title", "value", "country", "city"],
                        threshold: 0.4,
                    })
                );
            } catch (error) {
                console.error("Error fetching airport data:", error);
            }
        };

        fetchAirports();
    }, []);

    const onChange = (newValue: string) => {
        setValue(newValue);
    };

    const onSearch = (searchText: string) => {
        if (!fuse || searchText.trim() === "") {
            setTreeData((prevData) => [...(prevData || [])]);
            return;
        }

        const searchResults = fuse.search(searchText);
        const matchedData = searchResults.map((result) => result.item);

        const groupedResults = matchedData.reduce((acc: any, airport: any) => {
            if (!acc[airport.country]) {
                acc[airport.country] = {};
            }
            if (!acc[airport.country][airport.city]) {
                acc[airport.country][airport.city] = [];
            }
            acc[airport.country][airport.city].push({
                title: airport.title,
                value: airport.value,
            });
            return acc;
        }, {});

        const formattedSearchResults = Object.keys(groupedResults).map((country) => ({
            title: country,
            value: country,
            selectable: false,
            children: Object.keys(groupedResults[country]).map((city) => ({
                title: city,
                value: `${country}-${city}`,
                selectable: false,
                children: groupedResults[country][city],
            })),
        }));

        setTreeData(formattedSearchResults);
    };

    return (
        <TreeSelect
            showSearch
            style={{ width: "100%" }}
            value={value}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            placeholder="Please select an airport"
            allowClear
            treeDefaultExpandAll
            onChange={onChange}
            treeData={treeData}
            onSearch={onSearch} // Enable search with fuzzy matching
        />
    );
};

export default TreeSelectComponent;
