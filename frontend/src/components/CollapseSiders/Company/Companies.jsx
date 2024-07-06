import React from "react";
import PropTypes from "prop-types";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { Box } from "@mui/material";
import CompanySelect from "./CompanySelect";

export default function CollapseCompanies({
  country_code,
  setSelectedCompany,
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
          <CompanySelect
            country_code={country_code}
            setSelectedCompany={setSelectedCompany}
          />
        </Collapse>
      </Box>
    </Box>
  );
}

CollapseCompanies.propTypes = {
  country_code: PropTypes.string.isRequired,
  setSelectedCompany: PropTypes.func.isRequired,
};
