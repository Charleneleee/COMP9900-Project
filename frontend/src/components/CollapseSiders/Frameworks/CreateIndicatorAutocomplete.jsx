import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import PropTypes from "prop-types";

import config from "../../../config.json";

export default function CreateIndicatorAutoComplete({ pillar, onSelect }) {
  const [selectedValue, setSelectedValue] = useState(null);
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    fetch(`${config.BACKEND_URL}/list/metrics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pillar }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setMetrics(data.metrics);
      })
      .catch((error) => {
        console.error("Error fetching metrics:", error);
      });
  }, []);

  const handleSelect = (event, value) => {
    if (value) {
      setSelectedValue(value); // Set the selected label to state
      onSelect(value); // Call the parent component's onSelect callback with the selected label
    } else {
      setSelectedValue(null);
    }
  };

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={metrics}
      value={selectedValue}
      onChange={handleSelect}
      getOptionLabel={(option) => option} // Define how to display options
      renderInput={(params) => <TextField {...params} label="Metric Name" />}
    />
  );
}

CreateIndicatorAutoComplete.propTypes = {
  pillar: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
