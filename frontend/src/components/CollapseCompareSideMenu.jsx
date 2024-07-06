import { React, useState } from "react";
import PropTypes from "prop-types";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Grid from "@mui/material/Grid";

import CollapseFrameworks from "./CollapseSiders/Frameworks/Frameworks";
import CollapseMetrics from "./CollapseSiders/Metrics/Metrics";
import CollapseCountries from "./CollapseSiders/Country/CompareCountries";
import CollapseCompanies from "./CollapseSiders/Company/CompareCompanies";

import config from "../config.json";

export default function CollapseSiderMenu({
  data,
  setData,
  company_name,
  setSelectedCompany1,
  setSelectedCompany2,
  setSelectedFramework,
}) {
  const [country_code_1, setCountryCode1] = useState("");
  const [country_code_2, setCountryCode2] = useState("");

  const handleAddCompanyToFavorites = () => {
    fetch(`${config.BACKEND_URL}/create/favourite_company`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        company_name: company_name,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Network response was not ok");
          return response.json();
        }
        return response.json();
      })
      .then(
        (data) => {
          if (data.error) {
            // check if there is any error message
            console.error(data.error);
          } else {
            alert(data.message);
          }
        },
        (error) => {
          console.error("Error:", error);
        }
      );
  };

  return (
    <Box sx={{ borderRadius: 2, boxShadow: 3, m: 1, p: 1 }}>
      <List sx={{ width: "100%", maxWidth: 500 }}>
        <Grid container>
          {/* Countries */}
          <Grid item xs={12}>
            <CollapseCountries
              setCountryCode1={setCountryCode1}
              setCountryCode2={setCountryCode2}
            />
          </Grid>

          {/* Company */}
          <Grid item xs={12}>
            <CollapseCompanies
              country_code_1={country_code_1}
              country_code_2={country_code_2}
              setSelectedCompany1={setSelectedCompany1}
              setSelectedCompany2={setSelectedCompany2}
            />
          </Grid>

          {/* Frameworks */}
          <Grid item xs={12}>
            <CollapseFrameworks setSelectedFramework={setSelectedFramework} />
          </Grid>

          {/* Metrics & Indicators */}
          <Grid item xs={12}>
            <CollapseMetrics data={data} setData={setData} />
          </Grid>

          {/* Years */}
          {/* <Grid item xs={12}>
            <CollapseYears />
          </Grid> */}

          {/* Additional Indicators */}
          {/* <Grid item xs={12}>
            <CollapseAdditions />
          </Grid> */}

          <Grid item xs={6} />
          <Grid
            item
            xs={6}
            display="flex"
            justifyContent="right
        "
          >
            {company_name && (
              <Button variant="contained" onClick={handleAddCompanyToFavorites}>
                Add Company to Favourites
              </Button>
            )}
          </Grid>
        </Grid>
      </List>
    </Box>
  );
}

CollapseSiderMenu.propTypes = {
  data: PropTypes.array.isRequired,
  setData: PropTypes.func.isRequired,
  company_name: PropTypes.string.isRequired,
  setSelectedCompany1: PropTypes.func.isRequired,
  setSelectedCompany2: PropTypes.func.isRequired,
  setSelectedFramework: PropTypes.func.isRequired,
};
