import React from "react";
import PropTypes from "prop-types";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { Box, Grid } from "@mui/material";
import CountrySelect from "./CountrySelect";

export default function CollapseCountries({
  setCountryCode1,
  setCountryCode2,
}) {
  const [expanded, setExpanded] = React.useState(true);
  const handleClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Box>
      <Box>
        <ListItemButton onClick={handleClick}>
          <ListItemText primary="Select Your Country" />
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </Box>

      <Box>
        <Collapse in={expanded}>
          <Grid container>
            <Grid item xs={6}>
              <CountrySelect setCountryCode={setCountryCode1} />
            </Grid>
            <Grid item xs={6}>
              <CountrySelect setCountryCode={setCountryCode2} />
            </Grid>
          </Grid>
        </Collapse>
      </Box>
    </Box>
  );
}

CollapseCountries.propTypes = {
  setCountryCode1: PropTypes.func.isRequired,
  setCountryCode2: PropTypes.func.isRequired,
};
