import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import config from "../../../config.json";

const CompanySelect = ({ country_code, setSelectedCompany }) => {
  const [companies, setCompanies] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    // Reset Autocomplete input value when country_code changes
    setValue("");

    const fetchData = () => {
      fetch(`${config.BACKEND_URL}/company/by_country`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ country_code }),
      })
        .then((response) => response.json())
        .then((data) => {
          setCompanies(data.companies);
        })
        .catch((error) => {
          console.error("Error fetching companies:", error);
        });
    };

    fetchData();
  }, [country_code]); // Add country_code to dependencies

  return (
    <Autocomplete
      id="company-select-demo"
      disabled={country_code === ""}
      options={companies ? companies : []}
      autoHighlight
      value={value} // Set value for Autocomplete
      onChange={(event, newValue) => {
        setValue(newValue); // Update input value when selection changes
        setSelectedCompany(newValue);
      }}
      getOptionLabel={(option) => option}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          {option}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          disabled={country_code === ""}
          label="Choose a company"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
};

export default CompanySelect;

CompanySelect.propTypes = {
  country_code: PropTypes.string.isRequired,
  setSelectedCompany: PropTypes.func.isRequired,
};
