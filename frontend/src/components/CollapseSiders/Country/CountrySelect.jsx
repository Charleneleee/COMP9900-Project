import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import config from "../../../config.json";

const CountrySelect = ({ setCountryCode }) => {
  // Receive onCountryChange as prop
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null); // Track selected country

  useEffect(() => {
    const fetchData = () => {
      fetch(`${config.BACKEND_URL}/country/all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setCountries(data.countries);
        })
        .catch((error) => {
          console.error("Error fetching countries:", error);
        });
    };

    fetchData();
  }, []);

  const handleCountryChange = (event, newValue) => {
    setSelectedCountry(newValue);
    setCountryCode(newValue !== null ? newValue.code : ""); // Pass the country code to the parent component
  };

  return (
    <Autocomplete
      id="country-select-demo"
      options={countries.length > 0 ? countries : []}
      autoHighlight
      getOptionLabel={(option) => option.name}
      value={selectedCountry} // Set the selected country
      onChange={handleCountryChange} // Handle country selection change
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img
            loading="lazy"
            width="20"
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            alt=""
          />
          {option.name} ({option.code})
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a country"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
};

CountrySelect.propTypes = {
  setCountryCode: PropTypes.func.isRequired, // PropTypes for the callback function
};

export default CountrySelect;
