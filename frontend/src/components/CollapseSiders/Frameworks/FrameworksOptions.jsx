import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Box, IconButton, Tooltip } from "@mui/material";

import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

import config from "../../../config.json";
import { green, grey, orange } from "@mui/material/colors";

export default function FrameworkOptions({ setSelectedFramework }) {
  const [frameworks, setFrameworks] = useState([]);
  useEffect(() => {
    // get token from local storage
    const token = localStorage.getItem("token");

    // send request to get frameworks
    fetch(`${config.BACKEND_URL}/list/frameworks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token })
    })
      .then((response) => response.json())
      .then((data) => {
        setFrameworks(data.frameworks);
      })
      .catch((error) => {
        console.error("Error fetching frameworks:", error);
      });
  }, []);

  return (
    <FormControl>
      <RadioGroup
        onChange={(event) => {
          setSelectedFramework(event.target.value);
        }}
        sx={{ pl: 4 }}
      >
        {frameworks.map((item) => (
          <FormControlLabel
            key={item.name}
            value={item.name}
            control={<Radio />}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Tooltip title={<span>{item.description}</span>}>
                  {item.name}
                  <IconButton sx={{ marginRight: "5px" }}>
                    <ErrorOutlineOutlinedIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title={<span>Environmental Weight</span>}>
                  <Box
                    sx={{
                      width: "40px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: green[500],
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      marginRight: "5px"
                    }}
                  >
                    {item.E_weight}
                  </Box>
                </Tooltip>
                <Tooltip title={<span>Social Weight</span>}>
                  <Box
                    sx={{
                      width: "40px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: orange[500],
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      marginRight: "5px"
                    }}
                  >
                    {item.S_weight}
                  </Box>
                </Tooltip>
                <Tooltip title={<span>Governmental Weight</span>}>
                  <Box
                    sx={{
                      width: "40px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: grey[500],
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px"
                    }}
                  >
                    {item.G_weight}
                  </Box>
                </Tooltip>
              </Box>
            }
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

FrameworkOptions.propTypes = {
  setSelectedFramework: PropTypes.func.isRequired
};
