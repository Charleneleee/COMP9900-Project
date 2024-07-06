import { React, useState } from "react";
import PropTypes from "prop-types";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import MetricsOptions from "./MetricsOptions";
import { Box } from "@mui/material";

export default function CollapseMetrics({ data, setData }) {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box>
      <ListItemButton onClick={handleClick}>
        <ListItemText primary="METRICS & INDICATORS" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open}>
        <MetricsOptions data={data} setData={setData} />
      </Collapse>
    </Box>
  );
}

CollapseMetrics.propTypes = {
  data: PropTypes.array.isRequired,
  setData: PropTypes.func.isRequired,
};
