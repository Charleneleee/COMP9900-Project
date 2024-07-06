import React from "react";
import PropTypes from "prop-types";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import FrameworkOptions from "./FrameworksOptions";
import { Box, Button } from "@mui/material";
import { CustomizeDialog } from "./CustomizeDialog";

export default function CollapseFrameworks({ setSelectedFramework }) {
  const [expanded, setExpanded] = React.useState(true);
  const handleClick = () => {
    setExpanded(!expanded);
  };

  const [dialog_open, setDialogOpen] = React.useState(false);
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Box>
      <Box>
        <ListItemButton onClick={handleClick}>
          <ListItemText primary="FRAMEWORKS" />
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </Box>

      <Box>
        <Collapse in={expanded}>
          <FrameworkOptions setSelectedFramework={setSelectedFramework} />
          <Box sx={{ pl: 4 }}>
            <Button variant="outlined" onClick={handleDialogOpen}>
              + Customize A Framework
            </Button>
          </Box>
          <CustomizeDialog open={dialog_open} handleClose={handleDialogClose} />
        </Collapse>
      </Box>
    </Box>
  );
}

CollapseFrameworks.propTypes = {
  setSelectedFramework: PropTypes.func.isRequired,
};
