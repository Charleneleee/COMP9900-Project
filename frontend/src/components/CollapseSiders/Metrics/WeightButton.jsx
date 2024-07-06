import React, { useState } from "react";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

export default function WeightButton({ initial_weight, onWeightSave }) {
  const [weight, setWeight] = useState(initial_weight);
  const [open, setOpen] = useState(false);

  const handleSliderChange = (event, newValue) => {
    setWeight(newValue);
    onWeightSave(newValue);
  };

  const handleButtonClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Button variant="outlined" onClick={handleButtonClick}>
        {weight.toFixed(2)}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Adjust Weight</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Please enter a value between 0 and 1
          </Typography>
          <Slider
            value={weight}
            onChange={handleSliderChange}
            aria-labelledby="weight-slider"
            step={0.1}
            min={0}
            max={1}
            valueLabelDisplay="auto"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// WeightButton prop validation
WeightButton.propTypes = {
  initial_weight: PropTypes.number.isRequired,
  onWeightSave: PropTypes.func.isRequired,
};
