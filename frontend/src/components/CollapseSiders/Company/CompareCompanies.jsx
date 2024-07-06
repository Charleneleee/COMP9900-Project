import React from "react";
import PropTypes from "prop-types";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { Box, Grid } from "@mui/material";
import CompanySelect from "./CompanySelect";

export default function CollapseCompanies({
  country_code_1,
  country_code_2,
  setSelectedCompany1,
  setSelectedCompany2,
}) {
  const [expanded, setExpanded] = React.useState(true);
  const handleClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Box>
      <Box>
        <ListItemButton onClick={handleClick}>
          <ListItemText primary="Select Your Company" />
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </Box>

      <Box>
        <Collapse in={expanded}>
          <Grid container>
            <Grid item xs={6}>
              <CompanySelect
                country_code={country_code_1}
                setSelectedCompany={setSelectedCompany1}
              />
            </Grid>
            <Grid item xs={6}>
              <CompanySelect
                country_code={country_code_2}
                setSelectedCompany={setSelectedCompany2}
              />
            </Grid>
          </Grid>
        </Collapse>
      </Box>
    </Box>
  );
}

CollapseCompanies.propTypes = {
  country_code_1: PropTypes.string.isRequired,
  country_code_2: PropTypes.string.isRequired,
  setSelectedCompany1: PropTypes.func.isRequired,
  setSelectedCompany2: PropTypes.func.isRequired,
};
