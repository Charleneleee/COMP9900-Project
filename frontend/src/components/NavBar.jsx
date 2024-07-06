import React, { useState } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom"; // Import useLocation hook

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import LightbulbCircleIcon from "@mui/icons-material/LightbulbCircle";

import {
  Grid,
  FormControlLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import PaletteIcon from "@mui/icons-material/Palette";

import AvatarMenu from "./AvatarMenu";
import { ColorPalette } from "./ColorPalette";
import { Link } from "react-router-dom";

export default function NavBar({ setThemeColor, avatarImage }) {
  // Use useLocation hook to get current location
  const location = useLocation();

  // Set initial view based on current location
  const initialView =
    location.pathname === "/main/single"
      ? "single-company-view"
      : "comparison-view";
  const [view, setView] = useState(initialView);
  const [openDialog, setOpenDialog] = useState(false);

  const handleViewChange = (event) => {
    setView(event.target.value);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Function to check if ToggleButtonGroup should be shown
  const shouldShowToggleButtonGroup = () => {
    return (
      location.pathname !== "/user/profile" &&
      location.pathname !== "/user/history"
    );
  };

  return (
    <AppBar position="static" sx={{ borderRadius: 2 }}>
      <Toolbar>
        <Grid container padding={2}>
          {/* Logo */}
          <Grid
            item
            container
            xs={1}
            justifyContent="center"
            alignItems="center"
          >
            <Link to="/main/single">
              <IconButton>
                <LightbulbCircleIcon fontSize="large" />
              </IconButton>
            </Link>
          </Grid>

          {/* View Selection Toggle Buttons */}

          <Grid
            item
            container
            xs={10}
            spacing={2}
            alignContent="center"
            justifyContent="center"
          >
            <Grid
              item
              container
              xs={4}
              justifyContent="center"
              alignContent="center"
            >
              {shouldShowToggleButtonGroup() && (
                <ToggleButtonGroup
                  color="primary"
                  sx={{ bgcolor: "white" }}
                  value={view}
                  exclusive
                  onChange={handleViewChange}
                  aria-label="View Selection"
                >
                  <ToggleButton
                    component={Link}
                    to="/main/single"
                    value="single-company-view"
                  >
                    Single Company View
                  </ToggleButton>
                  <ToggleButton
                    component={Link}
                    to="/main/multi"
                    value="comparison-view"
                  >
                    Comparison View
                  </ToggleButton>
                </ToggleButtonGroup>
              )}
            </Grid>
          </Grid>

          {/* Theme Color Palette and Avatar Menu */}
          <Grid
            item
            container
            xs={1}
            justifyContent="center"
            alignItems="center"
          >
            <FormControlLabel
              control={
                <IconButton
                  onClick={handleOpenDialog}
                  sx={{
                    background: "none",
                    borderColor: "black",
                    padding: "0",
                  }}
                >
                  <PaletteIcon />
                </IconButton>
              }
            ></FormControlLabel>
            <AvatarMenu avatarImage={avatarImage} />
          </Grid>
        </Grid>
      </Toolbar>

      {/* Dialog for theme selection */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Select Theme Color</DialogTitle>
        <DialogContent>
          <ColorPalette setThemeColor={setThemeColor} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}

NavBar.propTypes = {
  setThemeColor: PropTypes.func.isRequired,
  avatarImage: PropTypes.string.isRequired,
};
